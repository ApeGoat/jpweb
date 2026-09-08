package com.jpwebsite.backend.gallery;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import com.jpwebsite.backend.storage.StorageService;
import com.jpwebsite.backend.storage.StoredObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

// Opt-in: only use the disposable database described in backend/README.md.
@EnabledIfEnvironmentVariable(named = "GALLERY_DATABASE_TEST", matches = "true")
@DataJpaTest(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:55439/gallery_test",
    "spring.datasource.username=gallery_test", "spring.datasource.password=gallery_test",
    "spring.jpa.hibernate.ddl-auto=validate"
})
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(GalleryImageService.class)
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class GalleryOrderingDatabaseTest {
    @Autowired GalleryImageService service;
    @Autowired JdbcTemplate jdbc;
    @Autowired PlatformTransactionManager transactions;
    @MockitoBean StorageService storage;

    @BeforeEach void fixtures() {
        jdbc.update("DELETE FROM gallery_images");
        jdbc.update("""
            INSERT INTO gallery_images (id, image_url, storage_key, caption, alt_text, visible, display_order, created_at, updated_at)
            VALUES (5, 'https://example.com/five', 'original/five', 'Five', 'Alt five', true, 10, '2020-01-01', '2020-01-01'),
                   (2, 'https://example.com/two', 'original/two', 'Two', 'Alt two', false, 10, '2021-01-01', '2021-01-01'),
                   (8, 'https://example.com/eight', 'original/eight', 'Eight', 'Alt eight', true, 90, '2022-01-01', '2022-01-01')
            """);
        jdbc.queryForObject("SELECT setval(pg_get_serial_sequence('gallery_images', 'id'), 8)", Long.class);
    }
    Object metadata() {
        return jdbc.queryForList("SELECT id, image_url, storage_key, caption, alt_text, visible, created_at FROM gallery_images ORDER BY id");
    }
    @Test void migrationPreservesEffectiveOrderAndEveryMetadataValue() throws Exception {
        var before = metadata();
        var oldOrder = service.adminList().stream().map(i -> i.id()).toList();
        var sql = new ClassPathResource("db/migration/V4__normalize_gallery_order.sql").getContentAsString(StandardCharsets.UTF_8);
        jdbc.execute(sql);
        assertThat(service.adminList()).extracting(i -> i.id()).containsExactlyElementsOf(oldOrder);
        assertThat(service.adminList()).extracting(i -> i.displayOrder()).containsExactly(0, 1, 2);
        assertThat(metadata()).isEqualTo(before);
        verifyNoInteractions(storage);
    }
    @Test void committedReorderIsVisibleInFreshAdminAndPublicReadsWithoutChangingImages() {
        var before = metadata();
        service.reorder(List.of(8L, 2L, 5L));
        assertThat(service.adminList()).extracting(i -> i.id()).containsExactly(8L, 2L, 5L);
        assertThat(service.publicList()).extracting(i -> i.id()).containsExactly(8L, 5L);
        assertThat(service.adminList()).extracting(i -> i.displayOrder()).containsExactly(0, 1, 2);
        assertThat(metadata()).isEqualTo(before);
        verifyNoInteractions(storage);
    }
    @Test void transactionRollbackRestoresEveryOrderValue() {
        var before = jdbc.queryForList("SELECT id, display_order FROM gallery_images ORDER BY id");
        var transaction = new TransactionTemplate(transactions);
        assertThatThrownBy(() -> transaction.executeWithoutResult(status -> {
            service.reorder(List.of(8L, 5L, 2L));
            // Force SQL to flush before failing the surrounding transaction.
            service.adminList();
            throw new IllegalStateException("Simulated failure");
        })).isInstanceOf(IllegalStateException.class);
        assertThat(jdbc.queryForList("SELECT id, display_order FROM gallery_images ORDER BY id")).isEqualTo(before);
        verifyNoInteractions(storage);
    }
    @Test void uploadedImagePersistsAtEndAndExistingMetadataIsUntouched() {
        var before = metadata();
        var file = new MockMultipartFile("file", "new.png", "image/png", new byte[]{1});
        when(storage.uploadGalleryImage(file)).thenReturn(new StoredObject("new/key", "https://example.com/new"));
        var created = service.upload(file, "New", "Alt new");
        assertThat(service.adminList()).extracting(i -> i.id()).containsExactly(2L, 5L, 8L, created.id());
        assertThat(service.publicList()).extracting(i -> i.id()).containsExactly(5L, 8L, created.id());
        jdbc.update("DELETE FROM gallery_images WHERE id = ?", created.id());
        assertThat(metadata()).isEqualTo(before);
        verify(storage).uploadGalleryImage(file);
        verifyNoMoreInteractions(storage);
    }
}

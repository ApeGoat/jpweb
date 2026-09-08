package com.jpwebsite.backend.gallery;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.jpwebsite.backend.storage.StorageService;
import com.jpwebsite.backend.storage.StoredObject;
import com.jpwebsite.backend.gallery.dto.GalleryImageRequest;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class GalleryImageServiceTest {
    @Mock GalleryImageRepository repository;
    @Mock StorageService storage;
    GalleryImage image(long id, int order, boolean visible) {
        GalleryImage image = new GalleryImage();
        ReflectionTestUtils.setField(image, "id", id);
        image.setImageUrl("https://images.example/" + id);
        image.setStorageKey("gallery/existing/" + id);
        image.setCaption("Caption " + id);
        image.setAltText("Alt " + id);
        image.setVisible(visible);
        image.setDisplayOrder(order);
        return image;
    }
    @Test void reorderOnlyChangesOrderIncludingHiddenImagesAndReadsBackSavedSequence() {
        var first = image(5, 10, true);
        var second = image(2, 10, false);
        var before = List.of(first, second).stream().map(i ->
            List.of(i.getId(), i.getImageUrl(), i.getStorageKey(), i.getCaption(), i.getAltText(), i.isVisible())).toList();
        when(repository.findAllByOrderByDisplayOrderAscCreatedAtDescIdAsc())
            .thenReturn(List.of(first, second), List.of(second, first));
        when(repository.findByVisibleTrueOrderByDisplayOrderAscCreatedAtDescIdAsc()).thenReturn(List.of(first));
        var service = new GalleryImageService(repository, storage);
        assertThat(service.reorder(List.of(2L, 5L))).extracting(r -> r.id()).containsExactly(2L, 5L);
        assertThat(second.getDisplayOrder()).isZero();
        assertThat(first.getDisplayOrder()).isEqualTo(1);
        assertThat(List.of(first, second).stream().map(i ->
            List.of(i.getId(), i.getImageUrl(), i.getStorageKey(), i.getCaption(), i.getAltText(), i.isVisible())).toList()).isEqualTo(before);
        assertThat(service.adminList()).extracting(r -> r.id()).containsExactly(2L, 5L);
        assertThat(service.publicList()).extracting(r -> r.id()).containsExactly(5L);
        verify(repository).lockOrdering();
        verifyNoInteractions(storage);
    }
    @Test void rejectsIncompleteDuplicateUnknownAndNullIdsBeforeChangingAnything() {
        var first = image(1, 7, true);
        var second = image(2, 20, true);
        when(repository.findAllByOrderByDisplayOrderAscCreatedAtDescIdAsc()).thenReturn(List.of(first, second));
        var service = new GalleryImageService(repository, storage);
        for (List<Long> ids : Arrays.asList(List.of(1L), List.of(1L, 1L), List.of(1L, 3L), Arrays.asList(1L, null), List.<Long>of())) {
            assertThatThrownBy(() -> service.reorder(ids)).isInstanceOf(ResponseStatusException.class);
            assertThat(first.getDisplayOrder()).isEqualTo(7);
            assertThat(second.getDisplayOrder()).isEqualTo(20);
        }
        verifyNoInteractions(storage);
    }
    @Test void uploadAppendsEvenWhenExistingOrderHasGapsDuplicatesOrMaximumInteger() {
        var first = image(1, Integer.MAX_VALUE, true);
        var second = image(2, Integer.MAX_VALUE, false);
        when(repository.findAllByOrderByDisplayOrderAscCreatedAtDescIdAsc()).thenReturn(List.of(first, second));
        var file = new MockMultipartFile("file", "new.png", "image/png", new byte[]{1});
        when(storage.uploadGalleryImage(file)).thenReturn(new StoredObject("gallery/new", "https://images.example/new"));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));
        var result = new GalleryImageService(repository, storage).upload(file, "New", "New alt");
        assertThat(result.displayOrder()).isEqualTo(2);
        assertThat(first.getDisplayOrder()).isZero();
        assertThat(second.getDisplayOrder()).isEqualTo(1);
        assertThat(first.getStorageKey()).isEqualTo("gallery/existing/1");
        verify(storage).uploadGalleryImage(file);
        verifyNoMoreInteractions(storage);
    }
    @Test void metadataEditDoesNotOverwriteSavedOrder() {
        var image = image(1, 8, true);
        when(repository.findById(1L)).thenReturn(Optional.of(image));
        when(repository.save(image)).thenReturn(image);
        var result = new GalleryImageService(repository, storage).update(1L, new GalleryImageRequest("Edited", "Alt", false));
        assertThat(result.displayOrder()).isEqualTo(8);
        verifyNoInteractions(storage);
    }
}

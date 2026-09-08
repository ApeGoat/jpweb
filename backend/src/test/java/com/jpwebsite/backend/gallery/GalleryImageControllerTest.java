package com.jpwebsite.backend.gallery;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.*;
import java.util.List;
import com.jpwebsite.backend.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = GalleryImageController.class, properties = {"app.admin.username=test", "app.admin.password=test"})
@Import(SecurityConfig.class)
class GalleryImageControllerTest {
    @Autowired MockMvc mvc;
    @MockitoBean GalleryImageService service;
    @Test void reorderRequiresAuthentication() throws Exception {
        mvc.perform(put("/api/admin/gallery/reorder").contentType(MediaType.APPLICATION_JSON).content("[5,2]"))
            .andExpect(status().isForbidden());
        verifyNoInteractions(service);
    }
    @Test @WithMockUser(roles = "ADMIN") void acceptsCompleteIdArrayUsingAdminSession() throws Exception {
        when(service.reorder(List.of(5L, 2L))).thenReturn(List.of());
        mvc.perform(put("/api/admin/gallery/reorder").contentType(MediaType.APPLICATION_JSON).content("[5,2]"))
            .andExpect(status().isOk());
        verify(service).reorder(List.of(5L, 2L));
    }
}

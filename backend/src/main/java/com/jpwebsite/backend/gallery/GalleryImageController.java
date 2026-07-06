package com.jpwebsite.backend.gallery;

import com.jpwebsite.backend.gallery.dto.GalleryImageRequest;
import com.jpwebsite.backend.gallery.dto.GalleryImageResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import java.net.URI;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Validated
@RestController
public class GalleryImageController {
    private final GalleryImageService service;
    public GalleryImageController(GalleryImageService service) { this.service = service; }
    @GetMapping("/api/gallery")
    public List<GalleryImageResponse> publicList() { return service.publicList(); }
    @GetMapping("/api/admin/gallery")
    public List<GalleryImageResponse> adminList() { return service.adminList(); }
    @PostMapping(value = "/api/admin/gallery/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GalleryImageResponse> upload(@RequestPart("file") MultipartFile file,
            @RequestParam(required = false) @Size(max = 500) String caption,
            @RequestParam(required = false) @Size(max = 500) String altText) {
        GalleryImageResponse created = service.upload(file, caption, altText);
        return ResponseEntity.created(URI.create("/api/admin/gallery/" + created.id())).body(created);
    }
    @PutMapping("/api/admin/gallery/{id}")
    public GalleryImageResponse update(@PathVariable Long id, @Valid @RequestBody GalleryImageRequest request) {
        return service.update(id, request);
    }
    @DeleteMapping("/api/admin/gallery/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

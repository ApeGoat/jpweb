package com.jpwebsite.backend.publication;

import com.jpwebsite.backend.publication.dto.PublicationRequest;
import com.jpwebsite.backend.publication.dto.PublicationResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PublicationController {
    private final PublicationService service;
    public PublicationController(PublicationService service) { this.service = service; }

    @GetMapping("/api/publications")
    public List<PublicationResponse> publicList() { return service.publicList(); }
    @GetMapping("/api/admin/publications")
    public List<PublicationResponse> adminList() { return service.adminList(); }
    @PostMapping("/api/admin/publications")
    public ResponseEntity<PublicationResponse> create(@Valid @RequestBody PublicationRequest request) {
        PublicationResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/publications/" + created.id())).body(created);
    }
    @PutMapping("/api/admin/publications/{id}")
    public PublicationResponse update(@PathVariable Long id, @Valid @RequestBody PublicationRequest request) {
        return service.update(id, request);
    }
    @DeleteMapping("/api/admin/publications/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

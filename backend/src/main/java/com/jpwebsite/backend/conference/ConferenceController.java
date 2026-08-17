package com.jpwebsite.backend.conference;

import com.jpwebsite.backend.conference.dto.ConferenceRequest;
import com.jpwebsite.backend.conference.dto.ConferenceResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ConferenceController {
    private final ConferenceService service;
    public ConferenceController(ConferenceService service) { this.service = service; }

    @GetMapping("/api/conferences")
    public List<ConferenceResponse> publicList() { return service.publicList(); }

    @GetMapping("/api/admin/conferences")
    public List<ConferenceResponse> adminList() { return service.adminList(); }

    @PostMapping("/api/admin/conferences")
    public ResponseEntity<ConferenceResponse> create(@Valid @RequestBody ConferenceRequest request) {
        ConferenceResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/conferences/" + created.id())).body(created);
    }

    @PutMapping("/api/admin/conferences/{id}")
    public ConferenceResponse update(@PathVariable Long id, @Valid @RequestBody ConferenceRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/api/admin/conferences/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

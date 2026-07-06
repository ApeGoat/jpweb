package com.jpwebsite.backend.contact;

import com.jpwebsite.backend.contact.dto.ContactInquiryResponse;
import com.jpwebsite.backend.contact.dto.ContactRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ContactController {
    private final ContactService service;
    public ContactController(ContactService service) { this.service = service; }

    @PostMapping("/api/contact")
    public ResponseEntity<ContactInquiryResponse> submit(@Valid @RequestBody ContactRequest request) {
        ContactInquiryResponse created = service.submit(request);
        return ResponseEntity.created(URI.create("/api/admin/inquiries/" + created.id())).body(created);
    }
    @GetMapping("/api/admin/inquiries")
    public List<ContactInquiryResponse> list() { return service.list(); }
    @PutMapping("/api/admin/inquiries/{id}/status")
    public ContactInquiryResponse updateStatus(@PathVariable Long id,
            @RequestParam @NotNull InquiryStatus status) {
        return service.updateStatus(id, status);
    }
}

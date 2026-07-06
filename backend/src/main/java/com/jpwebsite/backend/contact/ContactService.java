package com.jpwebsite.backend.contact;

import com.jpwebsite.backend.contact.dto.ContactInquiryResponse;
import com.jpwebsite.backend.contact.dto.ContactRequest;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ContactService {
    private final ContactInquiryRepository repository;
    public ContactService(ContactInquiryRepository repository) { this.repository = repository; }

    @Transactional
    public ContactInquiryResponse submit(ContactRequest request) {
        ContactInquiry inquiry = new ContactInquiry();
        inquiry.setName(request.name());
        inquiry.setEmail(request.email());
        inquiry.setCompany(request.company());
        inquiry.setInquiryType(request.inquiryType());
        inquiry.setMessage(request.message());
        inquiry.setStatus(InquiryStatus.NEW);
        ContactInquiry saved = repository.save(inquiry);
        // TODO Forward the inquiry by email after persistence, preferably through a durable queue/outbox.
        return ContactInquiryResponse.from(saved);
    }
    public List<ContactInquiryResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(ContactInquiryResponse::from).toList();
    }
    @Transactional
    public ContactInquiryResponse updateStatus(Long id, InquiryStatus status) {
        ContactInquiry inquiry = repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact inquiry not found"));
        inquiry.setStatus(status);
        return ContactInquiryResponse.from(repository.save(inquiry));
    }
}

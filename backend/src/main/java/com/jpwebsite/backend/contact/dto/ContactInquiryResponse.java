package com.jpwebsite.backend.contact.dto;

import com.jpwebsite.backend.contact.ContactInquiry;
import com.jpwebsite.backend.contact.InquiryStatus;
import java.time.Instant;

public record ContactInquiryResponse(Long id, String name, String email, String company,
        String inquiryType, String message, InquiryStatus status, Instant createdAt) {
    public static ContactInquiryResponse from(ContactInquiry value) {
        return new ContactInquiryResponse(value.getId(), value.getName(), value.getEmail(), value.getCompany(),
                value.getInquiryType(), value.getMessage(), value.getStatus(), value.getCreatedAt());
    }
}

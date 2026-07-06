package com.jpwebsite.backend.contact;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "contact_inquiries")
public class ContactInquiry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false, length = 320) private String email;
    private String company;
    @Column(name = "inquiry_type", length = 100) private String inquiryType;
    @Column(nullable = false, columnDefinition = "text") private String message;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private InquiryStatus status;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;

    protected ContactInquiry() {}
    @PrePersist void createTimestamp() { createdAt = Instant.now(); }
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getInquiryType() { return inquiryType; }
    public void setInquiryType(String inquiryType) { this.inquiryType = inquiryType; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public InquiryStatus getStatus() { return status; }
    public void setStatus(InquiryStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
}

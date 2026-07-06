package com.jpwebsite.backend.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Email @Size(max = 320) String email,
        @Size(max = 255) String company,
        @Size(max = 100) String inquiryType,
        @NotBlank @Size(max = 10000) String message) {
}

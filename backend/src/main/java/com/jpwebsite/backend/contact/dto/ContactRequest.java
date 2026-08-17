package com.jpwebsite.backend.contact.dto;

import com.jpwebsite.backend.contact.CorrespondenceLanguage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Email @Size(max = 320) String email,
        @Size(max = 255) String company,
        @NotBlank @Size(max = 100) String inquiryType,
        @NotNull CorrespondenceLanguage correspondenceLanguage,
        @NotBlank @Size(max = 10000) String message) {
}

package com.jpwebsite.backend.contact;

import static org.assertj.core.api.Assertions.assertThat;

import com.jpwebsite.backend.contact.dto.ContactRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

class ContactRequestValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void rejectsMissingAndInvalidRequiredFields() {
        ContactRequest request = new ContactRequest("", "not-an-email", null, "", null, "");

        var fields = validator.validate(request).stream()
                .map(violation -> violation.getPropertyPath().toString())
                .collect(java.util.stream.Collectors.toSet());

        assertThat(fields).contains("name", "email", "inquiryType", "correspondenceLanguage", "message");
    }
}

package com.jpwebsite.backend.contact;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.jpwebsite.backend.contact.dto.ContactRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {
    @Mock ContactInquiryRepository repository;
    @Mock ContactEmailService emailService;

    @Test
    void savesAndEmailsAValidInquiry() {
        ContactRequest request = new ContactRequest(
                "Jane", "jane@example.com", null, "Media", CorrespondenceLanguage.FR, "Interview request");
        when(repository.save(any(ContactInquiry.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = new ContactService(repository, emailService).submit(request);

        assertThat(result.name()).isEqualTo("Jane");
        assertThat(result.status()).isEqualTo(InquiryStatus.NEW);
        assertThat(result.correspondenceLanguage()).isEqualTo(CorrespondenceLanguage.FR);
        verify(emailService).send(request);
    }
}

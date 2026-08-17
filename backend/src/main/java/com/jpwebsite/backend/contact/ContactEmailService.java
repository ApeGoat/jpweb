package com.jpwebsite.backend.contact;

import com.jpwebsite.backend.contact.dto.ContactRequest;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Service
public class ContactEmailService {
    private static final Logger log = LoggerFactory.getLogger(ContactEmailService.class);
    private static final String RESEND_EMAILS_URL = "https://api.resend.com/emails";

    private final RestClient restClient;
    private final String apiKey;
    private final String toEmail;
    private final String fromEmail;

    public ContactEmailService(
            RestClient.Builder restClientBuilder,
            @Value("${app.resend.api-key:}") String apiKey,
            @Value("${app.contact.to-email:}") String toEmail,
            @Value("${app.contact.from-email:}") String fromEmail) {
        this.restClient = restClientBuilder.build();
        this.apiKey = apiKey;
        this.toEmail = toEmail;
        this.fromEmail = fromEmail;
    }

    public void send(ContactRequest request) {
        requireConfiguration();
        ResendEmailRequest email = new ResendEmailRequest(
                fromEmail,
                List.of(toEmail),
                frenchSubject(request),
                formatBody(request),
                request.email());

        try {
            restClient.post()
                    .uri(RESEND_EMAILS_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .headers(headers -> headers.setBearerAuth(apiKey))
                    .body(email)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException exception) {
            log.error("Resend rejected contact email with HTTP status {}", exception.getStatusCode().value());
            throw new ContactEmailDeliveryException("Resend rejected the contact email", exception);
        } catch (RestClientException exception) {
            log.error("Contact email delivery failed: {}", exception.getMessage());
            throw new ContactEmailDeliveryException("Contact email delivery failed", exception);
        }
    }

    private void requireConfiguration() {
        if (!StringUtils.hasText(apiKey) || !StringUtils.hasText(toEmail) || !StringUtils.hasText(fromEmail)) {
            log.error("Contact email delivery is not configured; RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL are required");
            throw new ContactEmailDeliveryException("Contact email delivery is not configured");
        }
    }

    private String formatBody(ContactRequest request) {
        String company = StringUtils.hasText(request.company()) ? request.company().trim() : "Non précisée";
        return """
                Nouvelle demande reçue via le site Web

                Nom : %s
                Courriel : %s
                Entreprise : %s
                Type de demande : %s
                Langue de correspondance : %s

                Message :

                %s

                ---

                Ce message a été envoyé depuis le formulaire de contact du site Web.
                """.formatted(
                request.name().trim(),
                request.email().trim(),
                company,
                frenchInquiryType(request.inquiryType()),
                request.correspondenceLanguage().frenchLabel(),
                request.message());
    }

    private String frenchSubject(ContactRequest request) {
        return ("Nouvelle demande via le site — " + frenchInquiryType(request.inquiryType())
                + " — " + request.name().trim())
                .replaceAll("[\\r\\n]+", " ");
    }

    private String frenchInquiryType(String inquiryType) {
        return switch (inquiryType.trim().toLowerCase(java.util.Locale.ROOT)) {
            case "speaking engagement", "conférence" -> "Conférence";
            case "media", "médias" -> "Médias";
            case "collaboration" -> "Collaboration";
            case "other", "autre" -> "Autre";
            default -> inquiryType.trim();
        };
    }

    private record ResendEmailRequest(
            String from,
            List<String> to,
            String subject,
            String text,
            String reply_to) {
    }
}

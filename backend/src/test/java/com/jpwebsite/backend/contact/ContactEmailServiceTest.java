package com.jpwebsite.backend.contact;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withUnauthorizedRequest;

import com.jpwebsite.backend.contact.dto.ContactRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class ContactEmailServiceTest {
    private static final ContactRequest REQUEST = new ContactRequest(
            "Jane Smith", "jane@example.com", "Example Inc.", "Speaking engagement",
            CorrespondenceLanguage.EN, "Hello there");

    @Test
    void sendsAllFieldsAndReplyToThroughResend() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ContactEmailService service = new ContactEmailService(
                builder, "secret-key", "owner@example.com", "Website Contact <onboarding@resend.dev>");

        server.expect(requestTo("https://api.resend.com/emails"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer secret-key"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("""
                        {
                          "from": "Website Contact <onboarding@resend.dev>",
                          "to": ["owner@example.com"],
                          "subject": "Nouvelle demande via le site — Conférence — Jane Smith",
                          "reply_to": "jane@example.com"
                        }
                        """, false))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Entreprise : Example Inc.")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Type de demande : Conférence")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Langue de correspondance : Anglais")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Message :\\n\\nHello there")))
                .andRespond(withSuccess("{\"id\":\"email-id\"}", MediaType.APPLICATION_JSON));

        service.send(REQUEST);

        server.verify();
    }

    @Test
    void convertsProviderFailureToSafeDeliveryException() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ContactEmailService service = new ContactEmailService(
                builder, "secret-key", "owner@example.com", "sender@example.com");
        server.expect(requestTo("https://api.resend.com/emails"))
                .andRespond(withUnauthorizedRequest().body("provider detail"));

        assertThatThrownBy(() -> service.send(REQUEST))
                .isInstanceOf(ContactEmailDeliveryException.class)
                .hasMessage("Resend rejected the contact email");
    }

    @Test
    void displaysFrenchPreferenceAndMissingCompanyInFrench() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ContactEmailService service = new ContactEmailService(
                builder, "secret-key", "owner@example.com", "sender@example.com");
        ContactRequest frenchRequest = new ContactRequest(
                "Jean Tremblay", "jean@example.com", "", "Collaboration",
                CorrespondenceLanguage.FR, "Bonjour");

        server.expect(requestTo("https://api.resend.com/emails"))
                .andExpect(content().string(org.hamcrest.Matchers.containsString(
                        "Langue de correspondance : Français")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString(
                        "Entreprise : Non précisée")))
                .andRespond(withSuccess("{\"id\":\"email-id\"}", MediaType.APPLICATION_JSON));

        service.send(frenchRequest);
        server.verify();
    }
}

package com.jpwebsite.backend.contact;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jpwebsite.backend.common.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class ContactControllerTest {
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        ContactService service = org.mockito.Mockito.mock(ContactService.class);
        mvc = MockMvcBuilders.standaloneSetup(new ContactController(service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void rejectsUnsupportedCorrespondenceLanguage() throws Exception {
        mvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload().replace("\"EN\"", "\"ES\"")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsMissingCorrespondenceLanguage() throws Exception {
        mvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload().replace("\"correspondenceLanguage\": \"EN\",", "")))
                .andExpect(status().isBadRequest());
    }

    private String validPayload() {
        return """
                {
                  "name": "Jane",
                  "email": "jane@example.com",
                  "company": "Example Inc.",
                  "inquiryType": "Media",
                  "correspondenceLanguage": "EN",
                  "message": "Hello"
                }
                """;
    }
}

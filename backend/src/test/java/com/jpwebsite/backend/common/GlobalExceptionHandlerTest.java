package com.jpwebsite.backend.common;

import static org.assertj.core.api.Assertions.assertThat;

import com.jpwebsite.backend.contact.ContactEmailDeliveryException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class GlobalExceptionHandlerTest {
    @Test
    void emailFailureReturnsSafeNonSuccessResponse() {
        var response = new GlobalExceptionHandler().contactEmailDelivery(
                new ContactEmailDeliveryException("provider details containing secret-key"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_GATEWAY);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().message()).isEqualTo("The message could not be delivered");
        assertThat(response.getBody().toString()).doesNotContain("secret-key", "provider details");
    }
}

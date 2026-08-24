package com.jpwebsite.backend.auth;

import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class AuthControllerTest {
    private final AuthController controller = new AuthController(mock(AuthService.class));

    @Test
    void sessionReturnsUnauthorizedWithoutAnAuthenticatedPrincipal() {
        assertThat(controller.session(null).getStatusCode().value()).isEqualTo(401);
    }

    @Test
    void sessionReturnsTheAuthenticatedUser() {
        var authentication = UsernamePasswordAuthenticationToken.authenticated(
                "admin", null, List.of());

        var response = controller.session(authentication);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(
                new LoginResponse("admin", "Authenticated"));
    }
}

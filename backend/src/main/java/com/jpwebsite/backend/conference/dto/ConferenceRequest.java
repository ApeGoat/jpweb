package com.jpwebsite.backend.conference.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ConferenceRequest(
        @NotBlank @Size(max = 255) String titleEn,
        @NotBlank @Size(max = 255) String titleFr,
        String descriptionEn,
        String descriptionFr,
        @Size(max = 255) String locationEn,
        @Size(max = 255) String locationFr,
        @NotNull LocalDate eventDate,
        @Size(max = 2048) String url,
        boolean visible) {
}

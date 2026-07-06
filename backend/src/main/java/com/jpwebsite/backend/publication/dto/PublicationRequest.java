package com.jpwebsite.backend.publication.dto;

import com.jpwebsite.backend.publication.PublicationStatus;
import com.jpwebsite.backend.publication.PublicationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record PublicationRequest(
        @NotBlank @Size(max = 255) String title,
        String description,
        @NotNull PublicationType type,
        @Size(max = 2048) String url,
        @Size(max = 2048) String thumbnailUrl,
        LocalDate publishedDate,
        boolean featured,
        @NotNull PublicationStatus status) {
}

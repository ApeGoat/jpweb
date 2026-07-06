package com.jpwebsite.backend.publication.dto;

import com.jpwebsite.backend.publication.Publication;
import com.jpwebsite.backend.publication.PublicationStatus;
import com.jpwebsite.backend.publication.PublicationType;
import java.time.Instant;
import java.time.LocalDate;

public record PublicationResponse(Long id, String title, String description, PublicationType type,
        String url, String thumbnailUrl, LocalDate publishedDate, boolean featured,
        PublicationStatus status, Instant createdAt, Instant updatedAt) {
    public static PublicationResponse from(Publication value) {
        return new PublicationResponse(value.getId(), value.getTitle(), value.getDescription(), value.getType(),
                value.getUrl(), value.getThumbnailUrl(), value.getPublishedDate(), value.isFeatured(),
                value.getStatus(), value.getCreatedAt(), value.getUpdatedAt());
    }
}

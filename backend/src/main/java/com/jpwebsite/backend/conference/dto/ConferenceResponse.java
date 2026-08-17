package com.jpwebsite.backend.conference.dto;

import com.jpwebsite.backend.conference.Conference;
import java.time.Instant;
import java.time.LocalDate;

public record ConferenceResponse(Long id, String titleEn, String titleFr,
        String descriptionEn, String descriptionFr, String locationEn, String locationFr,
        LocalDate eventDate, String url, boolean visible, Instant createdAt, Instant updatedAt) {
    public static ConferenceResponse from(Conference value) {
        return new ConferenceResponse(value.getId(), value.getTitleEn(), value.getTitleFr(),
                value.getDescriptionEn(), value.getDescriptionFr(), value.getLocationEn(), value.getLocationFr(),
                value.getEventDate(), value.getUrl(), value.isVisible(), value.getCreatedAt(), value.getUpdatedAt());
    }
}

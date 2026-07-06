package com.jpwebsite.backend.gallery.dto;

import com.jpwebsite.backend.gallery.GalleryImage;
import java.time.Instant;

public record GalleryImageResponse(Long id, String imageUrl, String storageKey, String caption,
        String altText, Integer displayOrder, boolean visible, Instant createdAt, Instant updatedAt) {
    public static GalleryImageResponse from(GalleryImage value) {
        return new GalleryImageResponse(value.getId(), value.getImageUrl(), value.getStorageKey(),
                value.getCaption(), value.getAltText(), value.getDisplayOrder(), value.isVisible(),
                value.getCreatedAt(), value.getUpdatedAt());
    }
}

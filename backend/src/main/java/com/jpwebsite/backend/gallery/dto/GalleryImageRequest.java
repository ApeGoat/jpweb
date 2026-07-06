package com.jpwebsite.backend.gallery.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GalleryImageRequest(@Size(max = 500) String caption, @Size(max = 500) String altText,
        @NotNull Integer displayOrder, boolean visible) {
}

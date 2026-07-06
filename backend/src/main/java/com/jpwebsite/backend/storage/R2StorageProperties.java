package com.jpwebsite.backend.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.r2")
public record R2StorageProperties(
        String endpoint,
        String accessKeyId,
        String secretAccessKey,
        String bucket,
        String publicBaseUrl,
        boolean forcePathStyle) {
}

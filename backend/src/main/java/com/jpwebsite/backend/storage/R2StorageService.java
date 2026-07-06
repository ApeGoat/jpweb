package com.jpwebsite.backend.storage;

import java.io.IOException;
import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class R2StorageService implements StorageService {
    private final S3Client s3Client;
    private final R2StorageProperties properties;

    public R2StorageService(S3Client s3Client, R2StorageProperties properties) {
        this.s3Client = s3Client;
        this.properties = properties;
    }

    @Override
    public StoredObject uploadGalleryImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("An image file is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new IllegalArgumentException("Only image uploads are accepted");
        }

        String key = "gallery/" + UUID.randomUUID() + "-" + sanitizeFilename(file.getOriginalFilename());
        try {
            return uploadGalleryImage(key, contentType, file.getBytes());
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read the uploaded image", exception);
        }
    }

    @Override
    public StoredObject uploadGalleryImage(String storageKey, String contentType, byte[] content) {
        if (content.length == 0) {
            throw new IllegalArgumentException("An image file is required");
        }
        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new IllegalArgumentException("Only image uploads are accepted");
        }

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(properties.bucket())
                .key(storageKey)
                .contentType(contentType)
                .contentLength((long) content.length)
                .build();
        s3Client.putObject(request, RequestBody.fromBytes(content));

        String publicUrl = properties.publicBaseUrl().replaceAll("/+$", "") + "/" + storageKey;
        return new StoredObject(storageKey, publicUrl);
    }

    @Override
    public void delete(String key) {
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(properties.bucket())
                .key(key)
                .build());
    }

    private String sanitizeFilename(String originalFilename) {
        String filename = StringUtils.hasText(originalFilename) ? originalFilename : "image";
        filename = StringUtils.cleanPath(filename).replace('\\', '-').replace('/', '-');
        filename = Normalizer.normalize(filename, Normalizer.Form.NFKD)
                .replaceAll("[^a-zA-Z0-9._-]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^[.-]+|[.-]+$", "")
                .toLowerCase(Locale.ROOT);
        return StringUtils.hasText(filename) ? filename : "image";
    }
}

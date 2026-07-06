package com.jpwebsite.backend.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    StoredObject uploadGalleryImage(MultipartFile file);
    StoredObject uploadGalleryImage(String storageKey, String contentType, byte[] content);
    void delete(String key);
}

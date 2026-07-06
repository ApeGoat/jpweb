package com.jpwebsite.backend.gallery;

import com.jpwebsite.backend.gallery.dto.GalleryImageRequest;
import com.jpwebsite.backend.gallery.dto.GalleryImageResponse;
import com.jpwebsite.backend.storage.StorageService;
import com.jpwebsite.backend.storage.StoredObject;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class GalleryImageService {
    private final GalleryImageRepository repository;
    private final StorageService storageService;
    public GalleryImageService(GalleryImageRepository repository, StorageService storageService) {
        this.repository = repository;
        this.storageService = storageService;
    }
    public List<GalleryImageResponse> publicList() {
        return repository.findByVisibleTrueOrderByDisplayOrderAscCreatedAtDesc().stream()
                .map(GalleryImageResponse::from).toList();
    }
    public List<GalleryImageResponse> adminList() {
        return repository.findAllByOrderByDisplayOrderAscCreatedAtDesc().stream()
                .map(GalleryImageResponse::from).toList();
    }
    @Transactional
    public GalleryImageResponse upload(MultipartFile file, String caption, String altText) {
        StoredObject stored = storageService.uploadGalleryImage(file);
        try {
            GalleryImage image = new GalleryImage();
            image.setStorageKey(stored.key());
            image.setImageUrl(stored.publicUrl());
            image.setCaption(caption);
            image.setAltText(altText);
            image.setDisplayOrder(0);
            image.setVisible(true);
            return GalleryImageResponse.from(repository.save(image));
        } catch (RuntimeException exception) {
            storageService.delete(stored.key());
            throw exception;
        }
    }

    @Transactional
    public boolean seed(String filename, String contentType, byte[] content, String caption, int displayOrder) {
        String storageKey = "gallery/seed/" + filename;
        if (repository.existsByStorageKey(storageKey)) {
            return false;
        }

        StoredObject stored = storageService.uploadGalleryImage(storageKey, contentType, content);
        try {
            GalleryImage image = new GalleryImage();
            image.setStorageKey(stored.key());
            image.setImageUrl(stored.publicUrl());
            image.setCaption(caption);
            image.setAltText(caption);
            image.setDisplayOrder(displayOrder);
            image.setVisible(true);
            repository.saveAndFlush(image);
            return true;
        } catch (RuntimeException exception) {
            storageService.delete(stored.key());
            throw exception;
        }
    }
    @Transactional
    public GalleryImageResponse update(Long id, GalleryImageRequest request) {
        GalleryImage image = find(id);
        image.setCaption(request.caption());
        image.setAltText(request.altText());
        image.setDisplayOrder(request.displayOrder());
        image.setVisible(request.visible());
        return GalleryImageResponse.from(repository.save(image));
    }
    @Transactional
    public void delete(Long id) {
        GalleryImage image = find(id);
        storageService.delete(image.getStorageKey());
        repository.delete(image);
    }
    private GalleryImage find(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Gallery image not found"));
    }
}

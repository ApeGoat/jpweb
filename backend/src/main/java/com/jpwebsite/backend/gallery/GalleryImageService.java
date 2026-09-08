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
        return repository.findByVisibleTrueOrderByDisplayOrderAscCreatedAtDescIdAsc().stream()
                .map(GalleryImageResponse::from).toList();
    }
    public List<GalleryImageResponse> adminList() {
        return repository.findAllByOrderByDisplayOrderAscCreatedAtDescIdAsc().stream()
                .map(GalleryImageResponse::from).toList();
    }
    @Transactional
    public GalleryImageResponse upload(MultipartFile file, String caption, String altText) {
        repository.lockOrdering();
        List<GalleryImage> existing = repository.findAllByOrderByDisplayOrderAscCreatedAtDescIdAsc();
        normalize(existing);
        StoredObject stored = storageService.uploadGalleryImage(file);
        try {
            GalleryImage image = new GalleryImage();
            image.setStorageKey(stored.key());
            image.setImageUrl(stored.publicUrl());
            image.setCaption(caption);
            image.setAltText(altText);
            image.setDisplayOrder(existing.size());
            image.setVisible(true);
            return GalleryImageResponse.from(repository.save(image));
        } catch (RuntimeException exception) {
            storageService.delete(stored.key());
            throw exception;
        }
    }

    @Transactional
    public boolean seed(String filename, String contentType, byte[] content, String caption, int displayOrder) {
        repository.lockOrdering();
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
        repository.lockOrdering();
        GalleryImage image = find(id);
        image.setCaption(request.caption());
        image.setAltText(request.altText());
        image.setVisible(request.visible());
        return GalleryImageResponse.from(repository.save(image));
    }
    @Transactional
    public void delete(Long id) {
        repository.lockOrdering();
        GalleryImage image = find(id);
        storageService.delete(image.getStorageKey());
        repository.delete(image);
    }
    @Transactional
    public List<GalleryImageResponse> reorder(List<Long> ids) {
        // Serialize ordering and membership changes, including an initially empty gallery.
        repository.lockOrdering();
        List<GalleryImage> images = repository.findAllByOrderByDisplayOrderAscCreatedAtDescIdAsc();
        var byId = images.stream().collect(java.util.stream.Collectors.toMap(GalleryImage::getId, image -> image));
        if (ids == null || ids.stream().anyMatch(java.util.Objects::isNull) || ids.size() != images.size()
                || new java.util.HashSet<>(ids).size() != ids.size()
                || !byId.keySet().equals(new java.util.HashSet<>(ids))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Submit every current gallery ID exactly once; refresh the gallery and try again");
        }
        List<GalleryImage> ordered = ids.stream().map(byId::get).toList();
        normalize(ordered);
        return ordered.stream().map(GalleryImageResponse::from).toList();
    }

    private void normalize(List<GalleryImage> images) {
        for (int index = 0; index < images.size(); index++) {
            images.get(index).setDisplayOrder(index);
        }
    }

    private GalleryImage find(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Gallery image not found"));
    }
}

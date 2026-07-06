package com.jpwebsite.backend.gallery;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    boolean existsByStorageKey(String storageKey);
    List<GalleryImage> findByVisibleTrueOrderByDisplayOrderAscCreatedAtDesc();
    List<GalleryImage> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}

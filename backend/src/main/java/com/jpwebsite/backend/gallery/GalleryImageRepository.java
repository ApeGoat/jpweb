package com.jpwebsite.backend.gallery;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    boolean existsByStorageKey(String storageKey);
    List<GalleryImage> findByVisibleTrueOrderByDisplayOrderAscCreatedAtDescIdAsc();
    List<GalleryImage> findAllByOrderByDisplayOrderAscCreatedAtDescIdAsc();

    @org.springframework.data.jpa.repository.Query(value = "LOCK TABLE gallery_images IN EXCLUSIVE MODE", nativeQuery = true)
    @org.springframework.data.jpa.repository.Modifying
    void lockOrdering();
}

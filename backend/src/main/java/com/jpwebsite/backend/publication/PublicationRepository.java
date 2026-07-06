package com.jpwebsite.backend.publication;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByStatusOrderByPublishedDateDescCreatedAtDesc(PublicationStatus status);
    List<Publication> findAllByOrderByCreatedAtDesc();
}

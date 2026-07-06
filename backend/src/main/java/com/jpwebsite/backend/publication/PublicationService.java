package com.jpwebsite.backend.publication;

import com.jpwebsite.backend.publication.dto.PublicationRequest;
import com.jpwebsite.backend.publication.dto.PublicationResponse;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class PublicationService {
    private final PublicationRepository repository;
    public PublicationService(PublicationRepository repository) { this.repository = repository; }

    public List<PublicationResponse> publicList() {
        return repository.findByStatusOrderByPublishedDateDescCreatedAtDesc(PublicationStatus.PUBLISHED)
                .stream().map(PublicationResponse::from).toList();
    }
    public List<PublicationResponse> adminList() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(PublicationResponse::from).toList();
    }
    @Transactional
    public PublicationResponse create(PublicationRequest request) {
        Publication publication = new Publication();
        apply(publication, request);
        return PublicationResponse.from(repository.save(publication));
    }
    @Transactional
    public PublicationResponse update(Long id, PublicationRequest request) {
        Publication publication = find(id);
        apply(publication, request);
        return PublicationResponse.from(repository.save(publication));
    }
    @Transactional
    public void delete(Long id) { repository.delete(find(id)); }

    private Publication find(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Publication not found"));
    }
    private void apply(Publication value, PublicationRequest request) {
        value.setTitle(request.title());
        value.setDescription(request.description());
        value.setType(request.type());
        value.setUrl(request.url());
        value.setThumbnailUrl(request.thumbnailUrl());
        value.setPublishedDate(request.publishedDate());
        value.setFeatured(request.featured());
        value.setStatus(request.status());
    }
}

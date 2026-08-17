package com.jpwebsite.backend.conference;

import com.jpwebsite.backend.conference.dto.ConferenceRequest;
import com.jpwebsite.backend.conference.dto.ConferenceResponse;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ConferenceService {
    private final ConferenceRepository repository;
    public ConferenceService(ConferenceRepository repository) {
        this.repository = repository;
    }

    public List<ConferenceResponse> publicList() {
        return repository.findByVisibleTrueAndEventDateGreaterThanEqualOrderByEventDateAscCreatedAtAsc(LocalDate.now())
                .stream().map(ConferenceResponse::from).toList();
    }

    public List<ConferenceResponse> adminList() {
        return repository.findAllByOrderByEventDateAscCreatedAtAsc().stream().map(ConferenceResponse::from).toList();
    }

    @Transactional
    public ConferenceResponse create(ConferenceRequest request) {
        Conference conference = new Conference();
        apply(conference, request);
        return ConferenceResponse.from(repository.save(conference));
    }

    @Transactional
    public ConferenceResponse update(Long id, ConferenceRequest request) {
        Conference conference = find(id);
        apply(conference, request);
        return ConferenceResponse.from(repository.save(conference));
    }

    @Transactional
    public void delete(Long id) { repository.delete(find(id)); }

    private Conference find(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Conference not found"));
    }

    private void apply(Conference value, ConferenceRequest request) {
        value.setTitleEn(request.titleEn());
        value.setTitleFr(request.titleFr());
        value.setDescriptionEn(request.descriptionEn());
        value.setDescriptionFr(request.descriptionFr());
        value.setLocationEn(request.locationEn());
        value.setLocationFr(request.locationFr());
        value.setEventDate(request.eventDate());
        value.setUrl(request.url());
        value.setVisible(request.visible());
    }
}

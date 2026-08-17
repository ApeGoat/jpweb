package com.jpwebsite.backend.conference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.jpwebsite.backend.conference.dto.ConferenceRequest;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ConferenceServiceTest {
    @Mock ConferenceRepository repository;

    @Test
    void publicListRequestsVisibleConferencesFromTodayAndSortsThroughRepositoryQuery() {
        Conference conference = conference(LocalDate.now(), true);
        when(repository.findByVisibleTrueAndEventDateGreaterThanEqualOrderByEventDateAscCreatedAtAsc(LocalDate.now()))
                .thenReturn(List.of(conference));

        var result = new ConferenceService(repository).publicList();

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().eventDate()).isEqualTo(LocalDate.now());
        verify(repository).findByVisibleTrueAndEventDateGreaterThanEqualOrderByEventDateAscCreatedAtAsc(LocalDate.now());
    }

    @Test
    void createCopiesBilingualAndVisibilityFields() {
        ConferenceRequest request = new ConferenceRequest("English", "Français", "Description", null,
                "Toronto", "Toronto", LocalDate.now().plusDays(2), "https://example.com", false);
        when(repository.save(org.mockito.ArgumentMatchers.any(Conference.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var result = new ConferenceService(repository).create(request);

        assertThat(result.titleEn()).isEqualTo("English");
        assertThat(result.titleFr()).isEqualTo("Français");
        assertThat(result.visible()).isFalse();
        assertThat(result.url()).isEqualTo("https://example.com");
    }

    private Conference conference(LocalDate date, boolean visible) {
        Conference value = new Conference();
        value.setTitleEn("English");
        value.setTitleFr("Français");
        value.setEventDate(date);
        value.setVisible(visible);
        return value;
    }
}

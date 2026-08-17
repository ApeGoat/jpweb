package com.jpwebsite.backend.conference;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConferenceRepository extends JpaRepository<Conference, Long> {
    List<Conference> findByVisibleTrueAndEventDateGreaterThanEqualOrderByEventDateAscCreatedAtAsc(LocalDate date);
    List<Conference> findAllByOrderByEventDateAscCreatedAtAsc();
}

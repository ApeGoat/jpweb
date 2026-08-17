package com.jpwebsite.backend.conference;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "conferences")
public class Conference {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "title_en", nullable = false) private String titleEn;
    @Column(name = "title_fr", nullable = false) private String titleFr;
    @Column(name = "description_en", columnDefinition = "text") private String descriptionEn;
    @Column(name = "description_fr", columnDefinition = "text") private String descriptionFr;
    @Column(name = "location_en") private String locationEn;
    @Column(name = "location_fr") private String locationFr;
    @Column(name = "event_date", nullable = false) private LocalDate eventDate;
    @Column(length = 2048) private String url;
    @Column(nullable = false) private boolean visible = true;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    protected Conference() {}

    @PrePersist void createTimestamps() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void updateTimestamp() { updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public String getTitleFr() { return titleFr; }
    public void setTitleFr(String titleFr) { this.titleFr = titleFr; }
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    public String getDescriptionFr() { return descriptionFr; }
    public void setDescriptionFr(String descriptionFr) { this.descriptionFr = descriptionFr; }
    public String getLocationEn() { return locationEn; }
    public void setLocationEn(String locationEn) { this.locationEn = locationEn; }
    public String getLocationFr() { return locationFr; }
    public void setLocationFr(String locationFr) { this.locationFr = locationFr; }
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public boolean isVisible() { return visible; }
    public void setVisible(boolean visible) { this.visible = visible; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

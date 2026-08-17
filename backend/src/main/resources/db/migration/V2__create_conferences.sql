CREATE TABLE conferences (
    id BIGSERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_fr TEXT,
    location_en VARCHAR(255),
    location_fr VARCHAR(255),
    event_date DATE NOT NULL,
    url VARCHAR(2048),
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_conferences_visible_date ON conferences (visible, event_date ASC);

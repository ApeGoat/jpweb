CREATE TABLE publications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(32) NOT NULL,
    url VARCHAR(2048),
    thumbnail_url VARCHAR(2048),
    published_date DATE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_publications_status_date ON publications (status, published_date DESC);

CREATE TABLE gallery_images (
    id BIGSERIAL PRIMARY KEY,
    image_url VARCHAR(2048) NOT NULL,
    storage_key VARCHAR(1024) NOT NULL UNIQUE,
    caption VARCHAR(500),
    alt_text VARCHAR(500),
    display_order INTEGER NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_gallery_visible_order ON gallery_images (visible, display_order);

CREATE TABLE contact_inquiries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL,
    company VARCHAR(255),
    inquiry_type VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_contact_inquiries_status_created ON contact_inquiries (status, created_at DESC);

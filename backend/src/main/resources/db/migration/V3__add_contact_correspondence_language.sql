ALTER TABLE contact_inquiries
    ADD COLUMN correspondence_language VARCHAR(2) NOT NULL DEFAULT 'FR';

ALTER TABLE contact_inquiries
    ALTER COLUMN correspondence_language DROP DEFAULT;

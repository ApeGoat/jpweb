-- Preserve the existing display_order / newest-first sequence, including hidden rows.
-- ID only resolves previously unspecified ties. No image metadata or storage is changed.
WITH ordered AS (
    SELECT id, (ROW_NUMBER() OVER (ORDER BY display_order ASC, created_at DESC, id ASC) - 1)::INTEGER AS position
    FROM gallery_images
)
UPDATE gallery_images AS image
SET display_order = ordered.position
FROM ordered
WHERE image.id = ordered.id AND image.display_order <> ordered.position;

-- Uklanja demo sadržaj unesen u V2__seed_data.sql.
-- Ostaje samo sadržaj unesen kroz admin sučelje.
-- gallery_images.excursion_id je ON DELETE SET NULL, guide_id također,
-- pa redoslijed brisanja nije bitan.

DELETE FROM gallery_images;

DELETE FROM excursions
WHERE slug IN ('triglav', 'velebit', 'dubrovnik-elafiti', 'plitvice', 'biokovo');

DELETE FROM guides;

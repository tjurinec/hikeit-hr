-- Galerije (albumi): naslov obavezan, opis i vanjski link opcionalni.
CREATE TABLE galleries (
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    external_url VARCHAR(500),
    sort_order   INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Slike sada pripadaju galeriji. Grupiranje preuzima galerija, pa kategorija
-- i izravna veza na izlet više ne trebaju.
-- Tablica je prazna (demo sadržaj uklonjen u V5), pa nema podataka za prenijeti.
DELETE FROM gallery_images;

ALTER TABLE gallery_images
    DROP COLUMN IF EXISTS category,
    DROP COLUMN IF EXISTS excursion_id,
    ADD COLUMN gallery_id BIGINT NOT NULL REFERENCES galleries(id) ON DELETE CASCADE;

CREATE INDEX idx_gallery_images_gallery ON gallery_images (gallery_id, sort_order);

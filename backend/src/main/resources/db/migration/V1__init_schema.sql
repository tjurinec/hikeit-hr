CREATE TABLE guides (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    bio        TEXT,
    avatar_url VARCHAR(500),
    specialization VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE difficulty AS ENUM ('EASY', 'MODERATE', 'HARD', 'EXPERT');

CREATE TABLE excursions (
    id               BIGSERIAL PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    slug             VARCHAR(255) NOT NULL UNIQUE,
    description      TEXT NOT NULL,
    content          TEXT,
    difficulty       difficulty NOT NULL DEFAULT 'MODERATE',
    duration_days    INT NOT NULL DEFAULT 1,
    max_participants INT NOT NULL DEFAULT 10,
    price            NUMERIC(10, 2),
    cover_image_url  VARCHAR(500),
    location         VARCHAR(255),
    starting_point   VARCHAR(255),
    guide_id         BIGINT REFERENCES guides(id) ON DELETE SET NULL,
    featured         BOOLEAN NOT NULL DEFAULT FALSE,
    published        BOOLEAN NOT NULL DEFAULT FALSE,
    published_at     TIMESTAMPTZ,
    next_departure   DATE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE excursion_images (
    id           BIGSERIAL PRIMARY KEY,
    excursion_id BIGINT NOT NULL REFERENCES excursions(id) ON DELETE CASCADE,
    url          VARCHAR(500) NOT NULL,
    sort_order   INT NOT NULL DEFAULT 0
);

CREATE TABLE excursion_tags (
    excursion_id BIGINT NOT NULL REFERENCES excursions(id) ON DELETE CASCADE,
    tag          VARCHAR(100) NOT NULL,
    PRIMARY KEY (excursion_id, tag)
);

CREATE TABLE gallery_images (
    id           BIGSERIAL PRIMARY KEY,
    url          VARCHAR(500) NOT NULL,
    caption      VARCHAR(500),
    location     VARCHAR(255),
    category     VARCHAR(100),
    excursion_id BIGINT REFERENCES excursions(id) ON DELETE SET NULL,
    sort_order   INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_excursions_slug       ON excursions(slug);
CREATE INDEX idx_excursions_published  ON excursions(published);
CREATE INDEX idx_excursions_featured   ON excursions(featured);

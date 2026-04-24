-- Admin korisnici za pristup upload sučelju
CREATE TABLE admin_users (
    id           BIGSERIAL PRIMARY KEY,
    username     VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lozinka: admin123 (bcrypt hash) — promijeni prije produkcije!
INSERT INTO admin_users (username, password) VALUES
('tomislav', '$2a$12$XJfFEF0lDDfXn7o5T3LLPeiCY1WUiWwTGPGbEbBUSYxRMqhFe5oCa'),
('ana',      '$2a$12$XJfFEF0lDDfXn7o5T3LLPeiCY1WUiWwTGPGbEbBUSYxRMqhFe5oCa');

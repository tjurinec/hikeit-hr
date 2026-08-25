CREATE TABLE contact_messages (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(120) NOT NULL,
    email      VARCHAR(200) NOT NULL,
    phone      VARCHAR(50),
    subject    VARCHAR(120),
    message    TEXT NOT NULL,
    handled    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at DESC);

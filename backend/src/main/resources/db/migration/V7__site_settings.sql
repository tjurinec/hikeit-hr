-- Kontakt podaci stranice. Uvijek točno jedan red (id = 1).
CREATE TABLE site_settings (
    id                  BIGINT PRIMARY KEY DEFAULT 1,
    contact_email       VARCHAR(200),
    location            VARCHAR(200),
    location_note       VARCHAR(200),
    working_hours       TEXT,
    working_hours_note  VARCHAR(300),
    instagram_url       VARCHAR(300),
    facebook_url        VARCHAR(300),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT site_settings_single_row CHECK (id = 1)
);

-- Više kontakt brojeva, svaki s opisom ("Tomislav", "WhatsApp", "Rezervacije").
CREATE TABLE contact_phones (
    settings_id BIGINT NOT NULL REFERENCES site_settings(id) ON DELETE CASCADE,
    label       VARCHAR(100),
    number      VARCHAR(50) NOT NULL,
    sort_order  INT NOT NULL,
    PRIMARY KEY (settings_id, sort_order)
);

-- Brojevi i društvene mreže namjerno prazni — dosadašnje vrijednosti su bile
-- placeholderi, a frontend prazna polja ne prikazuje.
INSERT INTO site_settings (id, contact_email, location, location_note, working_hours, working_hours_note)
VALUES (
    1,
    'info@hikeit.hr',
    'Zagreb, Hrvatska',
    'Izleti diljem HR i regije',
    E'Ponedjeljak — Petak: 9:00 — 18:00\nSubota: 10:00 — 14:00',
    'Na terenu smo dostupni i van radnog vremena — pišite slobodno!'
);

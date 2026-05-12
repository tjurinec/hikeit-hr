-- Admin korisnici za pristup upload sučelju
CREATE TABLE admin_users (
    id           BIGSERIAL PRIMARY KEY,
    username     VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lozinka: admin123 (bcrypt hash) — promijeni prije produkcije!
INSERT INTO admin_users (username, password) VALUES
('tomislav', '$2b$12$cgYcTi5n5Rl9L8fngPrc5.7qvH.Tk.nYEGaCP1UD2yblhPD.5kH7K'),
('ana',      '$2b$12$cgYcTi5n5Rl9L8fngPrc5.7qvH.Tk.nYEGaCP1UD2yblhPD.5kH7K');

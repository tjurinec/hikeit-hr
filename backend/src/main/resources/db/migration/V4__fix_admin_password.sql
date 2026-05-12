-- Ispravlja bcrypt hash za admin123 (prethodni hash bio neispravan)
UPDATE admin_users
SET password = '$2b$12$cgYcTi5n5Rl9L8fngPrc5.7qvH.Tk.nYEGaCP1UD2yblhPD.5kH7K'
WHERE username IN ('tomislav', 'ana');

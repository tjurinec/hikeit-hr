INSERT INTO guides (name, bio, avatar_url, specialization) VALUES
(
    'Tomislav',
    'Certificirani planinski vodič s više od 8 godina iskustva. Triglav sam uspio prijeći više od 40 puta i uvijek pronalazim nešto novo što me oduševljava. Specijaliziran za visoko planinarenje i alpinizam u Dinaridima i Alpama.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    'Visoko planinarenje & Alpinizam'
),
(
    'Ana',
    'Licencirani turistički vodič s fokusom na kulturne i eno-gastronomske ture duž Jadranske obale. Volim ljude, priče i dobre trenutke pod mediteranskim suncem.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    'Kulturni turizam & Jadran'
);

INSERT INTO excursions (title, slug, description, content, difficulty, duration_days, max_participants, price, cover_image_url, location, starting_point, guide_id, featured, published, published_at, next_departure) VALUES
(
    'Triglav — Krov Julijskih Alpa',
    'triglav',
    'Uspinjemo se na najviši vrh Slovenije i jednu od najljepših planina u ovom dijelu Europe. Trodnevna ekspedicija s iskusnim vodičem.',
    '## O izletu

Triglav (2864 m) je simbol Slovenije i jedna od najatraktivnijih planinarskih destinacija u Alpama. Naša trodnevna ekspedicija vodi te kroz Triglav nacionalni park, uz kristalno čista planinska jezera i nepregledne poglede.

## Raspored

### Dan 1 — Dolazak u Bled
Skupljamo se u Bledu, kratki briefing i večera u planinarskom domu.

### Dan 2 — Uspon
Rani start, uspon kroz Krmu i Dolič do Triglavskog doma. Spavanje u planinskom domu.

### Dan 3 — Vrh & povratak
Uspon na sam vrh (2864m) po lijepom vremenu, silazak i povratak u Bled.

## Što je uključeno

- Stručni planinski vodič
- 2 noćenja u planinarskom domu s polupansionom
- Sve dozvole za park
- Komplet prve pomoći',
    'HARD', 3, 8, 249.00,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'Julijske Alpe, Slovenija', 'Bled, Slovenija',
    1, TRUE, TRUE, NOW(), '2025-07-15'
),
(
    'Velebit — Bajkovita Hrvatska Divljina',
    'velebit',
    'Treking kroz srce Velebita — endemska flora, fauna i pogled koji oduzima dah. Četiri dana čiste prirode.',
    '## O izletu

Velebit je najveća hrvatska planina i dom rijetkih endema. Prolazimo Severnim Velebitom kroz prašume, krševe i panoramske grebene iznad Jadrana.

## Što je uključeno

- Vodič certificiran za planinarenje
- 3 noćenja (kombinirano planinarski dom / kamp)
- Sva oprema za kamp
- Transfer polazak/povratak',
    'MODERATE', 4, 10, 189.00,
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'Velebit, Hrvatska', 'Zadar',
    1, TRUE, TRUE, NOW(), '2025-06-20'
),
(
    'Dubrovnik & Elafiti — Otočki Raj',
    'dubrovnik-elafiti',
    'Kombinirani izlet s obilascima Dubrovnika i jedrilicama prema Elafitskim otocima. Kultura i priroda u jednom.',
    '## O izletu

Pet dana mediteranskog raja — šetnja Starim gradom, plovidba prema Šipanu, Lopudu i Koločepu, kupanje u kristalnom moru.

## Što je uključeno

- Turistički vodič
- 4 noćenja u hotelu 3*
- Plovidba jedriličarom
- Ulaznice za Stari grad',
    'EASY', 5, 12, 320.00,
    'https://images.unsplash.com/photo-1555990793-da11153b6BE8?w=800&q=80',
    'Dubrovnik & Elafiti, Hrvatska', 'Dubrovnik',
    2, TRUE, TRUE, NOW(), '2025-08-01'
),
(
    'Plitvička Jezera — Sedam Čuda',
    'plitvice',
    'Čarobni obilazak UNESCO zaštićenog biserja Hrvatske prirode. Idealno za obitelji i početnike.',
    '## O izletu

Jednodnevni izlet do jednog od najljepših prirodnih parkova na svijetu. Vodiča prati grupu kroz sve razine jezera i slapova.

## Što je uključeno

- Turistički vodič
- Ulaznica za park
- Transfer iz Zagreba ili Splita',
    'EASY', 1, 15, 65.00,
    'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80',
    'Lika, Hrvatska', 'Zagreb / Split',
    2, FALSE, TRUE, NOW(), NULL
),
(
    'Biokovo — Između Mora i Neba',
    'biokovo',
    'Uspon na Sveti Jure i Biokovo skywalk s panoramom cijele Dalmacije i Jadrana.',
    '## O izletu

Biokovo je masiv koji strmo pada prema moru. S vrha Svetog Jure (1762m) vidi se cijela Dalmacija, Hvar i Brač. Biokovo Skywalk — stakleni šetnik iznad ponora — doživljaj koji ne zaboravljaš.

## Što je uključeno

- Planinski vodič
- Noćenje u planinarskom domu
- Ulaznica za Skywalk',
    'HARD', 2, 6, 145.00,
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    'Biokovo, Dalmacija', 'Makarska',
    1, FALSE, TRUE, NOW(), '2025-06-28'
);

INSERT INTO excursion_tags (excursion_id, tag) VALUES
(1, 'alpe'), (1, 'triglav'), (1, 'visoko'), (1, 'slovenija'),
(2, 'velebit'), (2, 'treking'), (2, 'hrvatska'),
(3, 'dubrovnik'), (3, 'more'), (3, 'otoci'),
(4, 'plitvice'), (4, 'jezera'), (4, 'unesco'),
(5, 'biokovo'), (5, 'dalmacija'), (5, 'uspon');

INSERT INTO gallery_images (url, caption, location, category, excursion_id, sort_order) VALUES
('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 'Triglav — Vrh iznad oblaka', 'Julijske Alpe', 'planine', 1, 1),
('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', 'Velebitska šuma', 'Velebit', 'priroda', 2, 2),
('https://images.unsplash.com/photo-1555990793-da11153b6BE8?w=800&q=80', 'Dubrovnik iz zraka', 'Dubrovnik', 'kultura', 3, 3),
('https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80', 'Plitvička jezera', 'Lika', 'priroda', 4, 4),
('https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', 'Šuma na Risnjaku', 'Gorski Kotar', 'priroda', NULL, 5),
('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80', 'Zora na Biokovu', 'Biokovo', 'planine', 5, 6),
('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', 'Planinska panorama', 'Alpe', 'planine', NULL, 7),
('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', 'Jadransko more', 'Dalmacija', 'mora', NULL, 8),
('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', 'Plaža na Elafitima', 'Elafitski otoci', 'mora', 3, 9),
('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', 'Zvjezdano nebo', 'Velebit', 'planine', 2, 10);

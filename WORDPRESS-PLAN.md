# hikeIT — plan migracije na WordPress

Stanje: 14. 10. 2026. Cilj: zamijeniti Spring Boot + React + Postgres + R2 (Render, ~15 $/mj.)
jednom WordPress instalacijom na običnom hostingu. Prvo sve lokalno, plaćanje kasnije.

## 1. Što trenutno imamo (iz koda i migracija V1–V9)

| Podatak | Tablica | WordPress ekvivalent |
|---|---|---|
| Izleti (naslov, slug, opis, sadržaj, težina, trajanje, max osoba, cijena, naslovna, lokacija, polazište, vodič, istaknut, objavljen, sljedeći polazak) | `excursions` | custom post type `izlet` + polja |
| Dodatne slike izleta, oznake | `excursion_images`, `excursion_tags` | galerija u sadržaju / featured image, taksonomija `oznaka` |
| Vodiči (ime, bio, avatar, specijalizacija) | `guides` | custom post type `vodic` (bez prijave) |
| Galerije (naslov, opis, vanjski link, redoslijed, slike s opisom i lokacijom) | `galleries`, `gallery_images` | custom post type `galerija` + native galerija blok |
| Kontakt poruke | `contact_messages` | plugin za formu koji sprema poruke |
| Postavke (e-mail, lokacija, radno vrijeme, telefoni, mreže, uvod galerije) | `site_settings`, `contact_phones` | jedna stranica postavki (ACF options) |
| Admin korisnici | `admin_users` | WP korisnici (nova lozinka, hash se ne prenosi) |
| Slike | Cloudflare R2 | WP medijska biblioteka |

Rute koje čuvamo (SEO): `/izleti`, `/izleti/{slug}`, `/galerija`, `/o-nama`, `/kontakt`.
Galerije dobivaju slug (zatvara dug iz `hikeit-otvoreni-zadaci`); stari `/galerija/{id}` ide 301 na novi URL.

**Blog:** u aplikaciji ga nema; u WordPressu dolazi besplatno (obični `post`).

## 2. Važan nalaz: lokalna baza nije prava

Lokalni Postgres (`vrhiput_db`) ima samo Flyway V1–V4 i demo sadržaj (5 izleta s Unsplash slikama,
2 vodiča), tablice `galleries` i `site_settings` ne postoje. **Pravi sadržaj je na Renderu.**

Izvlačenje bez pristupa bazi: javni GET endpointi (`/api/excursions`, `/api/gallery`, `/api/guides`,
`/api/settings`) vraćaju sve što je javno → JSON → uvoz. Jedino poruke iz kontakta (`/api/contact`)
traže admin prijavu; treba ih samo arhivirati kao CSV, ne uvoziti.

## 3. Lokalno okruženje

Isti obrazac kao `~/dev/pd-pinklec` (proba radi: Docker + WP-CLI + vlastita tema u gitu):

- `wordpress/compose.yml` — wordpress:php8.3-apache + mariadb:11 + `cli` servis, port **8089**
  (8088 je zauzet pd-pinklecom), volumeni za bazu i WP.
- U gitu samo tema `wordpress/wp-content/themes/hikeit` i skripte; jezgra i baza u volumenima.
- Postojeći React/Kotlin kod ostaje u `main` dok se ne završi cutover, zatim tag `pre-wordpress` i uklanjanje.

## 4. Faze

**Faza 1 — kostur (lokalno)**
1. `compose.yml`, instalacija WP-a, hrvatski jezik, trajni linkovi `/%postname%/`.
2. Tema `hikeit` (blok tema s `theme.json`, kao pinklec): boje i logo iz `frontend/public/images/logo-hikeit-v2.png`
   i Tailwind varijabli iz `frontend/src/index.css`.
3. Plugini (minimum): **ACF Free** (polja), **Contact Form 7 + Flamingo** (forma i spremanje poruka),
   **WP Mail SMTP**, **Redirection** (301), **Yoast ili Rank Math** (SEO). Ništa drugo.

**Faza 2 — model podataka**
4. CPT `izlet`, `vodic`, `galerija`; taksonomija `oznaka`; polje težine (EASY/MODERATE/HARD/EXPERT → prikazne oznake kao u `DifficultyBadge`).
5. ACF polja za izlet (cijena, trajanje, max osoba, polazište, lokacija, sljedeći polazak, istaknut, vodič).
6. Stranica postavki (kontakt, telefoni, mreže, radno vrijeme, uvod galerije).
7. Predlošci: početna, popis izleta s pretragom/težinom, detalj izleta, popis galerija s paginacijom, galerija, o nama, kontakt, blog.

**Faza 3 — uvoz sadržaja**
8. Skripta `wordpress/import/import.php` (pokreće se kroz `wp eval-file`): čita JSON izvoz, stvara postove,
   preuzima slike u medijsku biblioteku (`media_sideload_image`), povezuje vodiče i oznake, postavlja slugove.
   Idempotentna (po slugu), pa se može ponavljati do cutovera.
9. Izvoz s produkcije u `wordpress/import/data/*.json` + CSV poruka (privatno, ne u git).

**Faza 4 — dva dijela stranice**
10. Jedna instalacija, dva dijela u izborniku: **Agencija** (izleti, galerije, blog) i **Razvoj / usluge**
    (web i programska rješenja: usluge, reference, kontakt). Odluka domene/izgleda u pitanjima dolje.

**Faza 5 — cutover**
11. Hosting (isti cPanel kao pd-pinklec ili novi), staging pod subdomenom, test svih stranica na mobitelu.
12. 301 preusmjeravanja (`/galerija/{id}`), provjera `sitemap.xml` i Search Consolea.
13. Promjena DNS-a, praćenje 1–2 tjedna, tek tada gašenje Rendera i R2 (ušteda ~15 $/mj.).

Time nestaju i otvoreni zadaci: rotacija R2 ključa, admin lozinka `admin123` u gitu, cold start na free planu,
ne-radi auto-deploy, `r2.dev` rate limit.

## 5. Online plaćanje (kasnije — samo da danas ne zatvorimo vrata)

- Standard je **WooCommerce** + hrvatski gateway (npr. CorvusPay ili WSPay, ili Stripe).
- Najčešći obrazac za izlete: izlet = proizvod, polazak = varijacija s datumom, zaliha = broj mjesta (`max_participants`).
  Zato CPT `izlet` dobiva polje „ID proizvoda" kasnije; migracija je tad `wp eval-file` skripta, ne prepravak od nule.
- Prije toga treba riješiti **pravno** (turistička agencija, jamstvo putnika, fiskalizacija, opći uvjeti) — vidi `PLAN.md` §7.

## 6. Rizici

- **Ažuriranja i sigurnost:** automatska ažuriranja core-a i pluginova, backup (UpdraftPlus ili hosting), mali broj pluginova, 2FA za admina.
- **Slike:** provjeriti ukupnu veličinu R2 bucketa prije odabira hostinga (disk).
- **SEO:** izleti i galerije moraju zadržati URL-ove; inače pad pozicija.
- **Dizajn:** React izgled se ne prenosi 1:1, tema se piše ispočetka (pinklec je predložak).

## 7. Odluke (14.–15. 10. 2026.)

- **Jedan WordPress, dvije domene:** `hikeit.hr` (agencija) i `hikeit.dev` (usluge). `wordpress/hosts.php`
  postavlja `WP_HOME` prema Host zaglavlju (samo za popisane domene) i `HIKEIT_DEV`; tema po tome mijenja
  naslovnicu (stranica `razvoj`) i zaglavlje (`header-dev`). Lokalno: `localhost:8089` i `dev.localhost:8089`.
- Nova domena: **hikeit.dev** (provjereno DNS-om da nema zapisa; potvrditi kod registrara).

## 8. Napredak

- ☑ Faza 1: `wordpress/` (compose, hosts.php, bin/install.sh), plugini, kostur stranica.
- ☑ Faza 2 (osnova): tipovi `izlet`/`vodic`/`galerija` + oznake, ACF polja, predlošci, forma (CF7 + Flamingo),
  sadržaj stranica prenesen iz React stranice (`bin/seed-stranice.php`), uvoz stvarnih podataka s produkcije
  (`bin/izvoz.sh` + `bin/uvoz.php`: 1 izlet, 1 vodič, 2 galerije, postavke kontakta).
- ☑ Izgled: bijela tema, paleta „Markacija" kao u pd-pinklec (crvena + tinta), tamni način (gumb u zaglavlju),
  lokalni fontovi Playfair Display i Inter.
- ☑ Faza 3: uvoz provjeren — produkcija ima 1 izlet, 1 vodiča, 2 galerije (ukupno 9 slika, ~5 MB s thumbnailima), sve je uvezeno;
  ponovno pokretanje ne duplicira zapise. 301 sa starih adresa (`/galerija/{id}`, `/galerija?stranica=N`) u `inc/preusmjeravanja.php`.
  Poruke iz kontakta nisu uvožene (traže admin prijavu; po potrebi ručni CSV).
- ☑ Faza 4: dva dijela stranice. hikeit.dev ima vlastitu naslovnicu (usluge, kako radimo, reference, poziv na upit), vlastitu
  kontakt formu („Kontakt razvoj"), tip sadržaja `referenca` (2 nacrta: hikeit.hr i PD Pinklec; sekcija se ne prikazuje dok
  nijedna nije objavljena) i opis stranice po domeni. Sadržaj jedne domene preusmjerava (301) na drugu
  (`/izleti`, `/galerija`, `/o-nama`, `/blog` s .dev na .hr; `/razvoj` s .hr na .dev; www → bez www).
- ☑ Portfolio: stranica `/reference/` na hikeit.dev (tip sadržaja Reference, snimke zaslona u `wordpress/seed-slike/`; reference su nacrti dok ih ne objaviš u adminu).
- ☑ hikeit.dev landing (prijedlog tekstova, treba potvrdu): ciljna skupina (obrti, udruge, agencije), cijene „od" (590 € / 1.200 € / 30 € mjesečno — PRIJEDLOG),
  stranice usluga s vlastitim URL-om i SEO naslovima (`/usluge/`, `/usluge/web-stranice/`, `/usluge/aplikacije-po-mjeri/`, `/usluge/odrzavanje/`),
  hero sa snimkom stvarne stranice umjesto stock slike, „Tko stoji iza", opis uz logo, kontakt bez radnog vremena agencije, polje za zasebni e-mail razvoja.
- ☑ O meni (`/o-meni/` na hikeit.dev): tekst, stručnosti, LinkedIn (polje u postavkama na stranici Kontakt), JSON-LD Person. Fotografija: dodaj `wordpress/seed-slike/portret.jpg` i pokreni seed, ili postavi u adminu.
- ☑ Upravljanje u temi (`inc/panel.php`, `inc/dvofaktor.php`): `/prijava/` s obaveznim 2FA (TOTP + rezervni kodovi, ograničenje pokušaja; wp-login.php ne prima prijave) i `/upravljanje/` (izleti, galerije, vodiči, upiti iz Flaminga, kontakt podaci) bez wp-admina. Provjera: `wp eval-file bin/test-2fa.php`. Poništavanje 2FA: `wp user meta delete ID hk_totp_tajna`.
- ☐ Ostaje: pregled na mobitelu, fino štimanje izgleda, SEO/OG podaci, 301 `/galerija/{id}`, SMTP,
  `hikeit.dev` sadržaj (tekst na stranici Razvoj je NACRT), uklanjanje izmišljenih brojki (vidi niže).
- Sadržaj koji NISAM prenio jer je izmišljen u React kodu: „120+ putnika", „5★", „8+ godina", „5.0 (12 recenzija)".
- Provjeriti prije lansiranja: tvrdnje „certificirani vodiči" i „max 12 osoba", te tekst „Ana…" u O nama (na produkciji je samo jedan vodič).

## 9. Pitanja za tebe (ostala)

1. **Domena i dva dijela:** isti `hikeit.hr` s dva izbornika, ili razvoj usluga na zasebnoj domeni/poddomeni?
   (Agencija i „prodaja weba" su različita publika; jedna tema ih teško drži u istom brendu.)
2. **Hosting:** ostajemo na cPanelu kao pd-pinklec ili novi?
3. **Dizajn:** vjerno prenijeti sadašnji izgled ili iskoristiti selidbu za osvježenje?
4. **Pristup produkciji:** dovoljan je javni API, osim poruka iz kontakta — treba li ih uopće arhivirati?
5. **Jezici:** samo hrvatski ili i engleski (utječe na izbor plugina)?

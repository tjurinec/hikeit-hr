# Prelazak na cPanel hosting (hikeit.hr + hikeit.dev)

Stanje (15. 10. 2026.): `hikeit.hr` ima DNS na Cloudflareu i A zapise na Render; **nema MX zapisa** (domena ne prima e-poštu);
`hikeit.dev` nije registriran. WordPress sadržaj nema nijedne veze na R2 (provjereno u bazi).

## 0. Što je potrebno od vlasnika
1. Hosting (vidi §1) i pristup cPanelu (ne u git, ne u razgovor).
2. Registracija `hikeit.dev` (ili odustajanje; tada se hikeit.dev dio gasi).
3. Pristup Cloudflare računu (DNS) i Render dashboardu.

## 1. Zahtjevi za hosting
PHP 8.1+ (bolje 8.3), MariaDB/MySQL, **SSH + WP-CLI** (inače ručno), besplatni SSL (AutoSSL), mogućnost dodatne domene (*addon domain*,
`hikeit.dev` mora pokazivati u **isti** direktorij kao `hikeit.hr`), sandučić `info@hikeit.hr`, SMTP. Prostor: ~100 MB (+ rast).
Najjeftinije: dodati `hikeit.hr` kao addon domenu na postojeći cPanel (pd-pinklec) ako plan dopušta; inače najmanji paket s cPanelom.

## 2. Instalacija (na poslužitelju)
```bash
# u docroot-u za hikeit.hr
wp core download --locale=hr && wp config create --dbname=… --dbuser=… --dbpass=… --skip-check
cp hosts.php ../hosts.php          # izvan docroota
# na kraj wp-config.php (prije "That's all"):  require __DIR__ . '/../hosts.php';
wp core install --url=https://hikeit.hr --title=hikeIT --admin_user=admin --admin_email=… --skip-email
wp plugin install advanced-custom-fields contact-form-7 flamingo wp-mail-smtp redirection wordpress-seo --activate
# tema: wp-content/themes/hikeit iz gita (git clone ili scp), zatim:
wp theme activate hikeit
```

## 3. Sadržaj
Lokalno: `wordpress/bin/izvoz-za-hosting.sh` → `wordpress/build/hikeit.sql` + `uploads.tgz` (adrese već su `https://hikeit.hr` / `https://hikeit.dev`;
probni korisnici, 2FA tajne i Flamingo poruke izbačeni; ispiše **novu lozinku za `admin`**). Ponoviti neposredno prije prelaska.
```bash
wp db import hikeit.sql && tar -xzf uploads.tgz -C wp-content/ && wp rewrite flush
```
Zatim: u `/prijava/` prijava s admin lozinkom i **postavljanje 2FA**, nova lozinka, izrada korisnika za urednika (rola Editor).
`WP_DEBUG` isključen, `define('DISALLOW_FILE_EDIT', true);` u wp-config.php.

## 4. E-pošta
Sandučić `info@hikeit.hr` na hostingu; MX i SPF/DKIM po uputi hostinga; WP Mail SMTP (SMTP tog sandučića). Probno poslati iz obje forme.

## 5. DNS (Cloudflare, `hikeit.hr`)
Prije prelaska snizi TTL. Promijeni A zapise `@` i `www` s Rendera na IP hostinga (prvo test s `hosts` datotekom). Obrisati custom domene u Renderu.
`hikeit.dev`: nameserveri/A zapis na isti IP. Provjere: `/izleti`, `/galerija`, 301 sa www, forme, `/prijava/`, `sitemap_index.xml`, Search Console.

## 6. Gašenje (tek nakon 1–2 tjedna mirnog rada)
Prije: s produkcije izvući poruke iz kontakta (traže admin prijavu) i dump Postgresa. Zatim: Render (backend, frontend, baza), **Cloudflare R2**
(bucket + API tokeni), GitHub deploy hookovi, `main` grana → tag `pre-wordpress`. Cloudflare DNS može ostati besplatan.

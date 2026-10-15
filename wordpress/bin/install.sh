#!/usr/bin/env bash
# Lokalna instalacija: ./bin/install.sh  (jednom, nakon `docker compose up -d`)
# Idempotentno: ponovno pokretanje samo dopunjuje što fali.
set -euo pipefail
cd "$(dirname "$0")/.."
wp() { docker compose run --rm -T cli wp "$@"; }

until wp db check >/dev/null 2>&1; do echo "čekam bazu…"; sleep 3; done

wp core is-installed 2>/dev/null || wp core install --url=http://localhost:8089 \
  --title="hikeIT" --admin_user=admin --admin_password=hikeit --admin_email=info@hikeit.hr --skip-email

wp language core install hr --activate
wp option update timezone_string Europe/Zagreb
wp option update blogdescription "Planinarski izleti i web rješenja"
wp rewrite structure '/%postname%/' --hard
wp theme activate hikeit

# ponudi: ACF (polja), CF7 + Flamingo (forma i poruke), SMTP, 301, SEO
wp plugin install advanced-custom-fields contact-form-7 flamingo wp-mail-smtp redirection wordpress-seo --activate

wp plugin delete akismet hello 2>/dev/null || true

# kostur stranica; sadržaj dolazi kasnije
mk() { wp post list --post_type=page --name="$1" --format=ids | grep -q . || wp post create --post_type=page --post_status=publish --post_name="$1" --post_title="$2" --porcelain; }
mk pocetna "Početna" >/dev/null
mk razvoj "Razvoj" >/dev/null
mk o-nama "O nama" >/dev/null
mk kontakt "Kontakt" >/dev/null
mk blog "Blog" >/dev/null
mk reference "Reference" >/dev/null
id() { wp post list --post_type=page --name="$1" --field=ID; }
wp option update show_on_front page
wp option update page_on_front "$(id pocetna)"
wp option update page_for_posts "$(id blog)"
wp post delete $(wp post list --post_type=page --name=sample-page --format=ids) --force 2>/dev/null || true
wp post delete 1 --force 2>/dev/null || true


# sadržaj: stranice iz stare React stranice + stvarni podaci s produkcije
wp rewrite flush --hard
wp eval-file bin/seed-stranice.php "$@"
[ -f import/data/gallery.json ] || ./bin/izvoz.sh
wp eval-file bin/uvoz.php
echo "gotovo: http://localhost:8089 (agencija), http://dev.localhost:8089 (hikeit.dev) — admin / hikeit"

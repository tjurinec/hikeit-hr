#!/usr/bin/env bash
# Pakira lokalni sadržaj za hosting: build/hikeit.sql (adrese za produkciju, bez probnih korisnika i 2FA tajni)
# i build/uploads.tgz. Lokalna baza se ne mijenja (radi se na kopiji).
# Uporaba: bin/izvoz-za-hosting.sh [domena-agencije] [domena-razvoja]   (zadano hikeit.hr dev.hikeit.hr)
set -euo pipefail
cd "$(dirname "$0")/.."
HR=${1:-hikeit.hr}; DEV=${2:-dev.hikeit.hr}
mkdir -p build
wp()  { docker compose run --rm -T -e WORDPRESS_DB_NAME=izvoz cli wp "$@"; }
sql() { docker compose exec -T db mariadb -uroot -proot "$@"; }

docker compose exec -T db mariadb-dump -uroot -proot wordpress > build/raw.sql
sql -e "DROP DATABASE IF EXISTS izvoz; CREATE DATABASE izvoz; GRANT ALL ON izvoz.* TO 'wordpress'@'%';"
sql izvoz < build/raw.sql
rm build/raw.sql

# dev.localhost prije localhost (inače bi prva zamjena pojela dio druge)
wp search-replace 'http://dev.localhost:8089' "https://$DEV" --all-tables --quiet
wp search-replace 'http://localhost:8089' "https://$HR" --all-tables --quiet
# isto u JSON-u (kosa crta je escapeana)
wp search-replace 'http:\/\/dev.localhost:8089' "https:\/\/$DEV" --all-tables --quiet
wp search-replace 'http:\/\/localhost:8089' "https:\/\/$HR" --all-tables --quiet
# probni korisnici i 2FA tajne ne idu na produkciju
wp user list --field=user_login | grep -vx admin | xargs -r -I{} docker compose run --rm -T -e WORDPRESS_DB_NAME=izvoz cli wp user delete {} --yes
wp eval 'foreach ( array( "hk_totp_tajna", "hk_totp_zadnji", "hk_rezervni" ) as $k ) { delete_metadata( "user", 0, $k, "", true ); } delete_transient( "hk_pravila" ); delete_option( "hk_pravila" );'
LOZINKA=$(head -c 18 /dev/urandom | base64 | tr -d '/+=' | head -c 20)
wp user update admin --user_pass="$LOZINKA" --skip-email >/dev/null
# probne poruke i kontakti iz Flaminga ne idu na produkciju
wp eval '$p = get_posts( array( "post_type" => array( "flamingo_inbound", "flamingo_contact", "flamingo_outbound" ), "post_status" => "any", "numberposts" => -1, "fields" => "ids" ) ); foreach ( $p as $i ) { wp_delete_post( $i, true ); }'
wp db export - > build/hikeit.sql
sql -e "DROP DATABASE izvoz;"

docker compose run --rm -T cli tar -C /var/www/html/wp-content -cz uploads > build/uploads.tgz
echo; echo "Gotovo: $(du -h build/hikeit.sql | cut -f1) baza, $(du -h build/uploads.tgz | cut -f1) uploads u wordpress/build/"
umask 077; printf %s "$LOZINKA" > ~/.hikeit_wp_admin_pass
echo "Lozinka za 'admin' na produkciji spremljena u ~/.hikeit_wp_admin_pass (promijeni nakon prijave)."

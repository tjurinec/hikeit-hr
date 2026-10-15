<?php
/**
 * Jedna instalacija, dvije domene. WP_HOME/WP_SITEURL slijede Host zaglavlje,
 * ali samo za popisane domene — inače bi Host zaglavlje određivalo adrese
 * u kolačićima, mailovima i preusmjeravanjima.
 *
 * Na poslužitelju se ovaj fajl uključuje iz wp-config.php (require).
 */
$hosts = array(
	'hikeit.hr', 'www.hikeit.hr', 'hikeit.dev', 'www.hikeit.dev',
	'localhost:8089', 'dev.localhost:8089',
);
$zadani = getenv( 'HIKEIT_ZADANI_HOST' ) ?: 'localhost:8089';
$host   = strtolower( $_SERVER['HTTP_HOST'] ?? '' );
if ( ! in_array( $host, $hosts, true ) ) {
	$host = $zadani;
}
$shema = str_contains( $host, 'localhost' ) ? 'http' : 'https';
define( 'WP_HOME', "$shema://$host" );
define( 'WP_SITEURL', "$shema://$host" );
// Dev domena = usluge (web/softver), sve ostalo = turistička agencija.
define( 'HIKEIT_DEV', str_starts_with( $host, 'hikeit.dev' ) || str_starts_with( $host, 'www.hikeit.dev' ) || str_starts_with( $host, 'dev.localhost' ) );

// Domene dvaju dijelova (za preusmjeravanja između njih).
define( 'HIKEIT_HOST_AGENCIJA', str_contains( $host, 'localhost' ) ? 'localhost:8089' : 'hikeit.hr' );
define( 'HIKEIT_HOST_DEV', str_contains( $host, 'localhost' ) ? 'dev.localhost:8089' : 'hikeit.dev' );
define( 'HIKEIT_SHEMA', $shema );

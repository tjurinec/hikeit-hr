<?php
/** Zajedničko za bin/seed-stranice.php i bin/uvoz.php (pokreće se kroz `wp eval-file`). */

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

/** Slika s URL-a u medijsku biblioteku; ponovno pokretanje ne duplicira. */
function hk_slika( string $url, string $opis = '' ): int {
	$postojeca = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids', 'meta_key' => '_hikeit_izvor', 'meta_value' => $url ) );
	if ( $postojeca ) {
		return (int) $postojeca[0];
	}
	// media_sideload_image traži nastavak u URL-u (Unsplash ga nema), pa idemo preko download_url.
	$tmp = download_url( $url );
	if ( is_wp_error( $tmp ) ) {
		WP_CLI::warning( "Slika nije preuzeta: $url — " . $tmp->get_error_message() );
		return 0;
	}
	$ime = basename( wp_parse_url( $url, PHP_URL_PATH ) );
	if ( ! preg_match( '/\.(jpe?g|png|webp|gif)$/i', $ime ) ) {
		$ime .= '.jpg';
	}
	$id = media_handle_sideload( array( 'name' => $ime, 'tmp_name' => $tmp ), 0, $opis );
	if ( is_wp_error( $id ) ) {
		@unlink( $tmp );
		WP_CLI::warning( "Slika nije preuzeta: $url — " . $id->get_error_message() );
		return 0;
	}
	update_post_meta( $id, '_hikeit_izvor', $url );
	return (int) $id;
}

/** Slika iz lokalne datoteke (npr. wordpress/seed-slike); idempotentno po putanji. */
function hk_slika_datoteka( string $putanja, string $opis = '' ): int {
	$kljuc = 'datoteka:' . basename( $putanja );
	$postojeca = get_posts( array( 'post_type' => 'attachment', 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids', 'meta_key' => '_hikeit_izvor', 'meta_value' => $kljuc ) );
	if ( $postojeca ) {
		return (int) $postojeca[0];
	}
	if ( ! is_file( $putanja ) ) {
		return 0;
	}
	$tmp = wp_tempnam( basename( $putanja ) );
	copy( $putanja, $tmp );
	$id = media_handle_sideload( array( 'name' => basename( $putanja ), 'tmp_name' => $tmp ), 0, $opis );
	if ( is_wp_error( $id ) ) {
		@unlink( $tmp );
		return 0;
	}
	update_post_meta( $id, '_hikeit_izvor', $kljuc );
	return (int) $id;
}

function hk_p( string $tekst, string $klasa = '', string $poravnanje = '' ): string {
	$atr = array();
	if ( $poravnanje ) {
		$atr['align'] = $poravnanje;
	}
	if ( $klasa ) {
		$atr['className'] = $klasa;
	}
	$j = $atr ? ' ' . wp_json_encode( $atr ) : '';
	$c = trim( ( $poravnanje ? "has-text-align-$poravnanje " : '' ) . $klasa );
	return "<!-- wp:paragraph$j -->\n<p" . ( $c ? " class=\"$c\"" : '' ) . ">$tekst</p>\n<!-- /wp:paragraph -->\n";
}

function hk_h( string $tekst, int $razina = 2, string $poravnanje = '' ): string {
	$atr = array( 'level' => $razina );
	if ( $poravnanje ) {
		$atr['textAlign'] = $poravnanje;
	}
	$c = 'wp-block-heading' . ( $poravnanje ? " has-text-align-$poravnanje" : '' );
	return '<!-- wp:heading ' . wp_json_encode( $atr ) . " -->\n<h$razina class=\"$c\">$tekst</h$razina>\n<!-- /wp:heading -->\n";
}

function hk_gumbi( array $gumbi, bool $obrub_zadnji = false ): string {
	$o = "<!-- wp:buttons {\"layout\":{\"type\":\"flex\",\"justifyContent\":\"center\"}} -->\n<div class=\"wp-block-buttons\">";
	foreach ( $gumbi as $i => [ $naslov, $url ] ) {
		$obrub = $obrub_zadnji && $i === count( $gumbi ) - 1;
		$o    .= '<!-- wp:button' . ( $obrub ? ' {"className":"is-style-outline"}' : '' ) . " -->\n<div class=\"wp-block-button" . ( $obrub ? ' is-style-outline' : '' ) . "\"><a class=\"wp-block-button__link wp-element-button\" href=\"$url\">$naslov</a></div>\n<!-- /wp:button -->";
	}
	return $o . "</div>\n<!-- /wp:buttons -->\n";
}

function hk_stupci( array $stupci, bool $ploha = true ): string {
	$o = "<!-- wp:columns {\"align\":\"wide\"} -->\n<div class=\"wp-block-columns alignwide\">";
	foreach ( $stupci as $s ) {
		$o .= "<!-- wp:column -->\n<div class=\"wp-block-column\">$s</div>\n<!-- /wp:column -->";
	}
	return $o . "</div>\n<!-- /wp:columns -->\n";
}

/** Kartica prednosti/vrijednosti: naslov + opis, za stupce. */
function hk_kartica( string $naslov, string $opis ): string {
	return hk_h( $naslov, 3, 'center' ) . hk_p( $opis, '', 'center' );
}

/** Puna širina, s razmakom; $pozadina = slug boje iz palete ili ''. */
function hk_sekcija( string $unutra, string $pozadina = '', string $sidro = '' ): string {
	$atr = array( 'align' => 'full', 'className' => 'hk-sekcija', 'layout' => array( 'type' => 'constrained', 'wideSize' => '72rem' ),
		'style' => array( 'spacing' => array( 'padding' => array( 'top' => 'var:preset|spacing|50', 'bottom' => 'var:preset|spacing|50' ) ) ) );
	$kl = 'wp-block-group alignfull hk-sekcija';
	if ( $pozadina ) {
		$atr['backgroundColor'] = $pozadina;
		$kl                    .= " has-$pozadina-background-color has-background";
	}
	if ( $sidro ) {
		$atr['anchor'] = $sidro;
	}
	return '<!-- wp:group ' . wp_json_encode( $atr ) . " -->\n<div" . ( $sidro ? " id=\"$sidro\"" : '' ) . " class=\"$kl\" style=\"padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)\">$unutra</div>\n<!-- /wp:group -->\n";
}

/** Slika preko cijele širine s tamnim slojem i sadržajem na sredini. */
function hk_naslovnica( int $slika_id, string $unutra, int $visina_vh = 70, int $tamnjenje = 50 ): string {
	$url = wp_get_attachment_url( $slika_id );
	$atr = array( 'url' => $url, 'id' => $slika_id, 'dimRatio' => $tamnjenje, 'minHeight' => $visina_vh, 'minHeightUnit' => 'vh', 'align' => 'full', 'className' => 'hk-hero' );
	return '<!-- wp:cover ' . wp_json_encode( $atr, JSON_UNESCAPED_SLASHES ) . " -->\n<div class=\"wp-block-cover alignfull hk-hero\" style=\"min-height:{$visina_vh}vh\"><span aria-hidden=\"true\" class=\"wp-block-cover__background has-background-dim-$tamnjenje has-background-dim\"></span><img class=\"wp-block-cover__image-background wp-image-$slika_id\" alt=\"\" src=\"$url\" data-object-fit=\"cover\"/><div class=\"wp-block-cover__inner-container\">$unutra</div></div>\n<!-- /wp:cover -->\n";
}

function hk_shortcode( string $kod ): string {
	return "<!-- wp:shortcode -->\n$kod\n<!-- /wp:shortcode -->\n";
}

function hk_stranica( string $slug ): ?WP_Post {
	return get_page_by_path( $slug );
}

/** Upisuje sadržaj samo ako je stranica prazna (ili uz `force`), da se uređeno ne prebriše. */
function hk_postavi_sadrzaj( string $slug, string $sadrzaj, bool $force, string $predlozak = '' ): void {
	$s = hk_stranica( $slug );
	if ( ! $s ) {
		WP_CLI::warning( "Nema stranice $slug" );
		return;
	}
	if ( trim( $s->post_content ) !== '' && ! $force ) {
		WP_CLI::log( "$slug: već ima sadržaj, preskačem (dodaj `force` za prepisivanje)" );
		return;
	}
	wp_update_post( array( 'ID' => $s->ID, 'post_content' => wp_slash( $sadrzaj ) ) );
	if ( $predlozak ) {
		update_post_meta( $s->ID, '_wp_page_template', $predlozak );
	}
	WP_CLI::success( "$slug: sadržaj postavljen" );
}

<?php
/**
 * Uvoz produkcijskih podataka (import/data/*.json, vidi bin/izvoz.sh).
 * Idempotentno: zapisi se prepoznaju po meta `_hikeit_izvor_id` (vrsta:id) i ažuriraju.
 * Pokretanje: wp eval-file bin/uvoz.php
 */
require_once __DIR__ . '/lib.php';

$dir = __DIR__ . '/../import/data';
$citaj = fn( $f ) => is_file( "$dir/$f" ) ? json_decode( file_get_contents( "$dir/$f" ), true ) : array();

/** Nađi ili stvori post po izvornom ID-u. */
function hk_upsert( string $vrsta, $izvor_id, array $post ): int {
	$kljuc = "$vrsta:$izvor_id";
	$nadjen = get_posts( array( 'post_type' => $post['post_type'], 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids', 'meta_key' => '_hikeit_izvor_id', 'meta_value' => $kljuc ) );
	if ( $nadjen ) {
		$post['ID'] = $nadjen[0];
		wp_update_post( wp_slash( $post ) );
		return $nadjen[0];
	}
	$id = wp_insert_post( wp_slash( $post ) );
	update_post_meta( $id, '_hikeit_izvor_id', $kljuc );
	return $id;
}

function hk_odlomci( ?string $tekst ): string {
	$o = '';
	foreach ( preg_split( '/\n\s*\n/', trim( (string) $tekst ) ) as $odl ) {
		if ( trim( $odl ) !== '' ) {
			$o .= hk_p( nl2br( esc_html( trim( $odl ) ) ) );
		}
	}
	return $o;
}

// hk_galerija_blok() dolazi iz teme (inc/panel.php)

// --- vodiči ---
$vodic_wp = array();
foreach ( $citaj( 'guides.json' ) as $i => $v ) {
	$id = hk_upsert( 'vodic', $v['id'], array(
		'post_type' => 'vodic', 'post_status' => 'publish', 'post_title' => $v['name'],
		'post_content' => hk_odlomci( $v['bio'] ), 'menu_order' => $i,
	) );
	update_field( 'specijalizacija', $v['specialization'] ?? '', $id );
	if ( ! empty( $v['avatarUrl'] ) && ( $sl = hk_slika( $v['avatarUrl'], $v['name'] ) ) ) {
		set_post_thumbnail( $id, $sl );
	}
	$vodic_wp[ $v['id'] ] = $id;
	WP_CLI::success( "vodič: {$v['name']}" );
}

// --- izleti ---
$tezina = array( 'EASY' => 'lagano', 'MODERATE' => 'umjereno', 'HARD' => 'tesko', 'EXPERT' => 'ekspert' );
foreach ( $citaj( 'excursions-detail.json' ) as $e ) {
	$sl_ids = array();
	foreach ( $e['imageUrls'] ?? array() as $u ) {
		if ( $sl = hk_slika( $u ) ) {
			$sl_ids[] = array( $sl, '' );
		}
	}
	$id = hk_upsert( 'izlet', $e['id'], array(
		'post_type' => 'izlet', 'post_status' => ! empty( $e['published'] ) ? 'publish' : 'draft',
		'post_title' => $e['title'], 'post_name' => $e['slug'], 'post_excerpt' => $e['description'] ?? '',
		'post_content' => hk_odlomci( $e['content'] ?? '' ) . hk_galerija_blok( $sl_ids ),
		'post_date_gmt' => gmdate( 'Y-m-d H:i:s', strtotime( $e['publishedAt'] ?? 'now' ) ),
		'post_date' => get_date_from_gmt( gmdate( 'Y-m-d H:i:s', strtotime( $e['publishedAt'] ?? 'now' ) ) ),
	) );
	foreach ( array( 'tezina' => $tezina[ $e['difficulty'] ] ?? 'umjereno', 'trajanje_dana' => $e['durationDays'], 'max_sudionika' => $e['maxParticipants'],
		'cijena' => $e['price'], 'lokacija' => $e['location'], 'polaziste' => $e['startingPoint'],
		'sljedeci_polazak' => ! empty( $e['nextDeparture'] ) ? str_replace( '-', '', $e['nextDeparture'] ) : '',
		'vodic' => $vodic_wp[ $e['guide']['id'] ?? 0 ] ?? '', 'istaknut' => ! empty( $e['featured'] ) ? 1 : 0 ) as $polje => $vr ) {
		update_field( $polje, $vr, $id );
	}
	if ( ! empty( $e['coverImageUrl'] ) && ( $sl = hk_slika( $e['coverImageUrl'], $e['title'] ) ) ) {
		set_post_thumbnail( $id, $sl );
	}
	wp_set_object_terms( $id, $e['tags'] ?? array(), 'oznaka' );
	WP_CLI::success( "izlet: {$e['title']}" );
}

// --- galerije ---
foreach ( $citaj( 'gallery.json' ) as $i => $g ) {
	$slike = array();
	foreach ( $g['images'] as $sl ) {
		if ( $id_sl = hk_slika( $sl['url'], $sl['caption'] ?? '' ) ) {
			$slike[] = array( $id_sl, $sl['caption'] ?? '' );
		}
	}
	$id = hk_upsert( 'galerija', $g['id'], array(
		'post_type' => 'galerija', 'post_status' => 'publish', 'post_title' => $g['title'],
		'post_content' => hk_odlomci( $g['description'] ?? '' ) . hk_galerija_blok( $slike ), 'menu_order' => $i,
	) );
	update_field( 'vanjski_link', $g['externalUrl'] ?? '', $id );
	if ( $slike ) {
		set_post_thumbnail( $id, $slike[0][0] );
	}
	WP_CLI::success( "galerija: {$g['title']} (" . count( $slike ) . ' slika)' );
}

// --- postavke (polja na stranici Kontakt) ---
if ( $p = $citaj( 'settings.json' ) ) {
	$k = get_page_by_path( 'kontakt' );
	if ( $k ) {
		$tel = implode( "\n", array_map( fn( $t ) => trim( ( $t['label'] ?? '' ) . ' | ' . $t['number'], ' |' ), $p['phones'] ?? array() ) );
		foreach ( array( 'email' => $p['contactEmail'], 'telefoni' => $tel, 'lokacija' => $p['location'], 'lokacija_napomena' => $p['locationNote'],
			'radno_vrijeme' => $p['workingHours'], 'radno_vrijeme_napomena' => $p['workingHoursNote'],
			'instagram' => $p['instagramUrl'], 'facebook' => $p['facebookUrl'], 'galerija_uvod' => $p['galleryIntro'] ) as $polje => $vr ) {
			update_field( $polje, $vr ?? '', $k->ID );
		}
		WP_CLI::success( 'postavke kontakta' );
	}
}

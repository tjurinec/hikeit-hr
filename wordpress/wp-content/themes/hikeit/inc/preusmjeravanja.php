<?php
/**
 * 301 sa starih adresa React stranice:
 *   /galerija/{id}          → /galerija/{slug}/   (id je izvorni ID iz stare baze)
 *   /galerija?stranica=N    → /galerija/page/N/
 */
add_action( 'template_redirect', function () {
	$putanja = trim( (string) wp_parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' );

	if ( is_post_type_archive( 'galerija' ) && isset( $_GET['stranica'] ) ) {
		$n = max( 1, (int) $_GET['stranica'] );
		wp_safe_redirect( $n > 1 ? get_post_type_archive_link( 'galerija' ) . "page/$n/" : get_post_type_archive_link( 'galerija' ), 301 );
		exit;
	}

	if ( is_404() && preg_match( '#^galerija/(\d+)$#', $putanja, $m ) ) {
		$g = get_posts( array( 'post_type' => 'galerija', 'numberposts' => 1, 'fields' => 'ids', 'meta_key' => '_hikeit_izvor_id', 'meta_value' => "galerija:{$m[1]}" ) );
		if ( $g ) {
			wp_safe_redirect( get_permalink( $g[0] ), 301 );
			exit;
		}
	}
} );

/**
 * Dva dijela, dvije domene: sadržaj jedne domene ne smije biti dostupan na drugoj
 * (dupli sadržaj za tražilice). www → bez www.
 */
add_action( 'template_redirect', function () {
	$host     = strtolower( $_SERVER['HTTP_HOST'] ?? '' );
	$uri      = $_SERVER['REQUEST_URI'] ?? '/';
	$putanja  = trim( (string) wp_parse_url( $uri, PHP_URL_PATH ), '/' );
	$prvi     = explode( '/', $putanja )[0];
	$agencija = array( 'izleti', 'galerija', 'o-nama', 'blog', 'oznaka' );

	if ( str_starts_with( $host, 'www.' ) ) {
		$cilj = substr( $host, 4 );
	} elseif ( HIKEIT_DEV && in_array( $prvi, $agencija, true ) ) {
		$cilj = HIKEIT_HOST_AGENCIJA;
	} elseif ( ! HIKEIT_DEV && 'razvoj' === $prvi ) {
		$cilj = HIKEIT_HOST_DEV;
		$uri  = '/';
	} else {
		return;
	}
	wp_redirect( HIKEIT_SHEMA . '://' . $cilj . $uri, 301 );
	exit;
}, 1 );

<?php
/**
 * hikeIT — block tema. Jedna instalacija, dvije domene (HIKEIT_DEV iz hosts.php).
 */

// Bez hosts.php (npr. drugi hosting) tema se ponaša kao agencija.
if ( ! defined( 'HIKEIT_DEV' ) ) {
	define( 'HIKEIT_DEV', false );
}

foreach ( array( 'tipovi', 'polja', 'prikaz', 'tamno', 'preusmjeravanja', 'admin' ) as $modul ) {
	require_once get_theme_file_path( "inc/$modul.php" );
}

// Blok teme ne učitavaju style.css same od sebe.
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'hikeit', get_stylesheet_uri(), array(), filemtime( get_theme_file_path( 'style.css' ) ) );
} );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_editor_style( 'style.css' );
} );

// Naslovnica ovisi o domeni: stranica "razvoj" na hikeit.dev, inače postavljena u Čitanje.
add_filter( 'pre_option_page_on_front', function ( $zadano ) {
	if ( ! HIKEIT_DEV ) {
		return $zadano;
	}
	$stranica = get_page_by_path( 'razvoj' );
	return $stranica ? $stranica->ID : $zadano;
} );

// Opis stranice ovisi o domeni.
add_filter( 'pre_option_blogdescription', fn( $v ) => HIKEIT_DEV ? 'Web stranice i programska rješenja po mjeri' : $v );

// Zaglavlje ovisi o domeni.
add_filter( 'render_block_data', function ( $blok ) {
	if ( HIKEIT_DEV && 'core/template-part' === $blok['blockName'] && 'header' === ( $blok['attrs']['slug'] ?? '' ) ) {
		$blok['attrs']['slug'] = 'header-dev';
	}
	return $blok;
} );

// Favicon: šahovnica (SVG za moderne preglednike, PNG za Apple i starije).
add_action( 'wp_head', function () {
	$a = get_theme_file_uri( 'assets/' );
	echo '<link rel="icon" href="' . esc_url( $a . 'favicon.svg' ) . '" type="image/svg+xml">' . "\n";
	echo '<link rel="apple-touch-icon" href="' . esc_url( $a . 'favicon-180.png' ) . '">' . "\n";
}, 5 );

// Komentara nema nigdje.
add_filter( 'comments_open', '__return_false', 20 );
add_filter( 'pings_open', '__return_false', 20 );
add_filter( 'comments_array', '__return_empty_array', 20 );
add_action( 'admin_menu', function () {
	remove_menu_page( 'edit-comments.php' );
} );

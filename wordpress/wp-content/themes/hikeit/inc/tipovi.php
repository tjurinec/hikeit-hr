<?php
/**
 * Tipovi sadržaja: izlet, vodič, galerija + oznake izleta.
 * Adrese su iste kao na staroj stranici: /izleti, /izleti/{slug}, /galerija.
 */

add_action( 'init', function () {
	$natpisi = fn( $mn, $jd, $novi ) => array(
		'name'          => $mn,
		'singular_name' => $jd,
		'add_new'       => 'Dodaj',
		'add_new_item'  => $novi,
		'edit_item'     => "Uredi: $jd",
		'all_items'     => "Svi ($mn)",
		'search_items'  => 'Traži',
		'not_found'     => 'Ništa nije pronađeno.',
	);

	register_post_type( 'izlet', array(
		'labels'       => $natpisi( 'Izleti', 'Izlet', 'Novi izlet' ),
		'public'       => true,
		'has_archive'  => 'izleti',
		'rewrite'      => array( 'slug' => 'izleti', 'with_front' => false ),
		'menu_icon'    => 'dashicons-location-alt',
		'menu_position' => 5,
		'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
		'show_in_rest' => true,
	) );

	// Vodiči nemaju vlastite adrese; prikazuju se na stranici "O nama" i na izletima.
	register_post_type( 'vodic', array(
		'labels'       => $natpisi( 'Vodiči', 'Vodič', 'Novi vodič' ),
		'public'       => false,
		'show_ui'      => true,
		'menu_icon'    => 'dashicons-groups',
		'menu_position' => 6,
		'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
		'show_in_rest' => true,
	) );

	register_post_type( 'galerija', array(
		'labels'       => $natpisi( 'Galerije', 'Galerija', 'Nova galerija' ),
		'public'       => true,
		'has_archive'  => 'galerija',
		'rewrite'      => array( 'slug' => 'galerija', 'with_front' => false ),
		'menu_icon'    => 'dashicons-format-gallery',
		'menu_position' => 7,
		'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
		'show_in_rest' => true,
	) );

	register_taxonomy( 'oznaka', 'izlet', array(
		'labels'       => $natpisi( 'Oznake', 'Oznaka', 'Nova oznaka' ),
		'public'       => true,
		'hierarchical' => false,
		'rewrite'      => array( 'slug' => 'oznaka', 'with_front' => false ),
		'show_in_rest' => true,
	) );
} );

// Izleti: najnoviji prvi; galerije i vodiči: ručni redoslijed (Atributi → Redoslijed).
add_action( 'pre_get_posts', function ( $q ) {
	if ( is_admin() || ! $q->is_main_query() ) {
		return;
	}
	if ( $q->is_post_type_archive( 'galerija' ) ) {
		$q->set( 'orderby', array( 'menu_order' => 'ASC', 'date' => 'DESC' ) );
		$q->set( 'posts_per_page', 6 );
	}
	if ( $q->is_post_type_archive( 'izlet' ) ) {
		$q->set( 'posts_per_page', 12 );
	}
} );

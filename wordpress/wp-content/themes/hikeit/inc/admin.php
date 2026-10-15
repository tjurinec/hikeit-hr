<?php
/**
 * Administracija za agenciju: pregledni stupci izleta i galerija, "Upiti" (Flamingo)
 * u izborniku i na nadzornoj ploči. Uređivač (rola Editor) smije sve ovo; plugine i temu ne dira.
 */

// Izlet: cijena, polazak, status na popisu.
add_filter( 'manage_izlet_posts_columns', fn( $c ) => array_slice( $c, 0, 2, true ) + array(
	'hk_cijena'  => 'Cijena',
	'hk_polazak' => 'Sljedeći polazak',
	'hk_ist'     => 'Istaknut',
) + array_slice( $c, 2, null, true ) );
add_action( 'manage_izlet_posts_custom_column', function ( $stupac, $id ) {
	if ( $stupac === 'hk_cijena' ) {
		$c = get_post_meta( $id, 'cijena', true );
		echo $c !== '' ? esc_html( number_format_i18n( (float) $c, 2 ) ) . ' €' : '—';
	} elseif ( $stupac === 'hk_polazak' ) {
		$d = get_post_meta( $id, 'sljedeci_polazak', true );
		echo $d ? esc_html( date_i18n( 'j. n. Y.', strtotime( $d ) ) ) : '—';
	} elseif ( $stupac === 'hk_ist' ) {
		echo get_post_meta( $id, 'istaknut', true ) ? '★' : '';
	}
}, 10, 2 );

// Galerija: broj slika.
add_filter( 'manage_galerija_posts_columns', fn( $c ) => array_slice( $c, 0, 2, true ) + array( 'hk_slika' => 'Slika' ) + array_slice( $c, 2, null, true ) );
add_action( 'manage_galerija_posts_custom_column', function ( $stupac, $id ) {
	if ( $stupac === 'hk_slika' ) {
		echo (int) preg_match_all( '/<img\b/', (string) get_post_field( 'post_content', $id ) );
	}
}, 10, 2 );

// Upite smije čitati i uređivač (Flamingo inače traži edit_users, tj. administratora), osim postavki.
add_filter( 'flamingo_map_meta_cap', fn( $c ) => array_map( fn( $k ) => $k === 'edit_users' ? 'publish_pages' : $k, $c ) + array( 'flamingo_edit_options' => 'manage_options' ) );

// Flamingo u izborniku zove se "Upiti"; CF7 forme vidi samo administrator.
add_action( 'admin_menu', function () {
	global $menu, $submenu;
	foreach ( (array) ( $submenu['flamingo'] ?? array() ) as $k => $stavka ) {
		$submenu['flamingo'][ $k ][0] = $stavka[2] === 'flamingo_inbound' ? 'Primljeni upiti' : 'Kontakti';
	}
	foreach ( (array) $menu as $k => $stavka ) {
		if ( ( $stavka[2] ?? '' ) === 'flamingo' ) {
			$menu[ $k ][0] = 'Upiti';
			$menu[ $k ][6] = 'dashicons-email-alt';
		}
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		remove_menu_page( 'wpcf7-dashboard' );
	}
}, 999 );

// Nadzorna ploča: zadnji upiti.
add_action( 'wp_dashboard_setup', function () {
	if ( ! class_exists( 'Flamingo_Inbound_Message' ) || ! current_user_can( 'publish_pages' ) ) {
		return;
	}
	wp_add_dashboard_widget( 'hk_upiti', 'Zadnji upiti', function () {
		$poruke = Flamingo_Inbound_Message::find( array( 'posts_per_page' => 8 ) );
		if ( ! $poruke ) {
			echo '<p>Još nema upita.</p>';
			return;
		}
		echo '<ul>';
		foreach ( $poruke as $p ) {
			printf( '<li><a href="%s"><strong>%s</strong></a> — %s <span class="description">(%s)</span></li>',
				esc_url( admin_url( 'admin.php?page=flamingo_inbound&post=' . $p->id() . '&action=edit' ) ),
				esc_html( $p->from_name ?: $p->from_email ),
				esc_html( $p->subject ),
				esc_html( get_the_date( 'j. n. Y. H:i', $p->id() ) )
			);
		}
		echo '</ul><p><a href="' . esc_url( admin_url( 'admin.php?page=flamingo_inbound' ) ) . '">Svi upiti →</a></p>';
	} );
} );

// Slike s mobitela imaju 3–8 MB; WP uz original sprema još "scaled" kopiju i manje veličine.
// Zato pri učitavanju original smanjujemo na 2000 px (JPEG ~82 %) i ne radimo "scaled" kopiju: ~0,5–0,8 MB po slici umjesto ~7 MB.
add_filter( 'big_image_size_threshold', '__return_false' );
add_filter( 'wp_handle_upload', function ( $u ) {
	if ( empty( $u['file'] ) || ! in_array( $u['type'] ?? '', array( 'image/jpeg', 'image/png', 'image/webp' ), true ) ) {
		return $u;
	}
	$ed = wp_get_image_editor( $u['file'] );
	if ( is_wp_error( $ed ) ) {
		return $u;
	}
	$ed->maybe_exif_rotate();
	$ed->resize( 2000, 2000 ); // samo smanjuje, nikad ne povećava
	$ed->set_quality( 82 );
	$ed->save( $u['file'] );
	return $u;
} );

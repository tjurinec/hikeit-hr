<?php
/**
 * ACF polja (besplatna inačica). Čitaju se običnim get_post_meta(), pa stranica
 * ne ovisi o ACF-u za prikaz — samo za uređivanje.
 */

function hikeit_tezine(): array {
	return array(
		'lagano'   => 'Lagano',
		'umjereno' => 'Umjereno',
		'tesko'    => 'Teško',
		'ekspert'  => 'Ekspert',
	);
}

add_action( 'acf/init', function () {
	$tekst = fn( $naziv, $oznaka, $extra = array() ) => array_merge(
		array( 'key' => "field_hk_$naziv", 'name' => $naziv, 'label' => $oznaka, 'type' => 'text' ),
		$extra
	);

	acf_add_local_field_group( array(
		'key'      => 'group_hk_izlet',
		'title'    => 'Podaci o izletu',
		'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'izlet' ) ) ),
		'fields'   => array(
			$tekst( 'tezina', 'Težina', array( 'type' => 'select', 'choices' => hikeit_tezine(), 'default_value' => 'umjereno' ) ),
			$tekst( 'trajanje_dana', 'Trajanje (dana)', array( 'type' => 'number', 'min' => 1, 'default_value' => 1 ) ),
			$tekst( 'max_sudionika', 'Najviše sudionika', array( 'type' => 'number', 'min' => 1 ) ),
			$tekst( 'cijena', 'Cijena po osobi (€)', array( 'type' => 'number', 'min' => 0, 'step' => 0.01 ) ),
			$tekst( 'lokacija', 'Lokacija' ),
			$tekst( 'polaziste', 'Polazište' ),
			$tekst( 'sljedeci_polazak', 'Sljedeći polazak', array( 'type' => 'date_picker', 'display_format' => 'd.m.Y.', 'return_format' => 'Y-m-d' ) ),
			$tekst( 'vodic', 'Vodič', array( 'type' => 'post_object', 'post_type' => array( 'vodic' ), 'return_format' => 'id', 'allow_null' => 1 ) ),
			$tekst( 'istaknut', 'Istaknut na naslovnici', array( 'type' => 'true_false', 'ui' => 1 ) ),
		),
	) );

	acf_add_local_field_group( array(
		'key'      => 'group_hk_vodic',
		'title'    => 'Vodič',
		'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'vodic' ) ) ),
		'fields'   => array( $tekst( 'specijalizacija', 'Specijalizacija' ) ),
	) );

	acf_add_local_field_group( array(
		'key'      => 'group_hk_galerija',
		'title'    => 'Galerija',
		'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'galerija' ) ) ),
		'fields'   => array( $tekst( 'vanjski_link', 'Vanjski link (npr. album s drugih fotografija)', array( 'type' => 'url' ) ) ),
	) );

	acf_add_local_field_group( array(
		'key'      => 'group_hk_referenca',
		'title'    => 'Referenca',
		'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'referenca' ) ) ),
		'fields'   => array(
			$tekst( 'adresa', 'Adresa stranice (https://…)', array( 'type' => 'url' ) ),
			$tekst( 'tehnologije', 'Tehnologije (odvojene zarezom)' ),
		),
	) );

	// Postavke stranice žive na stranici "Kontakt" (ACF options traži Pro).
	$p = fn( $n, $o, $e = array() ) => $tekst( $n, $o, array_merge( array( 'key' => "field_hk_p_$n" ), $e ) );
	$kontakt = get_page_by_path( 'kontakt' );
	if ( $kontakt ) {
		acf_add_local_field_group( array(
			'key'      => 'group_hk_postavke',
			'title'    => 'Postavke stranice (kontakt, podnožje, uvod galerija)',
			'location' => array( array( array( 'param' => 'post', 'operator' => '==', 'value' => $kontakt->ID ) ) ),
			'fields'   => array(
				$p( 'email', 'E-mail', array( 'type' => 'email' ) ),
				$p( 'telefoni', 'Telefoni (jedan po retku: Oznaka | broj)', array( 'type' => 'textarea', 'rows' => 3 ) ),
				$p( 'lokacija', 'Lokacija' ),
				$p( 'lokacija_napomena', 'Napomena uz lokaciju' ),
				$p( 'radno_vrijeme', 'Radno vrijeme', array( 'type' => 'textarea', 'rows' => 3 ) ),
				$p( 'radno_vrijeme_napomena', 'Napomena uz radno vrijeme' ),
				$p( 'instagram', 'Instagram (adresa)', array( 'type' => 'url' ) ),
				$p( 'facebook', 'Facebook (adresa)', array( 'type' => 'url' ) ),
				$p( 'galerija_uvod', 'Uvodni tekst na stranici Galerija', array( 'type' => 'textarea', 'rows' => 3 ) ),
			),
		) );
	}
} );

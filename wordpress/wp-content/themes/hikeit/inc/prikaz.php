<?php
/**
 * Prikaz: shortcodeovi koje koriste predlošci i sadržaj stranica.
 * Blok tema nema PHP predložaka, pa popisi i podaci izleta idu kroz shortcode.
 */

function hikeit_meta( int $id, string $kljuc ) {
	return get_post_meta( $id, $kljuc, true );
}

/** Postavke stranice: polja na stranici "Kontakt". */
function hikeit_postavka( string $kljuc ): string {
	$kontakt = get_page_by_path( 'kontakt' );
	return $kontakt ? (string) get_post_meta( $kontakt->ID, $kljuc, true ) : '';
}

/** "Oznaka | broj" po retku → [[oznaka, broj], …] */
function hikeit_telefoni(): array {
	$redovi = array_filter( array_map( 'trim', explode( "\n", hikeit_postavka( 'telefoni' ) ) ) );
	return array_map( function ( $r ) {
		$d = array_map( 'trim', explode( '|', $r, 2 ) );
		return count( $d ) === 2 ? $d : array( '', $d[0] );
	}, $redovi );
}

function hikeit_cijena( $c ): string {
	return number_format( (float) $c, floor( (float) $c ) == (float) $c ? 0 : 2, ',', '.' ) . ' €';
}

function hikeit_znacka_tezine( int $id ): string {
	$k = hikeit_meta( $id, 'tezina' );
	$t = hikeit_tezine();
	return isset( $t[ $k ] ) ? '<span class="hk-znacka hk-znacka--' . esc_attr( $k ) . '">' . esc_html( $t[ $k ] ) . '</span>' : '';
}

function hikeit_kartica_izleta( int $id ): string {
	$sl   = get_the_post_thumbnail( $id, 'large', array( 'loading' => 'lazy' ) );
	$cij  = hikeit_meta( $id, 'cijena' );
	$traj = (int) hikeit_meta( $id, 'trajanje_dana' );
	$max  = (int) hikeit_meta( $id, 'max_sudionika' );
	$lok  = hikeit_meta( $id, 'lokacija' );
	$o  = '<article class="hk-kartica"><a class="hk-kartica__slika" href="' . esc_url( get_permalink( $id ) ) . '">' . ( $sl ?: '<span class="hk-kartica__prazno"></span>' ) . '</a>';
	$o .= '<div class="hk-kartica__tijelo"><div class="hk-kartica__red">' . hikeit_znacka_tezine( $id );
	if ( $cij !== '' ) {
		$o .= '<strong class="hk-cijena">' . esc_html( hikeit_cijena( $cij ) ) . '</strong>';
	}
	$o .= '</div><h3><a href="' . esc_url( get_permalink( $id ) ) . '">' . esc_html( get_the_title( $id ) ) . '</a></h3>';
	$o .= '<p>' . esc_html( get_the_excerpt( $id ) ) . '</p><p class="hk-kartica__meta">';
	$meta = array_filter( array(
		$lok,
		$traj ? $traj . ( $traj === 1 ? ' dan' : ' dana' ) : '',
		$max ? 'do ' . $max . ' osoba' : '',
	) );
	$o .= esc_html( implode( ' · ', $meta ) ) . '</p></div></article>';
	return $o;
}

/** [hikeit_izleti istaknuti="1" limit="3" filter="1"] */
add_shortcode( 'hikeit_izleti', function ( $a ) {
	$a = shortcode_atts( array( 'istaknuti' => 0, 'limit' => 12, 'filter' => 0 ), $a );
	$q = sanitize_text_field( wp_unslash( $_GET['q'] ?? '' ) );
	$t = sanitize_key( $_GET['tezina'] ?? '' );
	$meta = array();
	if ( $a['istaknuti'] ) {
		$meta[] = array( 'key' => 'istaknut', 'value' => '1' );
	}
	if ( $a['filter'] && isset( hikeit_tezine()[ $t ] ) ) {
		$meta[] = array( 'key' => 'tezina', 'value' => $t );
	}
	$upit = new WP_Query( array(
		'post_type'      => 'izlet',
		'posts_per_page' => (int) $a['limit'],
		'paged'          => $a['filter'] ? max( 1, get_query_var( 'paged' ) ) : 1,
		's'              => $a['filter'] ? $q : '',
		'meta_query'     => $meta,
	) );
	$o = '';
	if ( $a['filter'] ) {
		$o .= '<form class="hk-filter" method="get"><input type="search" name="q" value="' . esc_attr( $q ) . '" placeholder="Pretražite izlete, lokacije…"><select name="tezina"><option value="">Sve težine</option>';
		foreach ( hikeit_tezine() as $k => $n ) {
			$o .= '<option value="' . esc_attr( $k ) . '"' . selected( $t, $k, false ) . '>' . esc_html( $n ) . '</option>';
		}
		$o .= '</select><button class="hk-gumb" type="submit">Traži</button></form>';
	}
	if ( ! $upit->have_posts() ) {
		return $o . '<p class="hk-prazno">' . ( $q || $t ? 'Nema rezultata za zadane uvjete.' : 'Uskoro objavljujemo nove izlete.' ) . '</p>';
	}
	$o .= '<div class="hk-mreza">';
	foreach ( $upit->posts as $p ) {
		$o .= hikeit_kartica_izleta( $p->ID );
	}
	$o .= '</div>';
	if ( $a['filter'] && $upit->max_num_pages > 1 ) {
		$o .= '<nav class="hk-stranicenje">' . paginate_links( array( 'total' => $upit->max_num_pages, 'current' => max( 1, get_query_var( 'paged' ) ) ) ) . '</nav>';
	}
	wp_reset_postdata();
	return $o;
} );

/** Podaci i poziv na rezervaciju na stranici izleta. */
add_shortcode( 'hikeit_izlet_podaci', function () {
	$id = get_the_ID();
	if ( ! $id ) {
		return '';
	}
	$redovi = array(
		'Trajanje'        => ( $n = (int) hikeit_meta( $id, 'trajanje_dana' ) ) ? $n . ( $n === 1 ? ' dan' : ' dana' ) : '',
		'Najviše osoba'   => hikeit_meta( $id, 'max_sudionika' ),
		'Lokacija'        => hikeit_meta( $id, 'lokacija' ),
		'Polazište'       => hikeit_meta( $id, 'polaziste' ),
		'Sljedeći polazak' => ( $d = hikeit_meta( $id, 'sljedeci_polazak' ) ) ? wp_date( 'j. n. Y.', strtotime( $d ) ) : '',
	);
	$cij = hikeit_meta( $id, 'cijena' );
	$o   = '<aside class="hk-podaci">';
	if ( $cij !== '' ) {
		$o .= '<div class="hk-podaci__cijena">' . esc_html( hikeit_cijena( $cij ) ) . '<small> po osobi</small></div>';
	}
	$o .= hikeit_znacka_tezine( $id ) . '<dl>';
	foreach ( array_filter( $redovi ) as $k => $v ) {
		$o .= '<dt>' . esc_html( $k ) . '</dt><dd>' . esc_html( $v ) . '</dd>';
	}
	$o .= '</dl><a class="hk-gumb" href="' . esc_url( home_url( '/kontakt/' ) ) . '">Pošaljite upit za rezervaciju</a>';
	if ( $vodic = (int) hikeit_meta( $id, 'vodic' ) ) {
		$o .= '<div class="hk-podaci__vodic"><strong>Vaš vodič</strong><br>' . esc_html( get_the_title( $vodic ) );
		if ( $s = hikeit_meta( $vodic, 'specijalizacija' ) ) {
			$o .= '<br><small>' . esc_html( $s ) . '</small>';
		}
		$o .= '</div>';
	}
	return $o . '</aside>';
} );

/** Tim na stranici "O nama". */
add_shortcode( 'hikeit_vodici', function () {
	$vodici = get_posts( array( 'post_type' => 'vodic', 'numberposts' => -1, 'orderby' => 'menu_order title', 'order' => 'ASC' ) );
	if ( ! $vodici ) {
		return '<p class="hk-prazno">Vodiči će uskoro biti predstavljeni.</p>';
	}
	$o = '<div class="hk-mreza hk-mreza--2">';
	foreach ( $vodici as $v ) {
		$o .= '<article class="hk-kartica hk-vodic"><div class="hk-kartica__slika">' . ( get_the_post_thumbnail( $v->ID, 'large', array( 'loading' => 'lazy' ) ) ?: '<span class="hk-kartica__prazno"></span>' ) . '</div>';
		$o .= '<div class="hk-kartica__tijelo"><h3>' . esc_html( $v->post_title ) . '</h3>';
		if ( $s = hikeit_meta( $v->ID, 'specijalizacija' ) ) {
			$o .= '<p class="hk-vodic__spec">' . esc_html( $s ) . '</p>';
		}
		$o .= wpautop( esc_html( wp_strip_all_tags( $v->post_content ) ) ) . '</div></article>';
	}
	return $o . '</div>';
} );

/** Popis galerija s numeriranim stranicama (/galerija/page/2/). */
add_shortcode( 'hikeit_galerije', function () {
	$str = max( 1, get_query_var( 'paged' ) );
	$q   = new WP_Query( array(
		'post_type'      => 'galerija',
		'posts_per_page' => 6,
		'paged'          => $str,
		'orderby'        => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
	) );
	if ( ! $q->have_posts() ) {
		return '<p class="hk-prazno">Galerije će uskoro biti objavljene.</p>';
	}
	$o = '<div class="hk-mreza">';
	foreach ( $q->posts as $g ) {
		$br = substr_count( $g->post_content, '<!-- wp:image' );
		$o .= '<article class="hk-kartica"><a class="hk-kartica__slika" href="' . esc_url( get_permalink( $g ) ) . '">' . ( get_the_post_thumbnail( $g->ID, 'large', array( 'loading' => 'lazy' ) ) ?: '<span class="hk-kartica__prazno"></span>' ) . '</a>';
		$o .= '<div class="hk-kartica__tijelo"><h3><a href="' . esc_url( get_permalink( $g ) ) . '">' . esc_html( $g->post_title ) . '</a></h3>';
		$o .= '<p class="hk-kartica__meta">' . ( $br ? esc_html( $br . ' fotografija' ) : '' ) . '</p></div></article>';
	}
	$o .= '</div>';
	if ( $q->max_num_pages > 1 ) {
		$o .= '<nav class="hk-stranicenje">' . paginate_links( array( 'total' => $q->max_num_pages, 'current' => $str ) ) . '</nav>';
	}
	wp_reset_postdata();
	return $o;
} );

add_shortcode( 'hikeit_galerija_uvod', fn() => wpautop( esc_html( hikeit_postavka( 'galerija_uvod' ) ) ) );

add_shortcode( 'hikeit_galerija_link', function () {
	$l = hikeit_meta( get_the_ID(), 'vanjski_link' );
	return $l ? '<p><a class="hk-gumb" href="' . esc_url( $l ) . '" target="_blank" rel="noopener">Pogledajte sve fotografije ↗</a></p>' : '';
} );

/** Kontakt podaci: stranica Kontakt. */
add_shortcode( 'hikeit_postavke', function () {
	$s = fn( $k ) => hikeit_postavka( $k );
	$o = '<div class="hk-kontakt">';
	if ( $e = ( HIKEIT_DEV && $s( 'email_razvoj' ) ? $s( 'email_razvoj' ) : $s( 'email' ) ) ) {
		$o .= '<p><small>E-mail</small><br><a href="mailto:' . esc_attr( $e ) . '">' . esc_html( $e ) . '</a></p>';
	}
	if ( $tel = hikeit_telefoni() ) {
		$o .= '<p><small>Telefon / WhatsApp</small>';
		foreach ( $tel as [ $oz, $br ] ) {
			$o .= '<br><a href="tel:' . esc_attr( preg_replace( '/[^+\d]/', '', $br ) ) . '">' . esc_html( $br ) . '</a>' . ( $oz ? ' <small>(' . esc_html( $oz ) . ')</small>' : '' );
		}
		$o .= '</p>';
	}
	$napomena = fn( $k ) => ! HIKEIT_DEV && $s( $k ) ? '<br><small>' . esc_html( $s( $k ) ) . '</small>' : '';
	if ( $l = $s( 'lokacija' ) ) {
		$o .= '<p><small>Lokacija</small><br>' . esc_html( $l ) . $napomena( 'lokacija_napomena' ) . '</p>';
	}
	if ( ! HIKEIT_DEV && $r = $s( 'radno_vrijeme' ) ) {
		$o .= '<p><small>Radno vrijeme</small><br>' . nl2br( esc_html( $r ) ) . $napomena( 'radno_vrijeme_napomena' ) . '</p>';
	}
	foreach ( array( 'instagram' => 'Instagram', 'facebook' => 'Facebook', 'linkedin' => 'LinkedIn' ) as $k => $n ) {
		if ( $u = $s( $k ) ) {
			$o .= '<a class="hk-mreza-link" href="' . esc_url( $u ) . '" target="_blank" rel="noopener">' . $n . '</a> ';
		}
	}
	return $o . '</div>';
} );

/** Podnožje: isti kontakt podaci na obje domene, različita navigacija. */
add_shortcode( 'hikeit_podnozje', function () {
	$veze = HIKEIT_DEV
		? array( '/usluge/' => 'Usluge', '/reference/' => 'Reference', '/o-meni/' => 'Tko smo', '/kontakt/' => 'Kontakt' )
		: array( '/izleti/' => 'Izleti', '/galerija/' => 'Galerija', '/blog/' => 'Blog', '/o-nama/' => 'O nama', '/kontakt/' => 'Kontakt' );
	$o = '<div class="hk-podnozje"><div><strong class="hk-podnozje__marka">' . ( HIKEIT_DEV ? 'hikeit.dev' : 'hikeIT.hr' ) . '</strong>';
	$o .= '<p>' . ( HIKEIT_DEV ? 'Web stranice i programska rješenja po mjeri.' : 'Planinski i turistički izleti po mjeri — sigurno, odgovorno i nezaboravno.' ) . '</p></div>';
	$o .= '<nav><strong>Navigacija</strong><ul>';
	foreach ( $veze as $u => $n ) {
		$o .= '<li><a href="' . esc_url( str_starts_with( $u, 'http' ) ? $u : home_url( $u ) ) . '">' . esc_html( $n ) . '</a></li>';
	}
	$o .= '</ul></nav><div><strong>Kontakt</strong>' . do_shortcode( '[hikeit_postavke]' ) . '</div></div>';
	$o .= '<p class="hk-podnozje__kraj">© ' . gmdate( 'Y' ) . ' hikeIT · Sva prava pridržana.</p>';
	return $o;
} );

/** Reference (hikeit.dev). Bez objavljenih referenci ne ispisuje ništa, ni naslov. */
add_shortcode( 'hikeit_reference', function ( $a ) {
	$a = shortcode_atts( array( 'limit' => 6, 'naslov' => 1, 'prazno' => '' ), $a );
	$r = get_posts( array( 'post_type' => 'referenca', 'numberposts' => (int) $a['limit'], 'orderby' => 'menu_order date', 'order' => 'ASC' ) );
	if ( ! $r ) {
		return $a['prazno'] ? '<p class="hk-prazno">' . esc_html( $a['prazno'] ) . '</p>' : '';
	}
	$o = ( $a['naslov'] ? '<div class="hk-sekcija-naslov"><p class="hk-oznaka">REFERENCE</p><h2>Što smo napravili</h2></div>' : '' ) . '<div class="hk-mreza">';
	foreach ( $r as $p ) {
		$url  = hikeit_meta( $p->ID, 'adresa' );
		$sl   = get_the_post_thumbnail( $p->ID, 'large', array( 'loading' => 'lazy' ) ) ?: '<span class="hk-kartica__prazno"></span>';
		$o   .= '<article class="hk-kartica hk-referenca">' . ( $url ? '<a class="hk-kartica__slika" href="' . esc_url( $url ) . '" target="_blank" rel="noopener">' . $sl . '</a>' : '<div class="hk-kartica__slika">' . $sl . '</div>' );
		$o   .= '<div class="hk-kartica__tijelo"><h3>' . esc_html( $p->post_title ) . '</h3><p>' . esc_html( $p->post_excerpt ) . '</p>';
		if ( $t = hikeit_meta( $p->ID, 'tehnologije' ) ) {
			$o .= '<p class="hk-kartica__meta">' . esc_html( $t ) . '</p>';
		}
		$o .= ( $url ? '<p><a href="' . esc_url( $url ) . '" target="_blank" rel="noopener">Pogledajte stranicu ↗</a></p>' : '' ) . '</div></article>';
	}
	return $o . '</div>';
} );

/** Kontakt forma ovisi o dijelu stranice (agencija / razvoj). */
add_shortcode( 'hikeit_kontakt_forma', fn() => do_shortcode( HIKEIT_DEV ? '[contact-form-7 title="Kontakt razvoj"]' : '[contact-form-7 title="Kontakt"]' ) );

/** Strukturirani podaci o osobi (Google) na stranici "Tko smo". */
add_action( 'wp_head', function () {
	if ( ! is_page( 'o-meni' ) ) {
		return;
	}
	$sameas = array_values( array_filter( array( hikeit_postavka( 'linkedin' ) ) ) );
	echo '<script type="application/ld+json">' . wp_json_encode( array(
		'@context' => 'https://schema.org',
		'@type'    => 'Person',
		'name'     => 'Tomislav Jurinec',
		'jobTitle' => 'Programer, izrada web stranica i aplikacija',
		'url'      => home_url( '/o-meni/' ),
		'sameAs'   => $sameas,
	), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . "</script>\n";
} );

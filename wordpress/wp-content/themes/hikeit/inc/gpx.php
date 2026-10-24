<?php
/**
 * Čitanje GPX traga: duljina, uspon, visinski profil i točke za kartu.
 *
 * Sve se računa jednom, pri spremanju izleta, i sprema u meta polja —
 * frontend nikad ne otvara GPX.
 */

/** Ispod ovoliko metara razlike GPS visina je šum, ne uspon. */
const HIKEIT_ASCENT_THRESHOLD_M = 6.0;

/** Koliko točaka ostaje nakon prorjeđivanja — dovoljno i za profil i za kartu. */
const HIKEIT_TRACK_POINTS = 300;

/**
 * Udaljenost dviju točaka po velikoj kružnici, u metrima.
 */
function hikeit_haversine( $lat1, $lon1, $lat2, $lon2 ) {
	$r    = 6371008.8; // srednji polumjer Zemlje (IUGG)
	$p1   = deg2rad( $lat1 );
	$p2   = deg2rad( $lat2 );
	$dp   = deg2rad( $lat2 - $lat1 );
	$dl   = deg2rad( $lon2 - $lon1 );
	$a    = sin( $dp / 2 ) ** 2 + cos( $p1 ) * cos( $p2 ) * sin( $dl / 2 ) ** 2;
	return 2 * $r * asin( min( 1.0, sqrt( $a ) ) );
}

/**
 * Izvuče trkpt-ove iz GPX-a, neovisno o inačici i prefiksu imenskog prostora.
 *
 * @return array|WP_Error Niz [lat, lon, ele] ili greška.
 */
function hikeit_gpx_points( $xml ) {
	if ( '' === trim( (string) $xml ) ) {
		return new WP_Error( 'gpx_prazan', 'GPX datoteka je prazna.' );
	}

	$prev = libxml_use_internal_errors( true );
	$doc  = new DOMDocument();
	$ok   = $doc->loadXML( $xml, LIBXML_NONET | LIBXML_NOENT );
	libxml_clear_errors();
	libxml_use_internal_errors( $prev );

	if ( ! $ok ) {
		return new WP_Error( 'gpx_neispravan', 'Datoteku nije moguće pročitati kao GPX.' );
	}

	// '*' hvata i GPX 1.0 i 1.1, bez obzira na prefiks.
	$nodes = $doc->getElementsByTagNameNS( '*', 'trkpt' );
	if ( 0 === $nodes->length ) {
		$nodes = $doc->getElementsByTagNameNS( '*', 'rtept' ); // planirana ruta umjesto snimljenog traga
	}

	$points = array();
	foreach ( $nodes as $node ) {
		$lat = $node->getAttribute( 'lat' );
		$lon = $node->getAttribute( 'lon' );
		if ( '' === $lat || '' === $lon ) {
			continue;
		}

		$ele  = null;
		$eles = $node->getElementsByTagNameNS( '*', 'ele' );
		if ( $eles->length > 0 ) {
			$ele = (float) $eles->item( 0 )->textContent;
		}

		$points[] = array( (float) $lat, (float) $lon, $ele );
	}

	if ( count( $points ) < 2 ) {
		return new WP_Error( 'gpx_bez_tocaka', 'GPX ne sadrži trag s najmanje dvije točke.' );
	}

	return $points;
}

/**
 * Popuni rupe u visinama linearnom interpolacijom između poznatih vrijednosti.
 * Trag bez ijedne visine ostaje bez profila, ali karta i duljina i dalje rade.
 */
function hikeit_fill_elevations( array $points ) {
	$known = array();
	foreach ( $points as $i => $p ) {
		if ( null !== $p[2] ) {
			$known[] = $i;
		}
	}
	if ( ! $known ) {
		return array( $points, false );
	}

	// Rubovi: produži prvu i zadnju poznatu vrijednost.
	// $n se uzima prije petlji — s count() u uvjetu, upis u nepostojeći
	// indeks bi produljio niz brže nego što brojač napreduje.
	$n     = count( $points );
	$first = $known[0];
	$last  = $known[ count( $known ) - 1 ];

	for ( $i = 0; $i < $first; $i++ ) {
		$points[ $i ][2] = $points[ $first ][2];
	}
	for ( $i = $last + 1; $i < $n; $i++ ) {
		$points[ $i ][2] = $points[ $last ][2];
	}

	// sredina
	$kn = count( $known );
	for ( $k = 0; $k < $kn - 1; $k++ ) {
		$a = $known[ $k ];
		$b = $known[ $k + 1 ];
		if ( $b - $a < 2 ) {
			continue;
		}
		$ea = $points[ $a ][2];
		$eb = $points[ $b ][2];
		for ( $i = $a + 1; $i < $b; $i++ ) {
			$points[ $i ][2] = $ea + ( $eb - $ea ) * ( $i - $a ) / ( $b - $a );
		}
	}

	return array( $points, true );
}

/**
 * Prorijedi trag na ~$target točaka, jednako raspoređenih po PRIJEĐENOM PUTU,
 * a ne po rednom broju točke — inače dijelovi gdje se stajalo pojedu profil.
 */
function hikeit_resample( array $points, array $cum, $target ) {
	$total = end( $cum );

	// Kratak trag se ne prorjeđuje, ali i on mora nositi prijeđeni put
	// kao četvrti član — dalje se na njega računa.
	if ( $total <= 0 || count( $points ) <= $target ) {
		$out = array();
		foreach ( $points as $i => $p ) {
			$out[] = array( $p[0], $p[1], $p[2], $cum[ $i ] );
		}
		return $out;
	}

	$out  = array();
	$step = $total / ( $target - 1 );
	$j    = 0;
	$last = count( $cum ) - 2;

	for ( $k = 0; $k < $target; $k++ ) {
		$d = min( $k * $step, $total );
		while ( $j < $last && $cum[ $j + 1 ] < $d ) {
			$j++;
		}
		$span = $cum[ $j + 1 ] - $cum[ $j ];
		$t    = $span > 0 ? ( $d - $cum[ $j ] ) / $span : 0.0;

		$a     = $points[ $j ];
		$b     = $points[ $j + 1 ];
		$out[] = array(
			$a[0] + ( $b[0] - $a[0] ) * $t,
			$a[1] + ( $b[1] - $a[1] ) * $t,
			null === $a[2] ? null : $a[2] + ( $b[2] - $a[2] ) * $t,
			$d,
		);
	}

	return $out;
}

/**
 * Pročita GPX i vrati sve što stranica treba.
 *
 * @param string $xml Sadržaj GPX datoteke.
 * @return array|WP_Error
 */
function hikeit_parse_gpx( $xml ) {
	$points = hikeit_gpx_points( $xml );
	if ( is_wp_error( $points ) ) {
		return $points;
	}

	list( $points, $has_ele ) = hikeit_fill_elevations( $points );

	// kumulativna udaljenost
	$cum = array( 0.0 );
	$n   = count( $points );
	for ( $i = 1; $i < $n; $i++ ) {
		$cum[ $i ] = $cum[ $i - 1 ] + hikeit_haversine(
			$points[ $i - 1 ][0],
			$points[ $i - 1 ][1],
			$points[ $i ][0],
			$points[ $i ][1]
		);
	}

	// Uspon s pragom: zbrajamo tek kad se od zadnje potvrđene visine
	// odmaknemo više nego što GPS zna pogriješiti. Bez toga barometarski
	// šum napuše uspon i za dvostruko.
	$ascent  = 0.0;
	$descent = 0.0;
	if ( $has_ele ) {
		$anchor = $points[0][2];
		foreach ( $points as $p ) {
			$diff = $p[2] - $anchor;
			if ( $diff >= HIKEIT_ASCENT_THRESHOLD_M ) {
				$ascent += $diff;
				$anchor  = $p[2];
			} elseif ( $diff <= -HIKEIT_ASCENT_THRESHOLD_M ) {
				$descent += -$diff;
				$anchor   = $p[2];
			}
		}
	}

	$lats = array_column( $points, 0 );
	$lons = array_column( $points, 1 );
	$eles = $has_ele ? array_column( $points, 2 ) : array();

	$track = hikeit_resample( $points, $cum, HIKEIT_TRACK_POINTS );

	return array(
		// trag za kartu i profil: [lat, lon, visina, prijeđeno u metrima]
		'track'       => array_map(
			function ( $p ) {
				return array(
					round( $p[0], 5 ),
					round( $p[1], 5 ),
					null === $p[2] ? null : round( $p[2] ),
					round( $p[3] ),
				);
			},
			$track
		),
		'distance_m'  => (int) round( end( $cum ) ),
		'ascent_m'    => (int) round( $ascent ),
		'descent_m'   => (int) round( $descent ),
		'ele_min'     => $has_ele ? (int) round( min( $eles ) ) : null,
		'ele_max'     => $has_ele ? (int) round( max( $eles ) ) : null,
		'has_ele'     => $has_ele,
		'bounds'      => array(
			array( round( min( $lats ), 5 ), round( min( $lons ), 5 ) ),
			array( round( max( $lats ), 5 ), round( max( $lons ), 5 ) ),
		),
		'point_count' => count( $points ),
	);
}

/** WP odbija GPX jer mu sadržaj izgleda kao običan XML — vratimo ispravan tip. */
add_filter( 'wp_check_filetype_and_ext', function ( $data, $file, $filename ) {
	if ( 'gpx' === strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) ) ) {
		$data['ext']  = 'gpx';
		$data['type'] = 'application/gpx+xml';
	}
	return $data;
}, 10, 3 );

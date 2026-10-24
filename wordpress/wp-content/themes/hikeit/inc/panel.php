<?php
/**
 * Prijava (/prijava/, s 2FA) i upravljanje agencijom (/upravljanje/) unutar teme,
 * bez wp-admina: izleti, galerije, vodiči, upiti i kontakt podaci.
 * Dostupno samo na domeni agencije (hikeit.dev preusmjerava).
 */

add_action( 'init', function () {
	add_rewrite_rule( '^(prijava|upravljanje)(?:/(.*?))?/?$', 'index.php?hk_panel=$matches[1]&hk_dio=$matches[2]', 'top' );
	if ( get_option( 'hk_pravila' ) !== '1' ) {
		flush_rewrite_rules( false );
		update_option( 'hk_pravila', '1' );
	}
} );
add_filter( 'query_vars', fn( $v ) => array_merge( $v, array( 'hk_panel', 'hk_dio' ) ) );

// Prijava je samo na /prijava/ (2FA): wp-login.php ne prima prijave, xmlrpc i lozinke aplikacija su ugašeni.
add_filter( 'login_url', fn() => home_url( '/prijava/' ) );
add_action( 'login_init', function () {
	if ( in_array( $_REQUEST['action'] ?? 'login', array( 'login', '' ), true ) ) {
		wp_safe_redirect( home_url( '/prijava/' ) );
		exit;
	}
} );
add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'wp_is_application_passwords_available', '__return_false' );
add_filter( 'show_admin_bar', fn( $s ) => $s && current_user_can( 'manage_options' ) );

add_action( 'template_redirect', function () {
	$panel = get_query_var( 'hk_panel' );
	if ( ! $panel ) {
		return;
	}
	if ( HIKEIT_DEV ) {
		wp_redirect( HIKEIT_SHEMA . '://' . HIKEIT_HOST_AGENCIJA . $_SERVER['REQUEST_URI'], 301 );
		exit;
	}
	nocache_headers();
	header( 'X-Robots-Tag: noindex, nofollow' );
	header( 'X-Frame-Options: DENY' );
	header( 'Referrer-Policy: same-origin' );
	$panel === 'prijava' ? hk_prijava() : hk_upravljanje( trim( (string) get_query_var( 'hk_dio' ), '/' ) );
	exit;
}, 0 );

/* ---------------------------------------------------------------- okvir stranice */

function hk_html( string $naslov, string $tijelo, bool $izbornik = false ): void {
	$e   = 'esc_html';
	$url = fn( $d = '' ) => esc_url( home_url( "/upravljanje/$d" ) );
	$nova = $izbornik ? hk_neprocitano() : 0;
	$stavke = array(
		'' => 'Pregled', 'izleti/' => 'Izleti', 'galerije/' => 'Galerije', 'vodici/' => 'Vodiči',
		'upiti/' => 'Upiti' . ( $nova ? " ($nova)" : '' ), 'kontakt/' => 'Kontakt podaci',
	);
	$trenutno = trim( (string) get_query_var( 'hk_dio' ), '/' );
	echo '<!doctype html><html lang="hr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">';
	echo '<title>' . $e( $naslov ) . ' — hikeIT upravljanje</title><link rel="icon" href="' . esc_url( get_theme_file_uri( 'assets/favicon.svg' ) ) . '">';
	echo '<script>try{var m=localStorage.getItem("hikeit-nacin");document.documentElement.dataset.mode=m||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}</script>';
	echo '<style>' . hk_css() . '</style></head><body>';
	if ( $izbornik ) {
		echo '<header class="vrh"><a class="logo" href="' . $url() . '">hikeIT <small>upravljanje</small></a><nav>';
		foreach ( $stavke as $d => $o ) {
			$akt = explode( '/', rtrim( $d, '/' ) )[0] === explode( '/', $trenutno )[0];
			echo '<a href="' . $url( $d ) . '"' . ( $akt ? ' class="akt"' : '' ) . '>' . $e( $o ) . '</a>';
		}
		echo '</nav><span class="desno"><a href="' . esc_url( home_url( '/' ) ) . '" target="_blank" rel="noopener">Stranica ↗</a> '
			. '<a href="' . esc_url( wp_nonce_url( home_url( '/upravljanje/odjava/' ), 'hk_odjava' ) ) . '">Odjava</a> '
			. '<button type="button" id="nacin" aria-label="Tamni način">◐</button></span></header>';
	} else {
		echo '<button type="button" id="nacin" class="kut" aria-label="Tamni način">◐</button>';
	}
	echo '<main>' . $tijelo . '</main>';
	echo '<script>document.getElementById("nacin").onclick=function(){var d=document.documentElement.dataset;d.mode=d.mode==="dark"?"light":"dark";try{localStorage.setItem("hikeit-nacin",d.mode)}catch(e){}};'
		. 'document.querySelectorAll("[data-s]").forEach(function(b){b.onclick=function(){var l=b.closest("li"),s=+b.dataset.s;if(s<0&&l.previousElementSibling)l.parentNode.insertBefore(l,l.previousElementSibling);if(s>0&&l.nextElementSibling)l.parentNode.insertBefore(l.nextElementSibling,l)}});'
		. 'document.querySelectorAll("form[data-potvrda]").forEach(function(f){f.onsubmit=function(){return confirm(f.dataset.potvrda)}});</script>';
	echo '</body></html>';
}

function hk_css(): string {
	$f = get_theme_file_uri( 'assets/fonts/inter-latin.woff2' );
	return '@font-face{font-family:Inter;src:url(' . esc_url( $f ) . ') format("woff2");font-weight:100 900;font-display:swap}'
	. ':root{--b:#fff;--b2:#f1eded;--t:#1a1718;--t2:#6b6263;--a:#cc2a1e;--p:#fafafa;color-scheme:light}'
	. 'html[data-mode=dark]{--b:#121011;--b2:#2c2827;--t:#efebea;--t2:#a09897;--a:#f05648;--p:#1a1718;color-scheme:dark}'
	. '*{box-sizing:border-box}body{margin:0;font:16px/1.5 Inter,system-ui,sans-serif;background:var(--b);color:var(--t)}'
	. 'a{color:var(--a)}h1{font-size:1.6rem;margin:0 0 1rem}h2{font-size:1.15rem;margin:1.5rem 0 .5rem}'
	. 'main{max-width:62rem;margin:0 auto;padding:1.5rem 1rem 4rem}'
	. '.vrh{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;align-items:center;padding:.75rem 1rem;border-bottom:1px solid var(--b2);position:sticky;top:0;background:var(--b);z-index:5}'
	. '.vrh nav{display:flex;flex-wrap:wrap;gap:.25rem}.vrh nav a,.desno a{padding:.35rem .7rem;border-radius:999px;text-decoration:none;color:var(--t)}'
	. '.vrh nav a.akt{background:var(--a);color:#fff}.vrh nav a:hover{background:var(--b2)}.vrh nav a.akt:hover{background:var(--a)}.desno{margin-left:auto}'
	. '.logo{font-weight:800;text-decoration:none;color:var(--a)!important}.logo small{color:var(--t2);font-weight:500}'
	. 'button,.gumb{font:inherit;cursor:pointer;border:2px solid var(--a);background:var(--a);color:#fff;border-radius:999px;padding:.55rem 1.3rem;font-weight:600;text-decoration:none;display:inline-block}'
	. 'button.sek,.gumb.sek{background:transparent;color:var(--a)}button.opas{background:transparent;color:var(--a);border-color:var(--a)}'
	. '#nacin{background:transparent;color:var(--t);border:0;padding:.3rem .6rem;font-size:1.1rem}.kut{position:fixed;top:.75rem;right:.75rem}'
	. 'table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:.6rem .5rem;border-bottom:1px solid var(--b2);vertical-align:middle}th{color:var(--t2);font-size:.8rem;text-transform:uppercase;letter-spacing:.05em}'
	. 'td.ak{text-align:right;white-space:nowrap}td.ak form{display:inline}td.ak button{padding:.25rem .8rem;font-size:.85rem}'
	. 'label{display:block;font-weight:600;margin:1rem 0 .3rem}input[type=text],input[type=number],input[type=date],input[type=password],input[type=url],input[type=email],select,textarea{width:100%;font:inherit;padding:.6rem .75rem;border:1px solid var(--b2);border-radius:.6rem;background:var(--p);color:var(--t)}'
	. 'textarea{min-height:9rem}input:focus,select:focus,textarea:focus{outline:2px solid var(--a);outline-offset:1px}'
	. '.dva{display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:0 1rem}.cb{display:flex;gap:.5rem;align-items:center;font-weight:600;margin-top:1.8rem}.cb input{width:auto}'
	. '.ok{background:#d1fae5;color:#065f46;padding:.7rem 1rem;border-radius:.6rem;margin-bottom:1rem}.gr{background:#fee2e2;color:#991b1b;padding:.7rem 1rem;border-radius:.6rem;margin-bottom:1rem}'
	. '.kartice{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:1rem;margin-bottom:1.5rem}.kartice a{display:block;padding:1.1rem;border:1px solid var(--b2);border-radius:1rem;background:var(--p);text-decoration:none;color:var(--t)}.kartice b{display:block;font-size:2rem;color:var(--a)}'
	. '.slike{list-style:none;padding:0;margin:0;display:grid;gap:.6rem}.slike li{display:grid;grid-template-columns:5rem 1fr auto auto;gap:.6rem;align-items:center;padding:.5rem;border:1px solid var(--b2);border-radius:.6rem}.slike img{width:5rem;height:4rem;object-fit:cover;border-radius:.4rem}.slike label{margin:0;font-weight:500;white-space:nowrap}.slike button{padding:.1rem .6rem}'
	. '.neproc td{font-weight:700}.mala{color:var(--t2);font-size:.85rem}.kutija{max-width:26rem;margin:10vh auto 0;padding:1.5rem;border:1px solid var(--b2);border-radius:1rem;background:var(--p)}'
	. '.kodovi{font:1.1rem ui-monospace,monospace;columns:2;background:var(--b2);padding:1rem;border-radius:.6rem;list-style:none}.tajna{font:1rem ui-monospace,monospace;word-break:break-all;background:var(--b2);padding:.5rem;border-radius:.4rem}#qr{display:flex;justify-content:center;margin:1rem 0;background:#fff;padding:.75rem;border-radius:.6rem}'
	. 'dl{display:grid;grid-template-columns:9rem 1fr;gap:.4rem 1rem}dt{color:var(--t2)}dd{margin:0;white-space:pre-wrap;word-break:break-word}'
	. '@media(max-width:600px){.slike li{grid-template-columns:4rem 1fr}.desno{margin-left:0}.izl th:nth-child(n+3):not(:last-child),.izl td:nth-child(n+3):not(.ak){display:none}.izl td.ak a:not(:last-child){display:none}}';
}

/* ---------------------------------------------------------------- prijava + 2FA */

function hk_ip_kljuc(): string {
	return 'hk_pokusaji_' . md5( $_SERVER['REMOTE_ADDR'] ?? '' );
}

function hk_prijava(): void {
	if ( is_user_logged_in() && current_user_can( 'publish_pages' ) && get_user_meta( get_current_user_id(), 'hk_totp_tajna', true ) ) {
		wp_safe_redirect( home_url( '/upravljanje/' ) );
		exit;
	}
	$greska = '';
	$zeton  = '';
	$stanje = null;
	$kodovi = null;

	if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {
		$zeton = sanitize_text_field( wp_unslash( $_POST['zeton'] ?? '' ) );
		if ( ! wp_verify_nonce( $_POST['_n'] ?? '', 'hk_prijava' ) ) {
			$greska = 'Obrazac je istekao, pokušajte ponovno.';
			$zeton  = '';
		} elseif ( (int) get_transient( hk_ip_kljuc() ) >= 8 ) {
			$greska = 'Previše neuspjelih pokušaja. Pričekajte 15 minuta.';
			$zeton  = '';
		} elseif ( $zeton === '' ) {
			// 1. korak: korisničko ime i lozinka
			$u = wp_authenticate( sanitize_user( wp_unslash( $_POST['korisnik'] ?? '' ) ), wp_unslash( $_POST['lozinka'] ?? '' ) );
			if ( is_wp_error( $u ) || ! user_can( $u, 'publish_pages' ) ) {
				set_transient( hk_ip_kljuc(), (int) get_transient( hk_ip_kljuc() ) + 1, 900 );
				$greska = 'Pogrešno korisničko ime ili lozinka.';
			} else {
				$zeton  = bin2hex( random_bytes( 16 ) );
				$stanje = array( 'uid' => $u->ID, 'zapamti' => ! empty( $_POST['zapamti'] ), 'pokusaji' => 0 );
				if ( ! get_user_meta( $u->ID, 'hk_totp_tajna', true ) ) {
					$stanje['nova'] = hk_nova_tajna();
				}
				set_transient( "hk_2fa_$zeton", $stanje, 600 );
			}
		} else {
			// 2. korak: kod iz aplikacije (ili prvi put: potvrda postavljanja)
			$stanje = get_transient( "hk_2fa_$zeton" );
			$kod    = wp_unslash( $_POST['kod'] ?? '' );
			if ( ! $stanje ) {
				$greska = 'Prijava je istekla, počnite ispočetka.';
				$zeton  = '';
			} else {
				$uid = (int) $stanje['uid'];
				if ( isset( $stanje['nova'] ) ) {
					$korak = hk_totp_provjeri( $stanje['nova'], $kod );
					$ok    = (bool) $korak;
					if ( $ok ) {
						update_user_meta( $uid, 'hk_totp_tajna', $stanje['nova'] );
						update_user_meta( $uid, 'hk_totp_zadnji', $korak );
						$kodovi = hk_rezervni_kodovi( $uid );
					}
				} else {
					$ok = hk_provjeri_drugi_faktor( $uid, $kod );
				}
				if ( $ok ) {
					delete_transient( "hk_2fa_$zeton" );
					wp_set_auth_cookie( $uid, $stanje['zapamti'] );
					wp_set_current_user( $uid );
					do_action( 'wp_login', get_userdata( $uid )->user_login, get_userdata( $uid ) );
					if ( ! $kodovi ) {
						wp_safe_redirect( home_url( '/upravljanje/' ) );
						exit;
					}
				} else {
					$greska = 'Neispravan kod.';
					set_transient( hk_ip_kljuc(), (int) get_transient( hk_ip_kljuc() ) + 1, 900 );
					if ( ++$stanje['pokusaji'] >= 5 ) {
						delete_transient( "hk_2fa_$zeton" );
						$greska = 'Previše pokušaja, prijavite se ponovno.';
						$zeton  = '';
					} else {
						set_transient( "hk_2fa_$zeton", $stanje, 600 );
					}
				}
			}
		}
	}

	$e = 'esc_html';
	$o = '<div class="kutija"><h1>hikeIT upravljanje</h1>' . ( $greska ? '<div class="gr">' . $e( $greska ) . '</div>' : '' );
	if ( $kodovi ) {
		$o .= '<p>2FA je uključen. Spremite <strong>rezervne kodove</strong> na sigurno mjesto — svaki vrijedi jednom, a trebaju vam ako izgubite mobitel. Ovo ih je jedini put prikazano.</p><ul class="kodovi">';
		foreach ( $kodovi as $k ) {
			$o .= '<li>' . $e( $k ) . '</li>';
		}
		$o .= '</ul><p><a class="gumb" href="' . esc_url( home_url( '/upravljanje/' ) ) . '">Nastavi →</a></p>';
	} elseif ( $zeton && ( $stanje = get_transient( "hk_2fa_$zeton" ) ) ) {
		$o .= '<form method="post" autocomplete="off">' . wp_nonce_field( 'hk_prijava', '_n', true, false ) . '<input type="hidden" name="zeton" value="' . esc_attr( $zeton ) . '">';
		if ( isset( $stanje['nova'] ) ) {
			$u    = get_userdata( (int) $stanje['uid'] );
			$uri  = 'otpauth://totp/' . rawurlencode( 'hikeIT:' . $u->user_login ) . '?secret=' . $stanje['nova'] . '&issuer=hikeIT';
			$o   .= '<p>Dvofaktorska prijava je obavezna. Skenirajte kod u aplikaciji (Google Authenticator, Authy, Microsoft Authenticator…), a zatim upišite 6-znamenkasti kod.</p><div id="qr"></div>'
				. '<p class="mala">Ili ručno upišite tajnu:</p><div class="tajna">' . $e( implode( ' ', str_split( $stanje['nova'], 4 ) ) ) . '</div>'
				. '<script src="' . esc_url( get_theme_file_uri( 'assets/qrcode.min.js' ) ) . '"></script><script>new QRCode(document.getElementById("qr"),{text:' . wp_json_encode( $uri ) . ',width:200,height:200})</script>';
		} else {
			$o .= '<p>Upišite 6-znamenkasti kod iz aplikacije za provjeru (ili rezervni kod).</p>';
		}
		$o .= '<label for="kod">Kod</label><input id="kod" name="kod" type="text" inputmode="numeric" autocomplete="one-time-code" autofocus required>'
			. '<p><button>Potvrdi</button></p></form>';
	} else {
		$o .= '<form method="post">' . wp_nonce_field( 'hk_prijava', '_n', true, false )
			. '<label for="k">Korisničko ime</label><input id="k" name="korisnik" type="text" autocomplete="username" required autofocus>'
			. '<label for="l">Lozinka</label><input id="l" name="lozinka" type="password" autocomplete="current-password" required>'
			. '<label class="cb" style="margin-top:1rem"><input type="checkbox" name="zapamti" value="1"> Zapamti me</label>'
			. '<p><button>Dalje</button></p></form>';
	}
	hk_html( 'Prijava', $o . '</div>' );
}

/* ---------------------------------------------------------------- upravljanje */

function hk_tipovi(): array {
	return array(
		'izleti'   => array( 'cpt' => 'izlet', 'n' => 'Izleti', 'novi' => 'Novi izlet', 'slike' => true, 'gpx' => true, 'sazetak' => true, 'oznake' => true, 'polja' => array(
			array( 'tezina', 'Težina', 'select', hikeit_tezine() ),
			array( 'trajanje_dana', 'Trajanje (dana)', 'number' ),
			array( 'max_sudionika', 'Najviše sudionika', 'number' ),
			array( 'cijena', 'Cijena po osobi (€)', 'number' ),
			array( 'lokacija', 'Lokacija', 'text' ),
			array( 'polaziste', 'Polazište', 'text' ),
			array( 'sljedeci_polazak', 'Sljedeći polazak', 'date' ),
			array( 'vodic', 'Vodič', 'vodic' ),
			array( 'istaknut', 'Istaknut na naslovnici', 'check' ),
		) ),
		'galerije' => array( 'cpt' => 'galerija', 'n' => 'Galerije', 'novi' => 'Nova galerija', 'slike' => true, 'polja' => array(
			array( 'vanjski_link', 'Vanjski link (npr. album na drugoj stranici)', 'url' ),
		) ),
		'vodici'   => array( 'cpt' => 'vodic', 'n' => 'Vodiči', 'novi' => 'Novi vodič', 'slike' => false, 'polja' => array(
			array( 'specijalizacija', 'Specijalizacija', 'text' ),
			array( 'kvalifikacije', 'Standardi i tečajevi (jedan po retku)', 'textarea' ),
		) ),
	);
}

function hk_neprocitano(): int {
	if ( ! post_type_exists( 'flamingo_inbound' ) ) {
		return 0;
	}
	return count( get_posts( array( 'post_type' => 'flamingo_inbound', 'numberposts' => -1, 'fields' => 'ids', 'meta_query' => array( array( 'key' => '_hk_procitano', 'compare' => 'NOT EXISTS' ) ) ) ) );
}

function hk_provjeri_nonce(): void {
	if ( ! wp_verify_nonce( $_POST['_n'] ?? '', 'hk_panel' ) ) {
		wp_die( 'Obrazac je istekao. Vratite se i pokušajte ponovno.', '', 403 );
	}
}

function hk_upravljanje( string $dio ): void {
	$uid = get_current_user_id();
	if ( ! $uid || ! current_user_can( 'publish_pages' ) || ! get_user_meta( $uid, 'hk_totp_tajna', true ) ) {
		wp_logout(); // sesija bez 2FA (npr. stara prijava preko wp-admina) ne vrijedi
		wp_safe_redirect( home_url( '/prijava/' ) );
		exit;
	}
	$d    = explode( '/', $dio );
	$tipo = hk_tipovi();

	if ( 'odjava' === $d[0] ) {
		if ( wp_verify_nonce( $_GET['_wpnonce'] ?? '', 'hk_odjava' ) ) {
			wp_logout();
		}
		wp_safe_redirect( home_url( '/prijava/' ) );
		exit;
	}
	if ( '' === $d[0] ) {
		hk_pregled();
	} elseif ( isset( $tipo[ $d[0] ] ) ) {
		hk_sadrzaj( $d[0], $tipo[ $d[0] ], $d[1] ?? '' );
	} elseif ( 'upiti' === $d[0] ) {
		hk_upiti( (int) ( $d[1] ?? 0 ) );
	} elseif ( 'kontakt' === $d[0] ) {
		hk_kontakt();
	} else {
		status_header( 404 );
		hk_html( 'Nije pronađeno', '<h1>Stranica ne postoji</h1><p><a href="' . esc_url( home_url( '/upravljanje/' ) ) . '">Natrag na pregled</a></p>', true );
	}
	exit;
}

function hk_pregled(): void {
	$u = fn( $d ) => esc_url( home_url( "/upravljanje/$d" ) );
	$br = fn( $t ) => (int) wp_count_posts( $t )->publish;
	$o = '<h1>Pregled</h1><div class="kartice">'
		. '<a href="' . $u( 'izleti/' ) . '"><b>' . $br( 'izlet' ) . '</b>izleta</a>'
		. '<a href="' . $u( 'galerije/' ) . '"><b>' . $br( 'galerija' ) . '</b>galerija</a>'
		. '<a href="' . $u( 'upiti/' ) . '"><b>' . hk_neprocitano() . '</b>novih upita</a></div>'
		. '<p><a class="gumb" href="' . $u( 'izleti/novi' ) . '">+ Novi izlet</a> <a class="gumb sek" href="' . $u( 'galerije/novi' ) . '">+ Nova galerija</a></p>'
		. '<h2>Zadnji upiti</h2>' . hk_tablica_upita( 5 );
	hk_html( 'Pregled', $o, true );
}

/** Sadržaj tipova: popis, novi/uredi, spremi, obriši. */
function hk_sadrzaj( string $kljuc, array $c, string $dio ): void {
	$baza = home_url( "/upravljanje/$kljuc/" );
	if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {
		hk_provjeri_nonce();
		$id = (int) ( $_POST['id'] ?? 0 );
		if ( $id && get_post_type( $id ) !== $c['cpt'] ) {
			wp_die( 'Neispravan zapis.', '', 400 );
		}
		if ( 'obrisi' === ( $_POST['akcija'] ?? '' ) && $id ) {
			wp_trash_post( $id );
			wp_safe_redirect( add_query_arg( 'obrisano', 1, $baza ) );
			exit;
		}
		$r = hk_spremi( $c, $id );
		if ( is_wp_error( $r ) ) {
			hk_forma( $kljuc, $c, $id, $r->get_error_message() );
			exit;
		}
		wp_safe_redirect( add_query_arg( array( 'spremljeno' => 1, 'gpx_greska' => empty( $GLOBALS['hk_gpx_greska'] ) ? null : rawurlencode( $GLOBALS['hk_gpx_greska'] ) ), $baza . $r . '/' ) );
		exit;
	}
	if ( 'novi' === $dio || ( ctype_digit( $dio ) && get_post_type( (int) $dio ) === $c['cpt'] ) ) {
		hk_forma( $kljuc, $c, (int) $dio );
		return;
	}
	$o = '<p style="float:right"><a class="gumb" href="' . esc_url( $baza . 'novi' ) . '">+ ' . esc_html( $c['novi'] ) . '</a></p><h1>' . esc_html( $c['n'] ) . '</h1>'
		. ( isset( $_GET['obrisano'] ) ? '<div class="ok">Obrisano (u smeću).</div>' : '' );
	$q = get_posts( array( 'post_type' => $c['cpt'], 'post_status' => array( 'publish', 'draft' ), 'numberposts' => -1, 'orderby' => array( 'menu_order' => 'ASC', 'date' => 'DESC' ) ) );
	$o .= '<table class="izl"><tr><th>Naslov</th><th>Status</th>' . ( 'izleti' === $kljuc ? '<th>Cijena</th><th>Polazak</th><th>Slobodno</th>' : '' ) . '<th></th></tr>';
	foreach ( $q as $p ) {
		$o .= '<tr><td><a href="' . esc_url( $baza . $p->ID . '/' ) . '">' . esc_html( $p->post_title ) . '</a></td><td>' . ( 'publish' === $p->post_status ? 'Objavljeno' : 'Skica' ) . '</td>';
		if ( 'izleti' === $kljuc ) {
			$ci = get_post_meta( $p->ID, 'cijena', true );
			$po = get_post_meta( $p->ID, 'sljedeci_polazak', true );
			$o .= '<td>' . ( '' !== $ci ? esc_html( hikeit_cijena( $ci ) ) : '—' ) . '</td><td>' . ( $po ? esc_html( date_i18n( 'j. n. Y.', strtotime( $po ) ) ) : '—' ) . '</td><td>' . ( null === ( $sl = hk_slobodna_mjesta( $p->ID ) ) ? '—' : $sl ) . '</td>';
		}
		$o .= '<td class="ak">' . ( 'publish' === $p->post_status && is_post_type_viewable( $c['cpt'] ) ? '<a href="' . esc_url( get_permalink( $p ) ) . '" target="_blank" rel="noopener">Pogledaj ↗</a> ' : '' )
			. '<a href="' . esc_url( $baza . $p->ID . '/' ) . '">Uredi</a></td></tr>';
	}
	$o .= $q ? '</table>' : '</table><p class="mala">Još ništa nije dodano.</p>';
	hk_html( $c['n'], $o, true );
}

function hk_odlomci_blokovi( string $tekst ): string {
	$o = '';
	foreach ( preg_split( '/\n\s*\n/', trim( str_replace( "\r", '', $tekst ) ) ) as $odl ) {
		if ( trim( $odl ) !== '' ) {
			$o .= "<!-- wp:paragraph -->\n<p>" . nl2br( esc_html( trim( $odl ) ) ) . "</p>\n<!-- /wp:paragraph -->\n\n";
		}
	}
	return $o;
}

function hk_galerija_blok( array $slike, string $klasa = '' ): string {
	if ( ! $slike ) {
		return '';
	}
	$o = '<!-- wp:gallery ' . wp_json_encode( array( 'linkTo' => 'none' ) + ( $klasa ? array( 'className' => $klasa ) : array() ) ) . " -->\n<figure class=\"wp-block-gallery has-nested-images columns-default is-cropped" . ( $klasa ? " $klasa" : '' ) . '">';
	foreach ( $slike as $s ) {
		[ $id, $natpis ] = $s;
		$o .= "<!-- wp:image {\"id\":$id,\"sizeSlug\":\"large\",\"linkDestination\":\"none\"} -->\n<figure class=\"wp-block-image size-large\"><img src=\"" . esc_url( wp_get_attachment_url( $id ) ) . "\" alt=\"" . esc_attr( $s[2] ?? '' ) . "\" class=\"wp-image-$id\"/>"
			. ( $natpis ? '<figcaption class="wp-element-caption">' . esc_html( $natpis ) . '</figcaption>' : '' ) . "</figure>\n<!-- /wp:image -->";
	}
	return $o . "</figure>\n<!-- /wp:gallery -->\n";
}

/** Sadržaj posta → [tekst, [[id, natpis], …]] (obrnuto od odlomci + galerija). */
function hk_razlozi( string $s ): array {
	$slike = array();
	if ( preg_match_all( '#<!-- wp:image \{"id":(\d+)[^>]*-->(.*?)<!-- /wp:image -->#s', $s, $m, PREG_SET_ORDER ) ) {
		foreach ( $m as $x ) {
			preg_match( '#<figcaption[^>]*>(.*?)</figcaption>#s', $x[2], $nat );
			$slike[] = array( (int) $x[1], isset( $nat[1] ) ? html_entity_decode( wp_strip_all_tags( $nat[1] ) ) : '' );
		}
	}
	$bez = preg_replace( '#<!-- wp:(gallery|image).*?<!-- /wp:\1 -->#s', '', $s );
	$bez = preg_replace( '#<br\s*/?>#i', "\n", str_replace( '</p>', "\n\n", $bez ) );
	return array( trim( html_entity_decode( wp_strip_all_tags( $bez ) ) ), $slike );
}

/** GPX: dopusti .gpx, spremi trag i brojke u meta izleta (ili ukloni ako je zadano). */
function hk_gpx( int $id ): ?string {
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	$kljucevi = array( '_izlet_track', '_izlet_bounds', '_izlet_gpx_duljina', '_izlet_gpx_uspon', '_izlet_gpx_spust', '_izlet_gpx_id' );
	if ( ! empty( $_POST['gpx_ukloni'] ) ) {
		array_map( fn( $k ) => delete_post_meta( $id, $k ), $kljucevi );
	}
	if ( empty( $_FILES['gpx']['name'] ) || UPLOAD_ERR_OK !== $_FILES['gpx']['error'] ) {
		return null;
	}
	if ( 'gpx' !== strtolower( pathinfo( $_FILES['gpx']['name'], PATHINFO_EXTENSION ) ) || $_FILES['gpx']['size'] > 6 * MB_IN_BYTES ) {
		return 'GPX nije spremljen: treba biti datoteka .gpx manja od 6 MB.';
	}
	$r = hikeit_parse_gpx( (string) file_get_contents( $_FILES['gpx']['tmp_name'] ) );
	if ( is_wp_error( $r ) ) {
		return 'GPX nije spremljen: ' . $r->get_error_message();
	}
	$a = media_handle_upload( 'gpx', $id, array(), array( 'test_form' => false, 'mimes' => array( 'gpx' => 'application/gpx+xml' ) ) );
	if ( is_wp_error( $a ) ) {
		return 'GPX nije spremljen: ' . $a->get_error_message();
	}
	update_post_meta( $id, '_izlet_gpx_id', $a );
	update_post_meta( $id, '_izlet_track', wp_json_encode( $r['track'] ) );
	update_post_meta( $id, '_izlet_bounds', wp_json_encode( $r['bounds'] ) );
	update_post_meta( $id, '_izlet_gpx_duljina', round( $r['distance_m'] / 1000, 1 ) );
	update_post_meta( $id, '_izlet_gpx_uspon', $r['ascent_m'] );
	update_post_meta( $id, '_izlet_gpx_spust', $r['descent_m'] );
	return null;
}

function hk_ucitaj( string $polje, int $roditelj ): array {
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	$f = $_FILES[ $polje ] ?? null;
	$ids = array();
	foreach ( (array) ( $f['name'] ?? array() ) as $i => $ime ) {
		$g = fn( $k ) => ( (array) $f[ $k ] )[ $i ];
		if ( UPLOAD_ERR_OK !== $g( 'error' ) ) {
			continue;
		}
		$_FILES['hk_jedna'] = array( 'name' => $ime, 'type' => $g( 'type' ), 'tmp_name' => $g( 'tmp_name' ), 'error' => 0, 'size' => $g( 'size' ) );
		$id = media_handle_upload( 'hk_jedna', $roditelj, array(), array(
			'test_form' => false,
			'mimes'     => array( 'jpg|jpeg|jpe' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif' ),
		) );
		if ( ! is_wp_error( $id ) ) {
			$ids[] = $id;
		}
	}
	return $ids;
}

/** Sprema zapis; vraća ID ili WP_Error. */
function hk_spremi( array $c, int $id ) {
	$naslov = sanitize_text_field( wp_unslash( $_POST['naslov'] ?? '' ) );
	if ( '' === $naslov ) {
		return new WP_Error( 'naslov', 'Naslov je obavezan.' );
	}
	$slike = array();
	if ( $c['slike'] ) {
		$ukloni = array_map( 'intval', (array) ( $_POST['slika_ukloni'] ?? array() ) );
		foreach ( (array) ( $_POST['slika_id'] ?? array() ) as $i => $sid ) {
			$sid = (int) $sid;
			if ( $sid && ! in_array( $sid, $ukloni, true ) && 'attachment' === get_post_type( $sid ) ) {
				$slike[] = array( $sid, sanitize_text_field( wp_unslash( $_POST['slika_natpis'][ $i ] ?? '' ) ) );
			}
		}
	}
	$podaci = array(
		'post_type'    => $c['cpt'],
		'post_title'   => $naslov,
		'post_status'  => 'draft' === ( $_POST['status'] ?? '' ) ? 'draft' : 'publish',
		'post_content' => '',
	);
	if ( ! empty( $c['sazetak'] ) ) {
		$podaci['post_excerpt'] = sanitize_textarea_field( wp_unslash( $_POST['sazetak'] ?? '' ) );
	}
	if ( $id ) {
		$podaci['ID'] = $id;
	}
	$id = $id ? wp_update_post( $podaci, true ) : wp_insert_post( $podaci + array( 'post_content' => '' ), true );
	if ( is_wp_error( $id ) ) {
		return $id;
	}
	if ( $c['slike'] ) {
		foreach ( hk_ucitaj( 'nove', $id ) as $nid ) {
			$slike[] = array( $nid, '' );
		}
	}
	wp_update_post( array( 'ID' => $id, 'post_content' => hk_odlomci_blokovi( wp_unslash( $_POST['opis'] ?? '' ) ) . hk_galerija_blok( $slike ) ) );

	foreach ( $c['polja'] as [ $naziv, , $vrsta ] ) {
		$v = wp_unslash( $_POST['p'][ $naziv ] ?? '' );
		$v = 'url' === $vrsta ? esc_url_raw( $v ) : ( 'check' === $vrsta ? ( $v ? 1 : 0 ) : ( 'textarea' === $vrsta ? sanitize_textarea_field( $v ) : sanitize_text_field( $v ) ) );
		function_exists( 'update_field' ) ? update_field( $naziv, $v, $id ) : update_post_meta( $id, $naziv, $v );
	}
	if ( ! empty( $c['oznake'] ) ) {
		wp_set_object_terms( $id, array_filter( array_map( 'trim', explode( ',', sanitize_text_field( wp_unslash( $_POST['oznake'] ?? '' ) ) ) ) ), 'oznaka' );
	}

	if ( ! empty( $c['gpx'] ) && ( $gr = hk_gpx( $id ) ) ) {
		$GLOBALS['hk_gpx_greska'] = $gr;
	}

	// naslovna slika: nova > postojeća > prva slika galerije
	if ( ! empty( $_POST['ukloni_naslovnu'] ) ) {
		delete_post_thumbnail( $id );
	}
	if ( $nova = hk_ucitaj( 'naslovna', $id ) ) {
		set_post_thumbnail( $id, $nova[0] );
	}
	if ( ! has_post_thumbnail( $id ) && $slike ) {
		set_post_thumbnail( $id, $slike[0][0] );
	}
	return $id;
}

function hk_polje_html( string $naziv, string $oznaka, string $vrsta, $vr, $opcije = null ): string {
	$e  = 'esc_attr';
	$ime = 'name="p[' . $e( $naziv ) . ']"';
	if ( 'check' === $vrsta ) {
		return '<label class="cb"><input type="checkbox" ' . $ime . ' value="1"' . checked( (bool) $vr, true, false ) . '> ' . esc_html( $oznaka ) . '</label>';
	}
	$o = '<div><label>' . esc_html( $oznaka );
	if ( 'select' === $vrsta || 'vodic' === $vrsta ) {
		if ( 'vodic' === $vrsta ) {
			$opcije = array( '' => '— bez vodiča —' );
			foreach ( get_posts( array( 'post_type' => 'vodic', 'numberposts' => -1, 'orderby' => 'title', 'order' => 'ASC' ) ) as $v ) {
				$opcije[ $v->ID ] = $v->post_title;
			}
		}
		$o .= '<select ' . $ime . '>';
		foreach ( $opcije as $k => $t ) {
			$o .= '<option value="' . $e( $k ) . '"' . selected( (string) $vr, (string) $k, false ) . '>' . esc_html( $t ) . '</option>';
		}
		return $o . '</select></label></div>';
	}
	if ( 'textarea' === $vrsta ) {
		return $o . '<textarea ' . $ime . ' rows="5">' . esc_textarea( $vr ) . '</textarea></label></div>';
	}
	return $o . '<input type="' . $e( $vrsta ) . '"' . ( 'number' === $vrsta ? ' step="any" min="0"' : '' ) . ' ' . $ime . ' value="' . $e( $vr ) . '"></label></div>';
}

function hk_forma( string $kljuc, array $c, int $id, string $greska = '' ): void {
	$baza = home_url( "/upravljanje/$kljuc/" );
	$p    = $id ? get_post( $id ) : null;
	[ $tekst, $slike ] = $p ? hk_razlozi( $p->post_content ) : array( '', array() );
	// nakon greške zadrži upisano
	$naslov = $_POST ? wp_unslash( $_POST['naslov'] ?? '' ) : ( $p->post_title ?? '' );
	$tekst  = $_POST ? wp_unslash( $_POST['opis'] ?? '' ) : $tekst;
	$e = 'esc_html';
	$o = '<p><a href="' . esc_url( $baza ) . '">← ' . $e( $c['n'] ) . '</a></p><h1>' . $e( $p ? $p->post_title : $c['novi'] ) . '</h1>'
		. ( isset( $_GET['spremljeno'] ) ? '<div class="ok">Spremljeno.</div>' : '' ) . ( isset( $_GET['gpx_greska'] ) ? '<div class="gr">' . $e( sanitize_text_field( wp_unslash( $_GET['gpx_greska'] ) ) ) . '</div>' : '' ) . ( $greska ? '<div class="gr">' . $e( $greska ) . '</div>' : '' )
		. '<form method="post" enctype="multipart/form-data">' . wp_nonce_field( 'hk_panel', '_n', true, false ) . '<input type="hidden" name="id" value="' . $id . '">'
		. '<label for="naslov">Naslov</label><input id="naslov" name="naslov" type="text" value="' . esc_attr( $naslov ) . '" required>';
	if ( ! empty( $c['sazetak'] ) ) {
		$o .= '<label for="sazetak">Kratki opis (za kartice na popisu)</label><textarea id="sazetak" name="sazetak" style="min-height:4rem">' . esc_textarea( $_POST ? wp_unslash( $_POST['sazetak'] ?? '' ) : ( $p->post_excerpt ?? '' ) ) . '</textarea>';
	}
	$o .= '<label for="opis">Opis <span class="mala">(prazan redak odvaja odlomke)</span></label><textarea id="opis" name="opis">' . esc_textarea( $tekst ) . '</textarea><div class="dva">';
	foreach ( $c['polja'] as $f ) {
		[ $naziv, $oznaka, $vrsta ] = $f;
		$opc = $f[3] ?? null;
		$vr = $_POST ? wp_unslash( $_POST['p'][ $naziv ] ?? '' ) : ( $id ? get_post_meta( $id, $naziv, true ) : ( 'tezina' === $naziv ? 'umjereno' : '' ) );
		$o .= hk_polje_html( $naziv, $oznaka, $vrsta, $vr, $opc );
	}
	$o .= '</div>';
	if ( ! empty( $c['oznake'] ) ) {
		$o .= '<label for="oznake">Oznake <span class="mala">(odvojene zarezom)</span></label><input id="oznake" name="oznake" type="text" value="' . esc_attr( $id ? implode( ', ', wp_get_object_terms( $id, 'oznaka', array( 'fields' => 'names' ) ) ) : '' ) . '">';
	}
	$o .= '<label for="naslovna">Naslovna slika' . ( 'galerije' === $kljuc ? ' <span class="mala">(ako je ne odaberete, koristi se prva slika)</span>' : '' ) . '</label>';
	if ( $id && has_post_thumbnail( $id ) ) {
		$o .= '<p>' . get_the_post_thumbnail( $id, 'thumbnail', array( 'style' => 'height:6rem;width:auto;border-radius:.5rem' ) )
			. '<br><label class="cb" style="margin:.3rem 0 0;font-weight:500"><input type="checkbox" name="ukloni_naslovnu" value="1"> ukloni</label></p>';
	}
	$o .= '<input id="naslovna" name="naslovna[]" type="file" accept="image/*">';
	if ( ! empty( $c['gpx'] ) ) {
		$g = $id ? (int) get_post_meta( $id, '_izlet_gpx_id', true ) : 0;
		$o .= '<h2>Staza (GPX)</h2>';
		if ( $g && hikeit_track( $id ) ) {
			$o .= '<p>Dodano: ' . esc_html( basename( (string) get_attached_file( $g ) ) ) . ' — ' . esc_html( get_post_meta( $id, '_izlet_gpx_duljina', true ) ) . ' km, uspon ' . (int) get_post_meta( $id, '_izlet_gpx_uspon', true ) . ' m. <label class="cb" style="font-weight:500"><input type="checkbox" name="gpx_ukloni" value="1"> ukloni</label></p>';
		}
		$o .= '<label for="gpx">' . ( $g ? 'Zamijeni GPX' : 'GPX datoteka' ) . ' <span class="mala">(iz nje se sami izračunaju duljina, uspon i visinski profil te karta na stranici izleta)</span></label><input id="gpx" name="gpx" type="file" accept=".gpx">';
	}
	if ( $c['slike'] ) {
		$o .= '<h2>Slike</h2>';
		if ( $slike ) {
			$o .= '<ul class="slike" id="slike">';
			foreach ( $slike as [ $sid, $nat ] ) {
				$o .= '<li>' . wp_get_attachment_image( $sid, 'thumbnail' ) . '<span><input type="hidden" name="slika_id[]" value="' . $sid . '"><input type="text" name="slika_natpis[]" value="' . esc_attr( $nat ) . '" placeholder="Opis slike (nije obavezan)"></span>'
					. '<label><input type="checkbox" name="slika_ukloni[]" value="' . $sid . '"> ukloni</label><span><button type="button" class="sek" data-s="-1" aria-label="Gore">↑</button> <button type="button" class="sek" data-s="1" aria-label="Dolje">↓</button></span></li>';
			}
			$o .= '</ul>';
		}
		$o .= '<label for="nove">Dodaj slike <span class="mala">(možete odabrati više odjednom; dodaju se na kraj)</span></label><input id="nove" name="nove[]" type="file" accept="image/*" multiple>';
	}
	$status = $_POST ? ( $_POST['status'] ?? '' ) : ( $p->post_status ?? 'publish' );
	$o .= '<label for="status">Status</label><select id="status" name="status"><option value="publish"' . selected( $status, 'publish', false ) . '>Objavljeno</option><option value="draft"' . selected( $status, 'draft', false ) . '>Skica (nije vidljivo na stranici)</option></select>'
		. '<p style="margin-top:1.5rem"><button>Spremi</button></p></form>';
	if ( $id ) {
		$o .= '<form method="post" data-potvrda="Obrisati ovaj zapis?"' . '>' . wp_nonce_field( 'hk_panel', '_n', true, false ) . '<input type="hidden" name="id" value="' . $id . '"><input type="hidden" name="akcija" value="obrisi"><button class="sek">Obriši</button></form>';
	}
	hk_html( $p ? $p->post_title : $c['novi'], $o, true );
}

/* ---------------------------------------------------------------- upiti */

function hk_tablica_upita( int $limit = 0, int $str = 1 ): string {
	if ( ! class_exists( 'Flamingo_Inbound_Message' ) ) {
		return '<p class="mala">Flamingo nije aktivan.</p>';
	}
	$poruke = Flamingo_Inbound_Message::find( array( 'posts_per_page' => $limit ?: 25, 'paged' => $str ) );
	if ( ! $poruke ) {
		return '<p class="mala">Još nema upita.</p>';
	}
	$o = '<table><tr><th>Od</th><th>Tema / poruka</th><th>Izlet</th><th>Primljeno</th></tr>';
	foreach ( $poruke as $m ) {
		$nov = ! get_post_meta( $m->id(), '_hk_procitano', true );
		$o  .= '<tr' . ( $nov ? ' class="neproc"' : '' ) . '><td><a href="' . esc_url( home_url( '/upravljanje/upiti/' . $m->id() . '/' ) ) . '">' . esc_html( $m->from_name ?: $m->from_email ) . '</a><div class="mala">' . esc_html( $m->from_email ) . '</div></td>'
			. '<td>' . esc_html( $m->subject ) . '</td><td>' . esc_html( get_the_title( (int) get_post_meta( $m->id(), '_hk_izlet', true ) ) ) . '</td><td>' . esc_html( get_the_date( 'j. n. Y. H:i', $m->id() ) ) . '</td></tr>';
	}
	return $o . '</table>';
}

/** Slobodna mjesta izleta (null ako nije zadan najveći broj). Vidljivo samo u upravljanju, nikad javno. */
function hk_slobodna_mjesta( int $izlet ): ?int {
	$max = (int) get_post_meta( $izlet, 'max_sudionika', true );
	if ( ! $max ) {
		return null;
	}
	$zauzeto = 0;
	foreach ( get_posts( array( 'post_type' => 'flamingo_inbound', 'numberposts' => -1, 'meta_key' => '_hk_izlet', 'meta_value' => $izlet ) ) as $u ) {
		$zauzeto += max( 1, (int) get_post_meta( $u->ID, '_hk_osoba', true ) );
	}
	return $max - $zauzeto;
}

function hk_pridruzi_forma( int $upit ): string {
	$tr  = (int) get_post_meta( $upit, '_hk_izlet', true );
	$os  = max( 1, (int) get_post_meta( $upit, '_hk_osoba', true ) );
	$o   = '<form method="post" class="pridruzi">' . wp_nonce_field( 'hk_panel', '_n', true, false ) . '<input type="hidden" name="id" value="' . $upit . '"><input type="hidden" name="akcija" value="pridruzi">'
		. '<h2>Pridruži izletu</h2><label for="izlet">Izlet</label><select id="izlet" name="izlet"><option value="0">— nije pridružen —</option>';
	foreach ( get_posts( array( 'post_type' => 'izlet', 'post_status' => 'publish', 'numberposts' => -1 ) ) as $i ) {
		$sl  = hk_slobodna_mjesta( $i->ID );
		$o  .= '<option value="' . $i->ID . '"' . selected( $tr, $i->ID, false ) . '>' . esc_html( $i->post_title . ( null === $sl ? '' : ' — slobodno: ' . $sl ) ) . '</option>';
	}
	$o .= '</select><label for="osoba">Broj osoba</label><input id="osoba" name="osoba" type="number" min="1" value="' . $os . '"><p><button>Spremi</button></p>';
	if ( $tr && null !== ( $sl = hk_slobodna_mjesta( $tr ) ) ) {
		$o .= '<p><strong>' . esc_html( get_the_title( $tr ) ) . ':</strong> još slobodnih mjesta: ' . ( $sl < 0 ? '<span style="color:#b00">' . $sl . ' (prekoračeno)</span>' : $sl ) . ' od ' . (int) get_post_meta( $tr, 'max_sudionika', true ) . '</p>';
	}
	return $o . '</form>';
}

function hk_upiti( int $id ): void {
	if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {
		hk_provjeri_nonce();
		if ( 'pridruzi' === ( $_POST['akcija'] ?? '' ) ) {
			$u = (int) ( $_POST['id'] ?? 0 );
			$i = (int) ( $_POST['izlet'] ?? 0 );
			if ( get_post_type( $u ) === 'flamingo_inbound' ) {
				if ( $i && get_post_type( $i ) === 'izlet' ) {
					update_post_meta( $u, '_hk_izlet', $i );
					update_post_meta( $u, '_hk_osoba', max( 1, (int) ( $_POST['osoba'] ?? 1 ) ) );
				} else {
					delete_post_meta( $u, '_hk_izlet' );
					delete_post_meta( $u, '_hk_osoba' );
				}
			}
			wp_safe_redirect( home_url( '/upravljanje/upiti/' . $u . '/' ) );
			exit;
		}
		$m = new Flamingo_Inbound_Message( (int) ( $_POST['id'] ?? 0 ) );
		if ( $m->id() ) {
			$m->trash();
		}
		wp_safe_redirect( add_query_arg( 'obrisano', 1, home_url( '/upravljanje/upiti/' ) ) );
		exit;
	}
	if ( $id ) {
		$m = new Flamingo_Inbound_Message( $id );
		if ( ! $m->id() ) {
			wp_safe_redirect( home_url( '/upravljanje/upiti/' ) );
			exit;
		}
		update_post_meta( $id, '_hk_procitano', 1 );
		$o = '<p><a href="' . esc_url( home_url( '/upravljanje/upiti/' ) ) . '">← Upiti</a></p><h1>' . esc_html( $m->subject ?: 'Upit' ) . '</h1><dl>'
			. '<dt>Primljeno</dt><dd>' . esc_html( get_the_date( 'j. n. Y. H:i', $id ) ) . '</dd>';
		foreach ( (array) $m->fields as $k => $v ) {
			$v  = is_array( $v ) ? implode( ', ', $v ) : (string) $v;
			$o .= '<dt>' . esc_html( ucfirst( $k ) ) . '</dt><dd>' . ( 'email' === $k ? '<a href="mailto:' . esc_attr( $v ) . '">' . esc_html( $v ) . '</a>' : esc_html( $v ) ) . '</dd>';
		}
		$o .= '</dl>' . hk_pridruzi_forma( $id ) . '<p><a class="gumb" href="mailto:' . esc_attr( $m->from_email ) . '?subject=' . rawurlencode( 'Re: ' . $m->subject ) . '">Odgovori e-poštom</a></p>'
			. '<form method="post" data-potvrda="Obrisati ovaj upit?">' . wp_nonce_field( 'hk_panel', '_n', true, false ) . '<input type="hidden" name="id" value="' . $id . '"><button class="sek">Obriši upit</button></form>';
		hk_html( 'Upit', $o, true );
		return;
	}
	$str = max( 1, (int) ( $_GET['str'] ?? 1 ) );
	$uk  = (int) wp_count_posts( 'flamingo_inbound' )->publish;
	$o   = '<h1>Upiti</h1>' . ( isset( $_GET['obrisano'] ) ? '<div class="ok">Upit je obrisan.</div>' : '' ) . hk_tablica_upita( 0, $str );
	if ( $uk > 25 ) {
		$o .= '<p>' . ( $str > 1 ? '<a href="?str=' . ( $str - 1 ) . '">← Novije</a> ' : '' ) . ( $str * 25 < $uk ? '<a href="?str=' . ( $str + 1 ) . '">Starije →</a>' : '' ) . '</p>';
	}
	hk_html( 'Upiti', $o, true );
}

/* ---------------------------------------------------------------- kontakt podaci */

function hk_kontakt(): void {
	$str = get_page_by_path( 'kontakt' );
	$polja = array(
		'email' => array( 'E-mail', 'email' ), 'telefoni' => array( 'Telefoni (jedan po retku: Oznaka | broj)', 'textarea' ),
		'lokacija' => array( 'Lokacija', 'text' ), 'lokacija_napomena' => array( 'Napomena uz lokaciju', 'text' ),
		'radno_vrijeme' => array( 'Radno vrijeme', 'textarea' ), 'radno_vrijeme_napomena' => array( 'Napomena uz radno vrijeme', 'text' ),
		'instagram' => array( 'Instagram (adresa)', 'url' ), 'facebook' => array( 'Facebook (adresa)', 'url' ),
		'galerija_uvod' => array( 'Uvodni tekst na stranici Galerija', 'textarea' ),
	);
	if ( ! $str ) {
		hk_html( 'Kontakt podaci', '<h1>Kontakt podaci</h1><p>Stranica „Kontakt“ ne postoji.</p>', true );
		return;
	}
	$spremljeno = false;
	if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {
		hk_provjeri_nonce();
		foreach ( $polja as $n => [ , $vrsta ] ) {
			$v = wp_unslash( $_POST[ $n ] ?? '' );
			$v = 'url' === $vrsta ? esc_url_raw( $v ) : ( 'email' === $vrsta ? sanitize_email( $v ) : ( 'textarea' === $vrsta ? sanitize_textarea_field( $v ) : sanitize_text_field( $v ) ) );
			function_exists( 'update_field' ) ? update_field( $n, $v, $str->ID ) : update_post_meta( $str->ID, $n, $v );
		}
		$spremljeno = true;
	}
	$o = '<h1>Kontakt podaci</h1><p class="mala">Prikazuju se na stranici Kontakt i u podnožju.</p>' . ( $spremljeno ? '<div class="ok">Spremljeno.</div>' : '' )
		. '<form method="post">' . wp_nonce_field( 'hk_panel', '_n', true, false );
	foreach ( $polja as $n => [ $oz, $vrsta ] ) {
		$vr  = (string) get_post_meta( $str->ID, $n, true );
		$o  .= '<label for="' . esc_attr( $n ) . '">' . esc_html( $oz ) . '</label>'
			. ( 'textarea' === $vrsta
				? '<textarea id="' . esc_attr( $n ) . '" name="' . esc_attr( $n ) . '" style="min-height:5rem">' . esc_textarea( $vr ) . '</textarea>'
				: '<input id="' . esc_attr( $n ) . '" name="' . esc_attr( $n ) . '" type="' . esc_attr( $vrsta ) . '" value="' . esc_attr( $vr ) . '">' );
	}
	hk_html( 'Kontakt podaci', $o . '<p style="margin-top:1.5rem"><button>Spremi</button></p></form>', true );
}

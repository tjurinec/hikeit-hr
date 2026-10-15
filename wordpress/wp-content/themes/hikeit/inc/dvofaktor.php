<?php
/**
 * Dvofaktorska prijava (TOTP, RFC 6238) za /prijava/. Radi s Google Authenticator,
 * Authy, Microsoft Authenticator i sl. Tajna je u usermeta `hk_totp_tajna`;
 * poništavanje (izgubljen mobitel, bez rezervnih kodova): `wp user meta delete ID hk_totp_tajna`.
 */

const HK_B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function hk_b32_kodiraj( string $bin ): string {
	$bitovi = '';
	foreach ( str_split( $bin ) as $c ) {
		$bitovi .= str_pad( decbin( ord( $c ) ), 8, '0', STR_PAD_LEFT );
	}
	$o = '';
	foreach ( str_split( $bitovi, 5 ) as $g ) {
		$o .= HK_B32[ bindec( str_pad( $g, 5, '0' ) ) ];
	}
	return $o;
}

function hk_b32_dekodiraj( string $b32 ): string {
	$bitovi = '';
	foreach ( str_split( strtoupper( $b32 ) ) as $c ) {
		$bitovi .= str_pad( decbin( (int) strpos( HK_B32, $c ) ), 5, '0', STR_PAD_LEFT );
	}
	$o = '';
	foreach ( str_split( $bitovi, 8 ) as $g ) {
		if ( strlen( $g ) === 8 ) {
			$o .= chr( bindec( $g ) );
		}
	}
	return $o;
}

function hk_totp( string $tajna, int $korak, int $znamenki = 6 ): string {
	$h = hash_hmac( 'sha1', pack( 'J', $korak ), hk_b32_dekodiraj( $tajna ), true );
	$p = ord( $h[19] ) & 15;
	$v = ( unpack( 'N', substr( $h, $p, 4 ) )[1] & 0x7fffffff ) % ( 10 ** $znamenki );
	return str_pad( (string) $v, $znamenki, '0', STR_PAD_LEFT );
}

/** Vraća korak koji je potvrdio kod (±30 s tolerancije) ili 0. */
function hk_totp_provjeri( string $tajna, string $kod ): int {
	$kod = preg_replace( '/\s+/', '', $kod );
	if ( ! preg_match( '/^\d{6}$/', $kod ) ) {
		return 0;
	}
	$sad = intdiv( time(), 30 );
	foreach ( array( 0, -1, 1 ) as $d ) {
		if ( hash_equals( hk_totp( $tajna, $sad + $d ), $kod ) ) {
			return $sad + $d;
		}
	}
	return 0;
}

function hk_nova_tajna(): string {
	return hk_b32_kodiraj( random_bytes( 20 ) );
}

/** 8 rezervnih kodova; u bazi samo sažeci. Vraća kodove u čitljivom obliku. */
function hk_rezervni_kodovi( int $uid ): array {
	$kodovi = array();
	for ( $i = 0; $i < 8; $i++ ) {
		$kodovi[] = bin2hex( random_bytes( 3 ) ) . '-' . bin2hex( random_bytes( 3 ) );
	}
	update_user_meta( $uid, 'hk_rezervni', array_map( fn( $k ) => hash( 'sha256', $k ), $kodovi ) );
	return $kodovi;
}

/** Kod iz aplikacije ili rezervni kod (jednokratan). */
function hk_provjeri_drugi_faktor( int $uid, string $kod ): bool {
	$tajna = (string) get_user_meta( $uid, 'hk_totp_tajna', true );
	$korak = $tajna ? hk_totp_provjeri( $tajna, $kod ) : 0;
	if ( $korak ) {
		if ( $korak <= (int) get_user_meta( $uid, 'hk_totp_zadnji', true ) ) {
			return false; // isti kod se ne smije iskoristiti dvaput
		}
		update_user_meta( $uid, 'hk_totp_zadnji', $korak );
		return true;
	}
	$sazetak  = hash( 'sha256', strtolower( trim( $kod ) ) );
	$rezervni = (array) get_user_meta( $uid, 'hk_rezervni', true );
	if ( in_array( $sazetak, $rezervni, true ) ) {
		update_user_meta( $uid, 'hk_rezervni', array_values( array_diff( $rezervni, array( $sazetak ) ) ) );
		return true;
	}
	return false;
}

<?php
// Provjera TOTP-a prema RFC 6238 (SHA-1, tajna "12345678901234567890"): wp eval-file bin/test-2fa.php
$t = hk_b32_kodiraj( '12345678901234567890' );
assert( $t === 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ' );
assert( hk_b32_dekodiraj( $t ) === '12345678901234567890' );
assert( hk_totp( $t, intdiv( 59, 30 ), 8 ) === '94287082' );
assert( hk_totp( $t, intdiv( 1111111109, 30 ), 8 ) === '07081804' );
assert( hk_totp_provjeri( $t, hk_totp( $t, intdiv( time(), 30 ) ) ) > 0 );
assert( hk_totp_provjeri( $t, '000000' ) === 0 || hk_totp( $t, intdiv( time(), 30 ) ) === '000000' );
echo "2FA ok\n";

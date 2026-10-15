#!/usr/bin/env python3
"""Šalje sadržaj odabranih STRANICA iz lokalnog WordPressa na hosting (bez SSH-a, preko cPanel API tokena).
Uporaba: bin/sync-na-hosting.py razvoj o-meni usluge usluge/web-stranice …   (putanje stranica)
Treba ~/.hikeit_cpanel_token. Slike se povezuju preko meta `_hikeit_izvor` (isto ime datoteke na oba mjesta).
Prepisuje naslov, sadržaj i Yoast naslov/opis tih stranica; ne dira ništa drugo."""
import json, os, secrets, subprocess, sys, urllib.parse, urllib.request, ssl

if len(sys.argv) < 2:
    sys.exit(__doc__)
SERVER, USER, HR, DEV = '185.62.75.97', 'hikeithr', 'https://hikeit.hr', 'https://dev.hikeit.hr'
tok = open(os.path.expanduser('~/.hikeit_cpanel_token')).read().strip()
ctx = ssl._create_unverified_context()  # IP adresa poslužitelja, certifikat vrijedi za domene
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')

def wp(code):
    r = subprocess.run(['docker', 'compose', 'run', '--rm', '-T', 'cli', 'wp', 'eval', code], capture_output=True, text=True, check=True)
    return r.stdout.strip().splitlines()[-1]

lokalno = json.loads(wp('''
$izlaz = array();
foreach ( %s as $put ) {
	$s = get_page_by_path( $put ); if ( ! $s ) { continue; }
	preg_match_all( '/(?:wp-image-|"id":)(\\d+)/', $s->post_content, $m );
	$sl = array();
	foreach ( array_unique( $m[1] ) as $id ) { $sl[ $id ] = get_post_meta( $id, "_hikeit_izvor", true ); }
	$izlaz[ $put ] = array( "title" => $s->post_title, "content" => $s->post_content, "seo_title" => get_post_meta( $s->ID, "_yoast_wpseo_title", true ), "seo_desc" => get_post_meta( $s->ID, "_yoast_wpseo_metadesc", true ), "slike" => $sl );
}
echo json_encode( $izlaz );''' % ('array(' + ','.join('"%s"' % a for a in sys.argv[1:]) + ')')))
key = secrets.token_hex(8)
datoteke = {}
for st in lokalno.values():
    for izv in st['slike'].values():
        if izv.startswith('datoteka:'):
            ime = izv[9:]
            for mapa in ('seed-slike/foto', 'seed-slike'):
                if os.path.isfile(f'{mapa}/{ime}'):
                    datoteke[ime] = f'{mapa}/{ime}'

def api(fn, **p):
    req = urllib.request.Request(f'https://{SERVER}:2083/execute/{fn}', urllib.parse.urlencode(p).encode(), {'Authorization': f'cpanel {USER}:{tok}'})
    return json.load(urllib.request.urlopen(req, context=ctx))

def odvoji(putanja, ime):
    api('Fileman/save_file_content', dir=putanja, file=ime, content=open(f'/tmp/{ime}').read())

def ucitaj(dir_, ime, putanja):
    granica = secrets.token_hex(8); tijelo = b''
    for k, v in (('dir', dir_),):
        tijelo += f'--{granica}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    tijelo += f'--{granica}\r\nContent-Disposition: form-data; name="file-1"; filename="{ime}"\r\nContent-Type: application/octet-stream\r\n\r\n'.encode() + open(putanja, 'rb').read() + f'\r\n--{granica}--\r\n'.encode()
    r = urllib.request.Request(f'https://{SERVER}:2083/execute/Fileman/upload_files', tijelo, {'Authorization': f'cpanel {USER}:{tok}', 'Content-Type': f'multipart/form-data; boundary={granica}'})
    return json.load(urllib.request.urlopen(r, context=ctx))

skripta = f'''<?php if ( ( $_GET['k'] ?? '' ) !== '{key}' ) {{ http_response_code(404); exit; }} header('Content-Type: text/plain; charset=utf-8'); define('WP_USE_THEMES', false);
require '/home/hikeithr/public_html/wp-load.php'; global $wpdb;
$d = json_decode( file_get_contents( '/home/hikeithr/sync_{key}.json' ), true );
foreach ( $d as $put => $s ) {{
	$mapa = array();
	foreach ( $s['slike'] as $lok => $izv ) {{
		$mapa[ $lok ] = $izv ? (int) $wpdb->get_var( $wpdb->prepare( "SELECT post_id FROM {{$wpdb->postmeta}} WHERE meta_key='_hikeit_izvor' AND meta_value=%s LIMIT 1", $izv ) ) : 0;
		if ( ! $mapa[ $lok ] && str_starts_with( $izv, 'datoteka:' ) && is_file( '/home/hikeithr/sync_{key}/' . substr( $izv, 9 ) ) ) {{
			require_once ABSPATH . 'wp-admin/includes/file.php'; require_once ABSPATH . 'wp-admin/includes/media.php'; require_once ABSPATH . 'wp-admin/includes/image.php';
			$tmp = wp_tempnam( substr( $izv, 9 ) ); copy( '/home/hikeithr/sync_{key}/' . substr( $izv, 9 ), $tmp );
			$nid = media_handle_sideload( array( 'name' => substr( $izv, 9 ), 'tmp_name' => $tmp ), 0, '' );
			if ( ! is_wp_error( $nid ) ) {{ update_post_meta( $nid, '_hikeit_izvor', $izv ); $mapa[ $lok ] = $nid; echo "nova slika $izv\n"; }}
		}}
	}}
	$c = str_replace( array( 'http://dev.localhost:8089', 'http://localhost:8089' ), array( '{DEV}', '{HR}' ), $s['content'] );
	$c = preg_replace_callback( '/(wp-image-|"id":)(\\d+)/', fn( $m ) => $m[1] . ( $mapa[ $m[2] ] ?? 0 ?: $m[2] ), $c );
	$str = get_page_by_path( $put ); if ( ! $str ) {{ echo "NEMA stranice $put\\n"; continue; }}
	wp_update_post( array( 'ID' => $str->ID, 'post_title' => $s['title'], 'post_content' => wp_slash( $c ) ) );
	update_post_meta( $str->ID, '_yoast_wpseo_title', $s['seo_title'] ); update_post_meta( $str->ID, '_yoast_wpseo_metadesc', $s['seo_desc'] );
	echo "ok $put (" . count( $s['slike'] ) . " slika)\\n";
}}
'''
open(f'/tmp/sync_{key}.json', 'w').write(json.dumps(lokalno)); open(f'/tmp/sync_{key}.php', 'w').write(skripta)
api('Fileman/save_file_content', dir='/home/hikeithr', file=f'sync_{key}.json', content=json.dumps(lokalno))
if datoteke:
    api('Fileman/mkdir', path='/home/hikeithr', name=f'sync_{key}')
    for ime, put in datoteke.items():
        ucitaj(f'/home/hikeithr/sync_{key}', ime, put)
api('Fileman/save_file_content', dir='/home/hikeithr/public_html', file=f'sync_{key}.php', content=skripta)
try:
    print(urllib.request.urlopen(f'{HR}/sync_{key}.php?k={key}', timeout=90).read().decode())
finally:
    for f in (f'/home/hikeithr/public_html/sync_{key}.php', f'/home/hikeithr/sync_{key}.json', f'/home/hikeithr/sync_{key}'):
        urllib.request.urlopen(urllib.request.Request(f'https://{SERVER}:2083/json-api/cpanel?' + urllib.parse.urlencode({'cpanel_jsonapi_module': 'Fileman', 'cpanel_jsonapi_func': 'fileop', 'cpanel_jsonapi_apiversion': 2, 'op': 'unlink', 'sourcefiles': f}), headers={'Authorization': f'cpanel {USER}:{tok}'}), context=ctx).read()
    os.remove(f'/tmp/sync_{key}.json'); os.remove(f'/tmp/sync_{key}.php')

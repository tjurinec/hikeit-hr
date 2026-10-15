<?php
/**
 * Sadržaj statičnih stranica, preuzet iz React stranice (HomePage, AboutPage, ContactPage).
 * Pokretanje: wp eval-file bin/seed-stranice.php [force]
 * Ono što nije bilo na staroj stranici (hikeit.dev) označeno je u izvješću kao nacrt teksta.
 */
require_once __DIR__ . '/lib.php';
$force = in_array( 'force', $args ?? array(), true );

$planina = hk_slika( 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85', 'Planinski pejzaž' );
$staza   = hk_slika( 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=80', 'Planinar na stazi' );

/* ---------- Početna ---------- */
$home  = hk_naslovnica( $planina,
	hk_p( 'PLANINSKI I TURISTIČKI IZLETI • HRVATSKA I REGIJA', 'hk-oznaka', 'center' )
	. hk_h( 'Svaki vrh ima svoju priču', 1, 'center' )
	. hk_p( 'Vodimo te na mjesta gdje planine grle nebo, a more šapuće tajne. Profesionalni vodiči, male grupe, nezaboravna iskustva.', '', 'center' )
	. hk_gumbi( array( array( 'Pregledaj izlete', '/izleti/' ), array( 'Upoznaj nas', '/o-nama/' ) ), true ), 80 );
$home .= hk_sekcija(
	hk_p( 'POPULARNI IZLETI', 'hk-oznaka', 'center' ) . hk_h( 'Istaknute avanture', 2, 'center' )
	. hk_p( 'Odaberi svoju sljedeću avanturu.', '', 'center' )
	. hk_shortcode( '[hikeit_izleti istaknuti="1" limit="3"]' )
	. hk_gumbi( array( array( 'Svi izleti', '/izleti/' ) ) ), '', 'izleti' );
$home .= hk_sekcija(
	hk_p( 'NAŠE PREDNOSTI', 'hk-oznaka', 'center' ) . hk_h( 'Zašto baš mi?', 2, 'center' )
	. hk_stupci( array(
		hk_kartica( 'Certificirani vodiči', 'Planinski i turistički vodiči s licencama i godinama terenske prakse.' ),
		hk_kartica( 'Sigurnost na prvom mjestu', 'Profesionalna oprema, osiguranje i protokoli za svaki izlet.' ),
		hk_kartica( 'Male grupe', 'Maksimalno 12 osoba po grupi — pravi doživljaj, ne masovni turizam.' ),
		hk_kartica( 'Autentično iskustvo', 'Lokalna znanja, skrivene staze i priče koje ne naći u vodiču.' ),
	) ), 'base-2' );
$home .= hk_naslovnica( $staza,
	hk_h( 'Spreman za avanturu?', 2, 'center' )
	. hk_p( 'Kontaktiraj nas i osmislimo tvoj savršeni izlet — prilagođen tebi, tvom tempu i tvojim snovima.', '', 'center' )
	. hk_gumbi( array( array( 'Kontaktiraj nas', '/kontakt/' ) ) )
	. hk_p( 'Online rezervacije stižu uskoro. Za sada nas kontaktiraj e-poštom ili telefonom.', '', 'center' ), 50, 65 );
hk_postavi_sadrzaj( 'pocetna', $home, $force );

/* ---------- O nama ---------- */
$onama  = hk_naslovnica( $staza,
	hk_p( 'NAŠA PRIČA', 'hk-oznaka', 'center' ) . hk_h( 'O nama', 1, 'center' )
	. hk_p( 'hikeIT.hr je nastao iz jednostavne ideje — dijeliti ljubav prema prirodi, kulturi i pustolovini s ljudima koji žele nešto više od prosječnog godišnjeg odmora.', '', 'center' ), 45, 65 );
$onama .= hk_sekcija( hk_stupci( array(
	hk_h( 'Kako je sve počelo', 2 )
	. hk_p( 'Dvoje prijatelja, zajednička ljubav prema planinama i moru, i uvjerenje da Hrvatska i regija nude nešto nevjerojatno — to je bio početak. Tomislav je godinama vodio planinare po Velebitu i Alpama, Ana je upoznavala putnike s tajnama dalmatinskih gradova i otoka.' )
	. hk_p( 'Jednog dana smo se pitali: zašto ne spojimo te dvije perspektive? Zašto ne napravimo agenciju koja nudi i visoko planinarenje i kulturne ture — sve s istom razinom strasti i profesionalnosti?' )
	. hk_p( 'Tako je nastao <strong>hikeIT.hr</strong> — mali, strastveni tim koji vjeruje da prava avantura mijenja ljude iznutra.' ),
	"<!-- wp:image {\"id\":$planina,\"sizeSlug\":\"large\",\"style\":{\"border\":{\"radius\":\"1rem\"}}} -->\n<figure class=\"wp-block-image size-large has-custom-border\"><img src=\"" . wp_get_attachment_url( $planina ) . "\" alt=\"Planinski pejzaž\" class=\"wp-image-$planina\" style=\"border-radius:1rem\"/></figure>\n<!-- /wp:image -->\n",
) ) );
$onama .= hk_sekcija( hk_h( 'Naše vrijednosti', 2, 'center' ) . hk_stupci( array(
	hk_kartica( 'Autentičnost', 'Skrivene staze, lokalna hrana, prave priče — bez turističkih klišeja i masovnih grupnih izleta.' ),
	hk_kartica( 'Strast', 'Volimo ono što radimo. I to se osjeti. Svaki izlet planiramo kao da ga organiziramo za sebe.' ),
	hk_kartica( 'Profesionalnost', 'Certifikati, iskustvo i oprema — sve da bi tvoja sigurnost i ugoda bili na prvom mjestu.' ),
) ), 'base-2' );
$onama .= hk_sekcija( hk_p( 'UPOZNAJ NAS', 'hk-oznaka', 'center' ) . hk_h( 'Naš tim', 2, 'center' ) . hk_shortcode( '[hikeit_vodici]' ) );
hk_postavi_sadrzaj( 'o-nama', $onama, $force, 'page-bez-naslova' );

/* ---------- Kontakt (+ CF7 forma) ---------- */
$forma = get_posts( array( 'post_type' => 'wpcf7_contact_form', 'title' => 'Kontakt', 'numberposts' => 1 ) );
if ( ! $forma && class_exists( 'WPCF7_ContactForm' ) ) {
	$f   = WPCF7_ContactForm::get_template( array( 'title' => 'Kontakt', 'locale' => 'hr' ) );
	$mail = $f->prop( 'mail' );
	$mail['recipient'] = 'info@hikeit.hr';
	$mail['subject']   = 'hikeIT upit: [tema]';
	$mail['sender']    = 'hikeIT <wordpress@hikeit.hr>';
	$mail['body']      = "Od: [ime] <[email]>\nTelefon: [telefon]\nTema: [tema]\n\n[poruka]";
	$mail['additional_headers'] = 'Reply-To: [email]';
	$poruke = $f->prop( 'messages' );
	$poruke['mail_sent_ok'] = 'Poruka poslana! Javit ćemo ti se u roku od 24 sata. Hvala na povjerenju!';
	$f->set_properties( array(
		'form'     => "<label>Ime i prezime *[text* ime autocomplete:name]</label>\n<label>E-mail *[email* email autocomplete:email]</label>\n<label>Telefon [tel telefon autocomplete:tel]</label>\n<label>Tema upita [select tema \"Rezervacija izleta\" \"Privatni / custom izlet\" \"Opće informacije\" \"Suradnja\" \"Web / softverska rješenja\" \"Ostalo\"]</label>\n<label>Poruka *[textarea* poruka]</label>\n[submit \"Pošalji poruku\"]",
		'mail'     => $mail,
		'messages' => $poruke,
	) );
	$f->save();
	WP_CLI::success( 'CF7 forma „Kontakt" stvorena' );
}
$kontakt  = hk_naslovnica( $planina, hk_p( 'DOĐI U KONTAKT', 'hk-oznaka', 'center' ) . hk_h( 'Kontakt', 1, 'center' ), 30, 65 );
$kontakt .= hk_sekcija( hk_stupci( array(
	hk_h( 'Pronađi nas', 2 ) . hk_shortcode( '[hikeit_postavke]' ),
	hk_h( 'Pošalji poruku', 2 ) . hk_shortcode( '[contact-form-7 title="Kontakt"]' ),
) ) );
hk_postavi_sadrzaj( 'kontakt', $kontakt, $force, 'page-bez-naslova' );

/* ---------- Razvoj (hikeit.dev) — NACRT TEKSTA, nije bilo na staroj stranici ---------- */
$razvoj  = hk_naslovnica( $staza,
	hk_p( 'WEB I PROGRAMSKA RJEŠENJA', 'hk-oznaka', 'center' ) . hk_h( 'Web stranice i aplikacije po mjeri', 1, 'center' )
	. hk_p( 'Od jednostavne stranice do aplikacije koja radi za tvoj posao — jasno, brzo i bez nepotrebnih troškova održavanja.', '', 'center' )
	. hk_gumbi( array( array( 'Pošalji upit', '/kontakt/' ) ) ), 70, 65 );
$razvoj .= hk_sekcija( hk_p( 'USLUGE', 'hk-oznaka', 'center' ) . hk_h( 'Što radimo', 2, 'center' ) . hk_stupci( array(
	hk_kartica( 'Web stranice', 'WordPress i prilagođene stranice koje možeš sam uređivati, s naglaskom na brzinu i SEO.' ),
	hk_kartica( 'Aplikacije po mjeri', 'Interni alati, integracije i web aplikacije prema tvojim procesima.' ),
	hk_kartica( 'Održavanje i podrška', 'Ažuriranja, sigurnosne kopije i razvoj novih mogućnosti nakon lansiranja.' ),
) ), 'base-2', 'usluge' );
hk_postavi_sadrzaj( 'razvoj', $razvoj, $force, 'page-bez-naslova' );

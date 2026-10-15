<?php
/**
 * Sadržaj statičnih stranica, preuzet iz React stranice (HomePage, AboutPage, ContactPage).
 * Pokretanje: wp eval-file bin/seed-stranice.php [force]
 * Ono što nije bilo na staroj stranici (hikeit.dev) označeno je u izvješću kao nacrt teksta.
 */
require_once __DIR__ . '/lib.php';
// Argumenti: `force` prepisuje sve stranice; ili popis slugova (npr. `razvoj kontakt`) samo te.
$sile  = $args ?? array();
$force = in_array( 'force', $sile, true );
$sili  = fn( $slug ) => $force || in_array( $slug, $sile, true );

$planina = hk_slika( 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85', 'Planinski pejzaž' );
$staza   = hk_slika( 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=80', 'Planinar na stazi' );

/* ---------- Početna ---------- */
$home  = hk_naslovnica( $planina,
	hk_p( 'PLANINSKI I TURISTIČKI IZLETI • HRVATSKA I REGIJA', 'hk-oznaka', 'center' )
	. hk_h( 'Svaki vrh ima svoju priču', 1, 'center' )
	. hk_p( 'Vodimo vas na mjesta gdje planine grle nebo, a more šapuće tajne. Profesionalni vodiči, male grupe, nezaboravna iskustva.', '', 'center' )
	. hk_gumbi( array( array( 'Pregledajte izlete', '/izleti/' ), array( 'Upoznajte nas', '/o-nama/' ) ), true ), 80 );
$home .= hk_sekcija(
	hk_p( 'POPULARNI IZLETI', 'hk-oznaka', 'center' ) . hk_h( 'Istaknute avanture', 2, 'center' )
	. hk_p( 'Odaberite svoju sljedeću avanturu.', '', 'center' )
	. hk_shortcode( '[hikeit_izleti istaknuti="1" limit="3"]' )
	. hk_gumbi( array( array( 'Svi izleti', '/izleti/' ) ) ), '', 'izleti' );
$home .= hk_sekcija(
	hk_p( 'NAŠE PREDNOSTI', 'hk-oznaka', 'center' ) . hk_h( 'Zašto baš mi?', 2, 'center' )
	. hk_stupci( array(
		hk_kartica( 'Certificirani vodiči', 'Planinski i turistički vodiči s licencama i godinama terenske prakse.' ),
		hk_kartica( 'Sigurnost na prvom mjestu', 'Profesionalna oprema, osiguranje i protokoli za svaki izlet.' ),
		hk_kartica( 'Male grupe', 'Maksimalno 12 osoba po grupi — pravi doživljaj, ne masovni turizam.' ),
		hk_kartica( 'Autentično iskustvo', 'Lokalna znanja, skrivene staze i priče koje ne naći u vodiču.' ),
	) ) );
$home .= hk_naslovnica( $staza,
	hk_h( 'Spremni za avanturu?', 2, 'center' )
	. hk_p( 'Kontaktirajte nas i osmislit ćemo vaš savršeni izlet — prilagođen vama, vašem tempu i vašim željama.', '', 'center' )
	. hk_gumbi( array( array( 'Kontaktirajte nas', '/kontakt/' ) ) )
	. hk_p( 'Online rezervacije stižu uskoro. Za sada nas kontaktirajte e-poštom ili telefonom.', '', 'center' ), 50, 65 );
hk_postavi_sadrzaj( 'pocetna', $home, $sili( 'pocetna' ) );

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
	hk_kartica( 'Profesionalnost', 'Certifikati, iskustvo i oprema — sve da bi vaša sigurnost i ugoda bili na prvom mjestu.' ),
) ) );
$onama .= hk_sekcija( hk_p( 'UPOZNAJTE NAS', 'hk-oznaka', 'center' ) . hk_h( 'Naš tim', 2, 'center' ) . hk_shortcode( '[hikeit_vodici]' ) );
hk_postavi_sadrzaj( 'o-nama', $onama, $sili( 'o-nama' ), 'page-bez-naslova' );

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
	$poruke['mail_sent_ok'] = 'Poruka poslana! Javit ćemo vam se u roku od 24 sata. Hvala na povjerenju!';
	$f->set_properties( array(
		'form'     => "<label>Ime i prezime *[text* ime autocomplete:name]</label>\n<label>E-mail *[email* email autocomplete:email]</label>\n<label>Telefon [tel telefon autocomplete:tel]</label>\n<label>Tema upita [select tema \"Rezervacija izleta\" \"Privatni / custom izlet\" \"Opće informacije\" \"Suradnja\" \"Web / softverska rješenja\" \"Ostalo\"]</label>\n<label>Poruka *[textarea* poruka]</label>\n[submit \"Pošaljite poruku\"]",
		'mail'     => $mail,
		'messages' => $poruke,
	) );
	$f->save();
	WP_CLI::success( 'CF7 forma „Kontakt" stvorena' );
}
$dev_forma = get_posts( array( 'post_type' => 'wpcf7_contact_form', 'title' => 'Kontakt razvoj', 'numberposts' => 1 ) );
if ( ! $dev_forma && class_exists( 'WPCF7_ContactForm' ) ) {
	$f    = WPCF7_ContactForm::get_template( array( 'title' => 'Kontakt razvoj', 'locale' => 'hr' ) );
	$mail = $f->prop( 'mail' );
	$mail['recipient'] = 'info@hikeit.hr';
	$mail['subject']   = 'hikeit.dev upit: [vrsta]';
	$mail['sender']    = 'hikeit.dev <wordpress@hikeit.hr>';
	$mail['body']      = "Od: [ime] <[email]>\nVrsta projekta: [vrsta]\n\n[poruka]";
	$mail['additional_headers'] = 'Reply-To: [email]';
	$poruke = $f->prop( 'messages' );
	$poruke['mail_sent_ok'] = 'Hvala! Javit ćemo vam se u roku od 1–2 radna dana.';
	$f->set_properties( array(
		'form'     => "<label>Ime i prezime *[text* ime autocomplete:name]</label>\n<label>E-mail *[email* email autocomplete:email]</label>\n<label>Što trebate? [select vrsta \"Web stranica\" \"Web trgovina\" \"Aplikacija po mjeri\" \"Održavanje postojeće stranice\" \"Nešto drugo\"]</label>\n<label>Opišite projekt *[textarea* poruka]</label>\n[submit \"Pošaljite upit\"]",
		'mail'     => $mail,
		'messages' => $poruke,
	) );
	$f->save();
	WP_CLI::success( 'CF7 forma „Kontakt razvoj" stvorena' );
}
$kontakt  = hk_naslovnica( $planina, hk_p( 'JAVITE NAM SE', 'hk-oznaka', 'center' ) . hk_h( 'Kontakt', 1, 'center' ), 30, 65 );
$kontakt .= hk_sekcija( hk_stupci( array(
	hk_h( 'Pronađite nas', 2 ) . hk_shortcode( '[hikeit_postavke]' ),
	hk_h( 'Pošaljite poruku', 2 ) . hk_shortcode( '[hikeit_kontakt_forma]' ),
) ) );
hk_postavi_sadrzaj( 'kontakt', $kontakt, $sili( 'kontakt' ), 'page-bez-naslova' );

/* ---------- Razvoj (hikeit.dev) — PRIJEDLOG TEKSTOVA: cijene, ciljna skupina i opis osobe su za potvrdu ---------- */
$snimka  = hk_slika_datoteka( __DIR__ . '/../seed-slike/pd-pinklec.jpg', 'Stranica PD Pinklec' );
$vodic   = get_posts( array( 'post_type' => 'vodic', 'numberposts' => 1, 'orderby' => 'ID', 'order' => 'ASC' ) );
$portret = hk_slika_datoteka( __DIR__ . '/../seed-slike/portret.jpg', 'Tomislav Jurinec' ) ?: ( $vodic ? get_post_thumbnail_id( $vodic[0]->ID ) : 0 ); // dodaj datoteku pa pokreni seed, ili postavi sliku u adminu

$razvoj  = hk_tamna( hk_stupci( array(
	hk_p( 'WEB I SOFTVERSKA RJEŠENJA · ZAGREB', 'hk-oznaka' ) . hk_h( 'Web stranice za male obrte, udruge i agencije', 1 )
	. hk_p( 'Napravit ću vam stranicu koju možete sami uređivati, s jasnom cijenom prije početka rada. Bez agencijskih cijena i bez nepotrebne složenosti.' )
	. hk_gumbi( array( array( 'Pošaljite upit', '/kontakt/' ), array( 'Pogledajte usluge', '/usluge/' ) ), true, 'left' ),
	$snimka ? hk_prozor( $snimka, 'Primjer: web stranica planinarskog društva' ) : '',
) ) );
$razvoj .= hk_sekcija( hk_p( 'ZA KOGA RADIM', 'hk-oznaka', 'center' ) . hk_h( 'Mali timovi s jasnom potrebom', 2, 'center' ) . hk_stupci( array(
	hk_kartica( 'Obrti i male tvrtke', 'Stranica koja vas predstavlja, prikuplja upite i na kojoj sami mijenjate tekstove i cijene.' ),
	hk_kartica( 'Udruge i društva', 'Najave događanja, izvještaji, galerije i članovi na jednom mjestu. Napravio sam stranicu za planinarsko društvo.' ),
	hk_kartica( 'Turističke agencije', 'Izleti, galerije, upiti i, kad dođe vrijeme, online plaćanje. Napravio sam stranicu za turističku agenciju.' ),
) ) );
$razvoj .= hk_sekcija( hk_p( 'USLUGE', 'hk-oznaka', 'center' ) . hk_h( 'Što radim', 2, 'center' ) . hk_stupci( array(
	hk_kartica_usluge( 'Web stranice', 'WordPress stranica koju možete sami uređivati, prilagođena mobitelu i tražilicama.', 'od 590 €', '/usluge/web-stranice/' ),
	hk_kartica_usluge( 'Aplikacije po mjeri', 'Interni alati, integracije i web aplikacije prema vašim procesima.', 'po dogovoru', '/usluge/aplikacije-po-mjeri/' ),
	hk_kartica_usluge( 'Održavanje', 'Ažuriranja, sigurnosne kopije i manje izmjene, da stranica ostane brza i sigurna.', 'od 30 € mjesečno', '/usluge/odrzavanje/' ),
) ) . hk_p( 'Cijene su orijentacijske. Točnu ponudu dobit ćete nakon kratkog razgovora, prije početka rada.', 'hk-biljeska', 'center' ), '', 'usluge' );
$razvoj .= hk_sekcija( hk_p( 'KAKO RADIM', 'hk-oznaka', 'center' ) . hk_h( 'Od upita do lansiranja', 2, 'center' ) . hk_stupci( array(
	hk_kartica( '1. Razgovor', 'Kratko pojasnite što trebate i što želite postići. Bez obveze.' ),
	hk_kartica( '2. Ponuda', 'Jasan opseg, rok i cijena prije početka rada.' ),
	hk_kartica( '3. Izrada', 'Gradim u koracima i redovito vam pokazujem napredak.' ),
	hk_kartica( '4. Lansiranje', 'Pokrećem stranicu, educiram vas i ostajem na raspolaganju.' ),
) ) );
$razvoj .= hk_sekcija( hk_shortcode( '[hikeit_reference]' ) );
$tko_tekst = hk_p( 'TKO STOJI IZA', 'hk-oznaka' ) . hk_h( 'Zovem se Tomislav', 2 )
	. hk_p( 'Programiram i radim web stranice za male organizacije — od planinarskog društva do turističke agencije. Stranice pišem na WordPressu jer ih tako možete sami uređivati, a kad treba nešto što WordPress ne zna, napišem to po mjeri.' )
	. hk_p( 'Sa mnom razgovarate izravno, bez posrednika. Sve što vidite na hikeit.hr i hikeit.dev napravio sam sam.' )
	. hk_p( '<a href="/o-meni/">Više o meni →</a>' );
$razvoj .= hk_sekcija( hk_s_portretom( $portret, $tko_tekst ) );
$razvoj .= hk_tamna( hk_h( 'Imate projekt na umu?', 2, 'center' ) . hk_p( 'Opišite ga u nekoliko rečenica i javit ću vam se u roku od 1–2 radna dana.', '', 'center' ) . hk_gumbi( array( array( 'Pošaljite upit', '/kontakt/' ) ) ) );
hk_postavi_sadrzaj( 'razvoj', $razvoj, $sili( 'razvoj' ), 'page-bez-naslova' );
hk_seo( 'razvoj', 'Izrada web stranica i aplikacija | hikeIT', 'Izrada web stranica na WordPressu i aplikacija po mjeri za male obrte, udruge i turističke agencije. Jasna cijena prije početka rada.' );

/* ---------- O meni (hikeit.dev) — PRIJEDLOG TEKSTA; stručnosti su izvedene iz tehnologija u ovim projektima, provjeri ih ---------- */
$linkedin = 'https://www.linkedin.com/in/tomislav-jurinec-a376aaa5/';
if ( $kontakt_str = get_page_by_path( 'kontakt' ) ) {
	if ( ! get_post_meta( $kontakt_str->ID, 'linkedin', true ) ) {
		update_field( 'linkedin', $linkedin, $kontakt_str->ID );
	}
}
hk_stranica_ili_nova( 'o-meni', 'O meni' );
$ometi = hk_sekcija( hk_s_portretom( $portret,
	hk_p( 'O MENI', 'hk-oznaka' ) . hk_h( 'Tomislav Jurinec', 1 )
	. hk_p( 'Programer sam i web stranice radim za male organizacije — od planinarskog društva do turističke agencije.' )
	. hk_p( 'Zanima me da stvari rade jednostavno: da stranicu možete sami uređivati, da je brza i da vas ne košta više nego što mora. Kad treba nešto što gotovo rješenje ne zna, napišem to po mjeri.' )
	. hk_p( 'Izvan ekrana planinarim, penjem ferrate i bavim se ljetnim alpinizmom — otud i ime hikeIT.' )
	. hk_gumbi( array( array( 'Moj LinkedIn profil', $linkedin ), array( 'Pošaljite upit', '/kontakt/' ) ), true, 'left' ) ) );
$ometi .= hk_sekcija( hk_p( 'STRUČNOSTI', 'hk-oznaka', 'center' ) . hk_h( 'Čime se bavim', 2, 'center' ) . hk_stupci( array(
	hk_kartica( 'Web stranice', 'WordPress: vlastite teme i blokovi, prilagođena polja, WP-CLI i selidbe sadržaja između sustava.' ),
	hk_kartica( 'Aplikacije po mjeri', 'Kotlin i Spring Boot na poslužitelju, React i TypeScript u pregledniku, PostgreSQL i verzionirane migracije baze.' ),
	hk_kartica( 'Infrastruktura', 'Docker, deploy i hosting (Render, Cloudflare), sigurnosne kopije i e-pošta (SMTP).' ),
	hk_kartica( 'Kvaliteta', 'Git, testovi i pregled koda — da ono što isporučim radi i nakon prve izmjene.' ),
) ) );
$ometi .= hk_sekcija( hk_p( 'NAČIN RADA', 'hk-oznaka', 'center' ) . hk_h( 'Što to znači za vas', 2, 'center' ) . hk_lista( array(
	'Razgovarate izravno sa mnom, bez posrednika',
	'Jasna ponuda prije početka rada: opseg, rok i cijena',
	'Stranicu možete sami uređivati — ne ovisite o meni za svaku sitnicu',
	'Sve je pod kontrolom verzija i sigurnosnih kopija, pa se promjene mogu vratiti',
) ) );
$ometi .= hk_tamna( hk_h( 'Imate projekt na umu?', 2, 'center' ) . hk_p( 'Opišite ga u nekoliko rečenica i javit ću vam se u roku od 1–2 radna dana.', '', 'center' ) . hk_gumbi( array( array( 'Pošaljite upit', '/kontakt/' ) ) ) );
hk_postavi_sadrzaj( 'o-meni', $ometi, $sili( 'o-meni' ), 'page-bez-naslova' );
hk_seo( 'o-meni', 'O meni — Tomislav Jurinec | hikeIT', 'Tomislav Jurinec: programer i izrada web stranica na WordPressu i aplikacija po mjeri za male obrte, udruge i turističke agencije u Zagrebu.' );

/* ---------- Usluge: pregled i tri stranice (SEO: svaka usluga ima svoj URL) ---------- */
$usluge_stranice = array(
	'usluge' => array(
		'Usluge', 'Usluge: web stranice, aplikacije i održavanje | hikeIT',
		'Izrada web stranica, aplikacije po mjeri i održavanje WordPress stranica. Orijentacijske cijene i jasna ponuda prije početka rada.',
		hk_sekcija( hk_p( 'USLUGE', 'hk-oznaka', 'center' ) . hk_h( 'Što radim', 1, 'center' )
			. hk_p( 'Tri stvari koje radim najčešće. Za sve je prvi korak kratki razgovor, bez obveze.', '', 'center' )
			. hk_stupci( array(
				hk_kartica_usluge( 'Web stranice', 'WordPress stranica koju možete sami uređivati, prilagođena mobitelu i tražilicama.', 'od 590 €', '/usluge/web-stranice/' ),
				hk_kartica_usluge( 'Aplikacije po mjeri', 'Interni alati, integracije i web aplikacije prema vašim procesima.', 'po dogovoru', '/usluge/aplikacije-po-mjeri/' ),
				hk_kartica_usluge( 'Održavanje', 'Ažuriranja, sigurnosne kopije i manje izmjene, da stranica ostane brza i sigurna.', 'od 30 € mjesečno', '/usluge/odrzavanje/' ),
			) ) . hk_p( 'Cijene su orijentacijske. Točnu ponudu dobit ćete nakon kratkog razgovora, prije početka rada.', '', 'center' )
			. hk_gumbi( array( array( 'Pošaljite upit', '/kontakt/' ) ) ) ),
	),
	'usluge/web-stranice' => array(
		'Izrada web stranica (WordPress)', 'Izrada web stranica na WordPressu, Zagreb | od 590 € | hikeIT',
		'Izrada web stranice na WordPressu za male obrte, udruge i turističke agencije u Zagrebu i šire. Stranica koju možete sami uređivati, od 590 €.',
		hk_sekcija( hk_p( 'USLUGE', 'hk-oznaka', 'center' ) . hk_h( 'Izrada web stranica (WordPress)', 1, 'center' )
			. hk_p( 'Stranica koja izgleda dobro na mobitelu, brzo se učitava i koju možete sami uređivati — bez posebnog plaćanja svake sitnice.', '', 'center' )
			. hk_h( 'Što dobivate', 2, 'center' )
			. hk_lista( array( 'Stranicu na WordPressu prilagođenu mobitelu, tabletu i računalu', 'Osnovnu SEO optimizaciju (naslovi, opisi, brzina, karta stranice)', 'Kontakt formu koja šalje upite na vašu e-poštu', 'Upute za uređivanje i kratku edukaciju, da sami mijenjate sadržaj', 'Po želji: blog, galerije, kalendar događanja ili izleta' ) )
			. hk_h( 'Cijena', 2, 'center' )
			. hk_p( 'Jednostavna stranica (do 5 podstranica) <strong>od 590 €</strong>. Stranica s dodacima (blog, galerije, najave događanja, upiti) <strong>od 1.200 €</strong>. Točnu cijenu dobit ćete u ponudi prije početka rada.', '', 'center' )
			. hk_p( 'Primjere pogledajte među <a href="/reference/">referencama</a>.', '', 'center' )
			. hk_gumbi( array( array( 'Pošaljite upit', '/kontakt/' ) ) ) ),
	),
	'usluge/aplikacije-po-mjeri' => array(
		'Aplikacije i integracije po mjeri', 'Web aplikacije i integracije po mjeri | hikeIT',
		'Izrada web aplikacija, internih alata i integracija po mjeri za male tvrtke i udruge. Cijena po dogovoru, jasna ponuda prije početka rada.',
		hk_sekcija( hk_p( 'USLUGE', 'hk-oznaka', 'center' ) . hk_h( 'Aplikacije i integracije po mjeri', 1, 'center' )
			. hk_p( 'Kad gotovo rješenje ne odgovara vašem procesu, napišem ono koje odgovara.', '', 'center' )
			. hk_h( 'Što radim', 2, 'center' )
			. hk_lista( array( 'Interne alate: evidencije, narudžbe, rezervacije, izvještaji', 'Integracije između stranice i drugih sustava (e-pošta, plaćanje, kalendari)', 'Web aplikacije s prijavom korisnika i ulogama', 'Prebacivanje postojećih sustava na jednostavnije i jeftinije za održavanje' ) )
			. hk_h( 'Cijena', 2, 'center' )
			. hk_p( 'Cijena ovisi o opsegu pa je <strong>po dogovoru</strong>. Nakon razgovora dobit ćete ponudu s opsegom, rokom i cijenom, prije nego išta počnem raditi.', '', 'center' )
			. hk_gumbi( array( array( 'Opišite svoj projekt', '/kontakt/' ) ) ) ),
	),
	'usluge/odrzavanje' => array(
		'Održavanje web stranica', 'Održavanje WordPress stranica | od 30 € mjesečno | hikeIT',
		'Održavanje WordPress stranica: ažuriranja, sigurnosne kopije, nadzor i manje izmjene sadržaja. Od 30 € mjesečno.',
		hk_sekcija( hk_p( 'USLUGE', 'hk-oznaka', 'center' ) . hk_h( 'Održavanje web stranica', 1, 'center' )
			. hk_p( 'Stranica koja se ne održava postaje spora i nesigurna. Brinem se da ostane brza, sigurna i ažurna.', '', 'center' )
			. hk_h( 'Što je uključeno', 2, 'center' )
			. hk_lista( array( 'Redovita ažuriranja WordPressa, teme i dodataka', 'Sigurnosne kopije i provjera da se mogu vratiti', 'Nadzor dostupnosti i sigurnosti', 'Manje izmjene sadržaja po dogovoru' ) )
			. hk_h( 'Cijena', 2, 'center' )
			. hk_p( 'Od <strong>30 € mjesečno</strong>, ovisno o veličini stranice i opsegu izmjena.', '', 'center' )
			. hk_gumbi( array( array( 'Pošaljite upit', '/kontakt/' ) ) ) ),
	),
);
foreach ( $usluge_stranice as $putanja => [ $naslov, $seo_naslov, $seo_opis, $sadrzaj ] ) {
	$sl = explode( '/', $putanja );
	hk_stranica_ili_nova( $putanja, $naslov );
	hk_postavi_sadrzaj( $putanja, $sadrzaj, $sili( end( $sl ) ) || $sili( $putanja ), 'page-bez-naslova' );
	hk_seo( $putanja, $seo_naslov, $seo_opis );
}

/* ---------- Reference: nacrti (objavi ih u adminu kad ih potvrdiš) ---------- */
foreach ( array(
	array( 'hikeit.hr', 'Turistička agencija: izleti, galerije, blog i kontakt forma na WordPressu.', 'https://hikeit.hr', 'WordPress, PHP, MariaDB', 'hikeit-hr.jpg' ),
	array( 'PD Pinklec', 'Stranica planinarskog društva: najave izleta, izvještaji, škole, oružarstvo i uloge članova.', 'https://novi.pd-pinklec.hr', 'WordPress, PHP, MariaDB', 'pd-pinklec.jpg' ),
) as $i => [ $naslov, $opis, $adresa, $teh, $slika ] ) {
	$postojeca = get_posts( array( 'post_type' => 'referenca', 'post_status' => 'any', 'title' => $naslov, 'numberposts' => 1, 'fields' => 'ids' ) );
	if ( ! $postojeca ) {
		$id = wp_insert_post( array( 'post_type' => 'referenca', 'post_status' => 'draft', 'post_title' => $naslov, 'post_excerpt' => $opis, 'menu_order' => $i ) );
		update_field( 'adresa', $adresa, $id );
		update_field( 'tehnologije', $teh, $id );
		WP_CLI::log( "referenca (nacrt): $naslov" );
	} else {
		$id = $postojeca[0];
	}
	if ( ! has_post_thumbnail( $id ) && ( $sl = hk_slika_datoteka( __DIR__ . "/../seed-slike/$slika", $naslov ) ) ) {
		set_post_thumbnail( $id, $sl );
	}
}

/* ---------- Reference (portfolio, hikeit.dev) ---------- */
$ref = hk_sekcija(
	hk_p( 'PORTFOLIO', 'hk-oznaka', 'center' ) . hk_h( 'Reference', 1, 'center' )
	. hk_p( 'Stranice i aplikacije koje smo napravili.', '', 'center' )
	. hk_shortcode( '[hikeit_reference limit="50" naslov="0" prazno="Reference uskoro."]' )
	. hk_gumbi( array( array( 'Pošaljite upit', '/kontakt/' ) ) ) );
hk_postavi_sadrzaj( 'reference', $ref, $sili( 'reference' ), 'page-bez-naslova' );

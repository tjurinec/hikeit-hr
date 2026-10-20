# hikeIT — što još moramo napraviti

Stanje (16. 10. 2026.): nova WordPress stranica je javno na `hikeit.hr` (agencija) i `dev.hikeit.hr` (razvoj, kasnije `hikeit.dev`),
hosting MyDataKnox KNOX L, sandučić `info@hikeit.hr`. Ispod je ono što ostaje — prvo poslovni dio, zatim tehnički.

## 1. Poslovno i pravno (prije prodaje izleta)

### 1.1 Što je potrebno za izlete: sportski obrt ili turistička agencija?
Ovo treba potvrditi **prije** nego se izleti stvarno naplaćuju. Ne pretpostavljamo odgovor, nego pitamo:
- [ ] Kontaktirati **Ministarstvo turizma i sporta** (e-poštom, s pisanim odgovorom) i pitati:
  - Smijemo li organizirati i naplaćivati planinarske/ferrata izlete s vodičem kao **obrt (sportsko-rekreacijske usluge)**, ili je to već
    **organiziranje putovanja** pa je potrebna **turistička agencija**?
  - Koja se **djelatnost** (NKD) mora dodatno upisati ako ostajemo obrt?
  - Što mijenja prijevoz grupe (kombi), noćenje ili obroci u cijeni (paket-aranžman)?
  - Kakvo **osiguranje** (od odgovornosti, nezgode putnika) i **jamstvo** je obavezno za agenciju?
  - Što se traži od **vodiča** (planinarski vodič HPS-a, licence, prva pomoć)?
- [ ] Ista pitanja uputiti **obrtničkoj komori / HGK** i knjigovođi (da se čuje i porezna strana).
- [ ] Do odgovora: izleti na stranici ostaju kao najava ("uskoro"), bez online plaćanja i bez tvrdnji tipa "licencirani vodiči" koje ne možemo dokazati.

### 1.2 Obrt ili firma (d.o.o. / j.d.o.o.)
- [ ] Odlučiti **ostajemo li na obrtu** ili otvaramo **firmu**. Ako treba turistička agencija, firma je vjerojatno prirodniji oblik.
- [ ] Razmotriti prednosti firme: odvojena odgovornost, mogućnost da **i dnevni posao** (konzalting/razvoj) fakturiramo preko iste firme;
  nedostaci: veći troškovi vođenja, osnivački kapital, administracija.
- [ ] Provjeriti **ugovor o radu na dnevnom poslu** (zabrana konkurencije, dopunski rad, suglasnost poslodavca) prije bilo kakvog fakturiranja drugdje.
- [ ] Razgovor s **knjigovođom i poreznim savjetnikom**: paušal ili dohodak, ulazak u PDV, doprinosi, kad se isplati prijeći na firmu.
- [ ] Ako se mijenja pravni oblik: ažurirati račune kod MyDataKnoxa (račun za hosting na **naziv obrta/firme i OIB**, ne na fizičku osobu),
  podatke u podnožju stranice, uvjete korištenja i politiku privatnosti.

### 1.3 Način poslovanja i oprema
- [ ] **Prijevoz:** najam kombija vs. kupnja — trošak po izletu, osiguranje, kategorija vozačke, kapacitet (8+1), održavanje; izračun točke isplativosti.
- [ ] **Majice i merch:** dizajn s logom (šahovnica 2×2), dobavljač i minimalna količina, cijena po komadu, prodaja ili poklon sudionicima.
- [ ] **Cijene izleta:** što je uključeno (vodič, prijevoz, osiguranje, hrana), marža, broj sudionika (min./maks.), otkazni uvjeti.
- [ ] **Opći uvjeti** putovanja, otkazivanje, odgovornost, zdravstvena izjava sudionika (nacrt s pravnikom).
- [ ] **Online plaćanje** (WooCommerce + hrvatski gateway) — tek kad je pravni oblik riješen; vidi `PLAN.md` §7.

## 2. Društvene mreže i marketing
- [ ] Napraviti **Instagram** i **Facebook** stranicu za hikeIT (isto ime/handle na obje; logo kao profilna slika, hero fotografija kao naslovna).
- [ ] Upisati adrese u **upravljanje → Kontakt podaci** (polja Instagram i Facebook) — pojavit će se u podnožju i na Kontaktu.
- [ ] Prvih ~9 objava iz naših fotografija (mozaik "Trenuci s terena"), jedna objava tjedno do prvog izleta.
- [ ] **Google Business Profile** (Maps) za `info@hikeit.hr`; poveznica na stranicu.
- [ ] **Search Console:** potvrđeno vlasništvo domene, poslati `https://hikeit.hr/sitemap_index.xml` i `https://dev.hikeit.hr/sitemap_index.xml`.
- [ ] Open Graph slika (pregled poveznice kad se dijeli na društvenim mrežama).

## 3. Sadržaj stranice
- [ ] Napraviti **3–5 stvarnih izleta** u upravljanju (`/upravljanje/izleti/`): naslov, opis, težina, trajanje, cijena, najviše sudionika, polazište,
  datum, vodič, 8–10 slika, oznake. Probni izlet "Stol za Paulu" je obrisan.
- [ ] Provjeriti tvrdnju u tekstovima: "certificirani vodiči" (na stranici je samo jedan vodič). "Max 12 osoba" i tekst o Ani uklonjeni.
- [ ] Dopuniti galerije opisima slika i imenima mjesta (sada su opisi općeniti).
- [ ] Potvrditi cijene na dev stranici (od 590 € / 1.200 € / 30 € mjesečno su bili prijedlog) i reference.
- [ ] Pravne stranice: **politika privatnosti** (forma prikuplja podatke), **kolačići/analitika** ako se uključi, **uvjeti korištenja**.

## 4. Tehničko
- [x] **Prva prijava i 2FA** na `https://hikeit.hr/prijava/` (16. 10. 2026.).
- [ ] Provjeriti: lozinka administratora promijenjena, rezervni kodovi spremljeni, napravljen korisnik za urednika (rola Editor).
- [ ] U **Upiti** obrisati probne poruke (PROBNI UPIT, TEST PREUSMJERAVANJA).
- [ ] **Gmail "Send mail as"** za `info@hikeit.hr` (SMTP `mail.hikeit.hr:465`, SSL) u poslovnom Gmailu; filter da poruke ne idu u neželjenu poštu.
- [ ] Obrisati **cPanel API token**, **SSH ključ** (`~/.ssh/hikeit_mdk`) i Cloudflare token (ako još postoji).
- [ ] **Registrirati `hikeit.dev`**, u `hosts.php` promijeniti `$dev_domena`, dodati alias domene u cPanel i prebaciti DNS (upute u `wordpress/PRELAZAK.md`).
- [ ] **Poruke sa stare stranice** izvući iz admina stare aplikacije i arhivirati (CSV), prije gašenja.
- [ ] Nakon 1–2 tjedna mirnog rada ugasiti **Render** (backend, frontend, baza), **Cloudflare R2** (bucket + API tokeni), GitHub deploy hookove.
- [ ] Spojiti granu `wordpress-migracija` u `main`, staru React/Kotlin aplikaciju označiti tagom `pre-wordpress` i ukloniti iz repozitorija.
- [ ] Provjeriti **sigurnosne kopije** (MyDataKnox dnevni backup) i probati vratiti jednu stranicu.
- [ ] Uključiti **LiteSpeed Cache** (plugin je instaliran, ne aktivan) i izmjeriti brzinu.
- [ ] Podsjetnici: obnova hostinga **15. 10. 2027.** (38,51 € + PDV), obnova domena, istek promo cijene.

# Vrh & Put — Plan razvoja i pokretanja

## Sadržaj

1. [Tehnička arhitektura](#1-tehnička-arhitektura)
2. [Lokalni razvoj](#2-lokalni-razvoj)
3. [GitHub — verzioniranje koda](#3-github--verzioniranje-koda)
4. [Demo deployment — Render (besplatno)](#4-demo-deployment--render-besplatno)
5. [Plan produkcijskog deploymenta](#5-plan-produkcijskog-deploymenta)
6. [Osnivanje obrta / tvrtke u Hrvatskoj](#6-osnivanje-obrta--tvrtke-u-hrvatskoj)
7. [Pravne obveze za turističku agenciju](#7-pravne-obveze-za-turističku-agenciju)
8. [Financijski plan i troškovi](#8-financijski-plan-i-troškovi)

---

## 1. Tehnička arhitektura

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐    JDBC    ┌──────────────┐
│  React Frontend │ ──────────────► │  Spring Boot     │ ─────────► │  PostgreSQL  │
│  (Vite + TS)    │                 │  (Kotlin, JPA)   │            │  (Docker)    │
│  Tailwind CSS   │                 │  port 8080        │            │  port 5433   │
│  port 5175      │                 │                  │            │              │
└─────────────────┘                 └──────────────────┘            └──────────────┘
```

### Tehnologije

| Sloj | Tehnologija | Verzija |
|------|-------------|---------|
| Frontend | React + TypeScript | 19 / 5 |
| Build tool | Vite | 6 |
| Stilovi | Tailwind CSS | 4 |
| Routing | React Router | 7 |
| Backend | Spring Boot + Kotlin | 3.4 / 2.1 |
| ORM | Hibernate / JPA | 6.6 |
| Migracije | Flyway | 11 |
| Baza podataka | PostgreSQL | 16 |
| Kontejner baze | Docker / Docker Compose | - |

---

## 2. Lokalni razvoj

### Preduvjeti

- Node.js 20+ i npm
- Java 21 (Zulu / OpenJDK)
- Maven 3.9+
- Docker + Docker Compose

### Pokretanje

```bash
# 1. Pokrenuti PostgreSQL bazu
cd turisticka/
docker compose up -d

# 2. Pokrenuti backend (automatski aplicira Flyway migracije i seed podatke)
cd backend/
mvn spring-boot:run

# 3. Pokrenuti frontend (u novom terminalu)
cd frontend/
npm install
npm run dev
```

Frontend: http://localhost:5175  
Backend API: http://localhost:8080/api

### Dostupni API endpointi

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/excursions` | Svi objavljeni izleti |
| GET | `/api/excursions?q=velebit` | Pretraga izleta |
| GET | `/api/excursions/featured` | Istaknuti izleti |
| GET | `/api/excursions/{slug}` | Detalji pojedinog izleta |
| GET | `/api/gallery` | Sve galerijske slike |
| GET | `/api/gallery?category=planine` | Slike po kategoriji |

---

## 3. GitHub — verzioniranje koda

### Postavljanje repozitorija

```bash
# 1. Idi na github.com → New repository
#    Naziv: vrhiput  (ili vrh-i-put)
#    Vidljivost: Private (samo vi dvoje vidite kod)
#    NE inicijaliziraj s README (već imamo kod)

# 2. Lokalno — inicijaliziraj git i pushaj
cd /home/tomislav/Documents/turisticka
git init
git add .
git commit -m "feat: initial project setup"
git branch -M main
git remote add origin https://github.com/TVOJ_USERNAME/vrhiput.git
git push -u origin main
```

### Dodati suradnika (Ana)

1. GitHub → repozitorij → **Settings → Collaborators → Add people**
2. Upiši Anin GitHub username ili email
3. Ana prihvati poziv u emailu
4. Ana klonira: `git clone https://github.com/TVOJ_USERNAME/vrhiput.git`

### Osnovna git pravila za vas dvoje

```bash
# Uvijek povuci najnovije promjene prije rada
git pull origin main

# Napravi promjene, pa:
git add .
git commit -m "opis što si promijenio"
git push origin main
```

> **Napomena:** `.gitignore` je već postavljen — lozinke, `node_modules` i build folderi se ne pushaju na GitHub.

---

## 4. Demo deployment — Render (besplatno)

**Render.com** je idealan za demo — besplatan plan uključuje web servis i PostgreSQL bazu.  
Savršeno za pokazati stranicu prijateljima, investitorima ili samima sebi s mobilnog.

> **Besplatni plan ograničenja:** backend "zaspi" nakon 15 min neaktivnosti (prvo učitavanje ~30s).  
> Za ozbiljniji rad → plaćeni plan (~7 $/mj) ili Railway (vidi dolje).

### Korak 1 — Priprema koda za Render

Backend treba čitati konfiguraciju iz environment varijabli (već podržano kroz Spring Boot):

U `backend/src/main/resources/application.yml` dodaj profil za produkciju:

```yaml
# application-prod.yml  (novi file)
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
app:
  cors:
    allowed-origins: ${FRONTEND_URL}
```

Frontend treba znati URL backenda:

```bash
# frontend/.env.production  (novi file)
VITE_API_URL=https://tvoj-backend.onrender.com
```

### Korak 2 — Postavljanje na Render

#### A) PostgreSQL baza (Render managed DB)

1. Idi na [render.com](https://render.com) → **New → PostgreSQL**
2. Naziv: `vrhiput-db`
3. Plan: **Free**
4. Klikni **Create Database**
5. Spremi `Internal Database URL` — trebat će za backend

#### B) Backend (Spring Boot)

1. **New → Web Service**
2. Spoji GitHub repozitorij
3. Postavke:
   - **Root Directory:** `backend`
   - **Build Command:** `mvn package -DskipTests`
   - **Start Command:** `java -Dspring.profiles.active=prod -jar target/*.jar`
4. Environment varijable (Add Environment Variable):
   ```
   DATABASE_URL     = <Internal Database URL s koraka A>
   DB_USER          = <korisnik baze>
   DB_PASSWORD      = <lozinka baze>
   FRONTEND_URL     = https://tvoj-frontend.onrender.com
   ```
5. Klikni **Create Web Service**

#### C) Frontend (React)

1. **New → Static Site**
2. Spoji isti GitHub repozitorij
3. Postavke:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Environment varijable:
   ```
   VITE_API_URL = https://tvoj-backend.onrender.com
   ```
5. Klikni **Create Static Site**

#### D) Rezultat

Nakon ~5 minuta buildanja imat ćeš:
- Frontend: `https://vrhiput.onrender.com`
- Backend API: `https://vrhiput-api.onrender.com/api`
- Baza: Render managed PostgreSQL (besplatno, 1 GB)

### Alternativa: Railway.app

Railway je nešto brži od Rendera i ne "zaspi". Besplatni plan: 5 $/mj kredita (obično dosta za demo).

```
railway.app → New Project → Deploy from GitHub repo
→ Add PostgreSQL plugin
→ Postavi env varijable
→ Deploy
```

---

## 5. Plan produkcijskog deploymenta

### Faza 1 — Priprema domene i infrastrukture

- [ ] Registracija domene `vrhiput.hr` ili `vrh-i-put.hr` na [Domains.hr](https://www.domains.hr) ili [CARNET](https://www.carnet.hr) (~15 €/god)
- [ ] Odabir cloud providera (preporuka: **Hetzner Cloud** — jeftin, EU serveri, GDPR)
  - VPS Cloud CX22 (~5 €/mj): 2 vCPU, 4 GB RAM — dovoljan za početak
- [ ] Postavljanje SSH ključeva i sigurnosnih pravila

### Faza 2 — Priprema servera

```bash
# Na serveru (Ubuntu 24.04 LTS)
sudo apt update && sudo apt upgrade -y

# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Certbot za SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y

# Nginx kao reverse proxy
sudo apt install nginx -y
```

### Faza 3 — Containerizacija aplikacije

#### `backend/Dockerfile`

```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### `docker-compose.prod.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: vrhiput
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/vrhiput
      SPRING_DATASOURCE_USERNAME: ${DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
    depends_on:
      postgres:
        condition: service_healthy
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
```

### Faza 4 — SSL i domena

```bash
# Nginx config za reverse proxy s SSL
sudo certbot --nginx -d vrhiput.hr -d www.vrhiput.hr

# Automatsko obnavljanje certifikata
sudo systemctl enable certbot.timer
```

### Faza 5 — CI/CD (opcionalno, GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & Deploy
        run: |
          mvn -f backend/pom.xml package -DskipTests
          docker compose -f docker-compose.prod.yml up -d --build
```

### Faza 6 — Online plaćanje

- [ ] Registracija na [Stripe](https://stripe.com/hr) (podržava HR, EUR)
- [ ] Alternativa: **Corvus Pay** (HR lokalni procesor, integrira se s WooCommerce i custom rješenjima)
- [ ] Implementacija `PaymentController` u backendu
- [ ] Implementacija checkout forme u frontendu
- [ ] Testiranje u sandbox modu prije produkcije

### Troškovnik deploymenta

| Stavka | Trošak |
|--------|--------|
| Hetzner VPS CX22 | ~5 €/mj |
| .hr domena | ~15 €/god |
| SSL certifikat | **BESPLATNO** (Let's Encrypt) |
| Email (Proton Business ili Google Workspace) | ~6-12 €/mj |
| **Ukupno** | **~15-20 €/mj** |

---

## 6. Osnivanje obrta / tvrtke u Hrvatskoj

### Opcija A: Obrt ✅ (Preporuka za početak)

**Prednosti obrta:**
- Brzo i jeftino osnivanje (može i online!)
- Niži administrativni troškovi
- Paušalni porez (ako prihodi < 39.816,84 €/god) — fiksna uplata ~170-450 kn/mj
- PDV prag: 40.000 € (ispod toga nema PDV-a)

**Checklist — Osnivanje obrta u HR:**

- [ ] **Odabir naziva obrta** — provjeri slobodnost naziva na [sudski-registar.pravosudje.hr](https://sudski-registar.pravosudje.hr)
- [ ] **Registracija putem e-Obrtnika** — [e-obrtnik.hr](https://www.e-obrtnik.hr) (online, besplatno s eOsobna ili mToken)
  - Ili osobno u Uredu za gospodarstvo tvoje županije
  - Trošak: registracija obrta je besplatna od 2020. godine
- [ ] **Odabir djelatnosti (NKD šifre)**:
  - `79.11` — Djelatnosti putničkih agencija
  - `79.12` — Djelatnosti turoperatora
  - `93.19` — Ostale sportske djelatnosti (planinarenje)
- [ ] **HZMO i HZZO prijava** — u roku 8 dana od osnivanja
  - Obrtnik = obvezno mirovinsko i zdravstveno osiguranje
  - Minimalni doprinos ~2024: oko 530 €/mj (bruto)
- [ ] **Otvaranje poslovnog bankovnog računa**
  - Preporuka: Revolut Business, Erste, ZABA, OTP
- [ ] **Fiskalizacija** — ako naplaćuješ gotovinom ili karticom, obvezna je fiskalna blagajna
  - Koristi softver poput [Minimax](https://minimax.hr), [Poduzetnik.hr](https://poduzetnik.hr), ili slično

### Opcija B: d.o.o. (Kad poraste posao)

- Minimalni kapital: 2.500 € (uplata u cijelosti pri osnivanju od 2024.)
- Osnivanje kod javnog bilježnika: ~400-600 € troška
- Složenije računovodstvo — preporuča se računovođa
- Pogodnije za veće prihode i investitore

---

## 7. Pravne obveze za turističku agenciju

### Licenca turističke agencije / vodiča

- [ ] **Licenca turističkog vodiča** (Ana)
  - Ispit pri Ministarstvu turizma i sporta RH
  - Potrebno: srednja škola + položen ispit (turistički vodič)
  - Trošak ispita: ~200-400 €
  - Vidi: [mint.gov.hr](https://mint.gov.hr)

- [ ] **Licenca planinarskog vodiča** (Tomislav)
  - Kroz **Hrvatski planinar ski savez (HPS)** — program edukacije
  - Ili kroz **UIAGM/IVBV** za međunarodnu licencu (za Alpe)
  - Trošak edukacije: 500-1500 €

- [ ] **Licenca turoperatora / putničke agencije** (ako prodaješ putne aranžmane)
  - Rješenje Ministarstva turizma i sporta
  - Obvezno osiguranje odgovornosti i jamčevina (ili garancija banke/osiguravatelja)
  - Vidi: [mint.gov.hr — licenciranje](https://mint.gov.hr/turisticki-sektor/turisticke-agencije)

### Osiguranja

- [ ] **Osiguranje od odgovornosti** — odgovornost vodiča prema sudionicima
  - Obavezno za licencu agencije
  - Trošak: ~200-500 €/god (ovisno o obuhvatu)
- [ ] **Osiguranje sudionika** — putno/nesretno za svaki izlet
  - Može biti uključeno u cijenu izleta ili opcija za putnike
- [ ] **Osiguranje opreme** (za skupu planinarsku opremu)

### GDPR i web stranica

- [ ] **Politika privatnosti** — obavezna na web stranici (prikupljanje emailova, kontakt forme)
- [ ] **Cookie consent** — ako koristiš analitiku (Google Analytics i sl.)
- [ ] **Uvjeti korištenja** — preporuča se savjet odvjetnika za online prodaju
- [ ] **Registracija pri AZOP-u** — Agencija za zaštitu osobnih podataka (za evidenciju obrade podataka)

### Porezi i računovodstvo

- [ ] **Paušalni obrt** (prihodi < 39.816 €/god):
  - Plaća se samo paušalni porez + doprinosi
  - Nema PDV-a
  - Preporuča se knjigovodstveni servis (~50-100 €/mj)
- [ ] **PDV registracija** — obvezna kada premaš 40.000 € prihoda godišnje
- [ ] **Fiskalni računi** — obvezni za sve naplate (gotovina i kartice)

---

## 8. Financijski plan i troškovi pokretanja

### Jednokratni troškovi (početak)

| Stavka | Procijenjeni trošak |
|--------|---------------------|
| Osnivanje obrta | **0 €** (od 2020. besplatno) |
| Licenca turističke agencije | 300-600 € |
| Osiguranje od odgovornosti (godišnje) | 200-500 € |
| Web hosting + domena (1. godina) | ~75 € |
| Računovodstvo (setup) | 50-150 € |
| Planinska oprema (ako nemaš) | 500-2000 € |
| Marketing materijali (fotografija, logo) | 200-500 € |
| **Ukupno** | **~1.300 — 3.800 €** |

### Mjesečni troškovi (tekući)

| Stavka | Procijenjeni trošak |
|--------|---------------------|
| Doprinosi (HZMO + HZZO) paušalist | ~530 € |
| Paušalni porez (ovisi o razredu) | 50-200 € |
| Računovodstvo | 50-100 € |
| Hosting + alati | 15-20 € |
| **Ukupno** | **~650 — 850 €/mj** |

### Preporučeni redosljed koraka

1. **Odmah** → Počni izrađivati web stranicu i sadržaj (izleti, fotografije)
2. **Tjedan 1-2** → Osnuj obrt putem e-obrtnika (30 min online)
3. **Tjedan 2-4** → Uredi licencu turističke agencije (kontaktiraj MINT)
4. **Tjedan 3-5** → Ugovori osiguranje od odgovornosti
5. **Tjedan 4-6** → Postavi web na produkciju
6. **Tjedan 6-8** → Aktiviraj online plaćanje (Stripe/Corvus)
7. **Kontinuirano** → Pisanje blog postova o izletima, Instagram, recenzije

---

## Korisni linkovi

- [e-Obrtnik (online registracija)](https://www.e-obrtnik.hr)
- [Ministarstvo turizma — licenciranje agencija](https://mint.gov.hr/turisticki-sektor/turisticke-agencije)
- [HPS — Planinski vodiči](https://www.hps.hr)
- [AZOP — Zaštita osobnih podataka](https://azop.hr)
- [Hetzner Cloud (hosting)](https://www.hetzner.com/cloud)
- [Corvus Pay (HR online plaćanje)](https://corvuspay.com)
- [Stripe za HR (EUR plaćanja)](https://stripe.com/hr)
- [Sudski registar (provjera naziva)](https://sudski-registar.pravosudje.hr)

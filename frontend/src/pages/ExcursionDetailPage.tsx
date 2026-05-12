import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, MapPin, Calendar, Star, ChevronRight } from 'lucide-react';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import type { Excursion } from '../types';

const MOCK: Record<string, Excursion> = {
  triglav: {
    id: 1,
    title: 'Triglav — Krov Julijskih Alpa',
    slug: 'triglav',
    description: 'Uspinjemo se na najviši vrh Slovenije i jednu od najljepših planina u ovom dijelu Europe.',
    content: `
## O izletu

Triglav (2864 m) je simbol Slovenije i jedna od najatraktivnijih planinarskih destinacija u Alpama. Naša trodnevna ekspedicija vodi te kroz Triglav nacionalni park, uz kristalno čista planinska jezera i nepregledne poglede.

## Raspored

### Dan 1 — Dolazak u Bled
Skupljamo se u Bledu, kratki briefing i večera u planinarskom domu.

### Dan 2 — Uspon
Rani start, uspon kroz Krmu i Dolič do Triglavskog doma. Spavanje u planinskom domu.

### Dan 3 — Vrh & povratak
Uspon na sam vrh (2864m) po lijepom vremenu, silazak i povratak u Bled.

## Što je uključeno

- Stručni planinski vodič
- 2 noćenja u planinarskom domu s polupansionom
- Sve dozvole za park
- Komplet prve pomoći

## Oprema

Potrebna prava planinska obuća (visoke planinarske cipele), toplinska odjeća u slojevima, kabanica.
    `,
    difficulty: 'HARD',
    durationDays: 3,
    maxParticipants: 8,
    price: 249,
    coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90',
    imageUrls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    ],
    location: 'Julijske Alpe, Slovenija',
    startingPoint: 'Bled, Slovenija',
    guide: {
      id: 1,
      name: 'Tomislav',
      bio: 'Certificirani planinski vodič s više od 8 godina iskustva. Uspio sam se popeti na Triglav više od 40 puta i uvijek pronalazim nešto novo što me oduševljava.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      specialization: 'Visoko planinarenje & Alpinizam',
    },
    tags: ['alpe', 'triglav', 'visoko', 'slovenija'],
    publishedAt: '2024-03-01',
    nextDeparture: '2025-07-15',
  },
};

function renderContent(md: string) {
  return md.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="font-display text-2xl font-bold text-[#3d2b1f] mt-8 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="font-semibold text-lg text-[#2d5a27] mt-5 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-stone-700 mb-1 list-disc">{line.slice(2)}</li>;
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return <p key={i} className="text-stone-700 leading-relaxed">{line}</p>;
  });
}

export default function ExcursionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const excursion = slug ? MOCK[slug] : null;

  if (!excursion) {
    return (
      <main className="pt-28 pb-20 text-center">
        <h1 className="font-display text-3xl text-[#3d2b1f]">Izlet nije pronađen</h1>
        <Link to="/izleti" className="mt-4 inline-flex items-center gap-1 text-[#2d5a27] underline">
          <ArrowLeft className="w-4 h-4" /> Natrag na izlete
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-16">
      {/* Hero image */}
      <div className="relative h-[50vh] min-h-80 overflow-hidden">
        <img src={excursion.coverImageUrl} alt={excursion.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <nav className="flex items-center gap-1 text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Početna</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/izleti" className="hover:text-white transition-colors">Izleti</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{excursion.title}</span>
          </nav>
          <div className="flex flex-wrap gap-2 items-center">
            <DifficultyBadge difficulty={excursion.difficulty} />
            {excursion.tags.map(t => (
              <span key={t} className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">{t}</span>
            ))}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3">{excursion.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <p className="text-lg text-stone-600 mb-6 leading-relaxed">{excursion.description}</p>

            {excursion.imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {excursion.imageUrls.map((url, i) => (
                  <img key={i} src={url} alt="" className="rounded-xl object-cover h-40 w-full" />
                ))}
              </div>
            )}

            <div className="prose max-w-none">
              {renderContent(excursion.content)}
            </div>

            {/* Guide */}
            <div className="mt-12 p-6 bg-[#f5f0e8] rounded-2xl border border-stone-200">
              <h3 className="font-display text-xl font-bold text-[#3d2b1f] mb-4">Vaš vodič</h3>
              <div className="flex items-start gap-4">
                <img
                  src={excursion.guide.avatarUrl}
                  alt={excursion.guide.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-[#3d2b1f] text-lg">{excursion.guide.name}</p>
                  <p className="text-[#2d5a27] text-sm font-medium mb-2">{excursion.guide.specialization}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{excursion.guide.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden">
              <div className="bg-[#2d5a27] p-6 text-white">
                <div className="text-3xl font-bold font-display">{excursion.price} €</div>
                <div className="text-white/70 text-sm">po osobi, sve uključeno</div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-[#2d5a27] flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#3d2b1f]">Trajanje: </span>
                    <span className="text-stone-600">{excursion.durationDays} {excursion.durationDays === 1 ? 'dan' : 'dana'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-5 h-5 text-[#2d5a27] flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#3d2b1f]">Maks. sudionika: </span>
                    <span className="text-stone-600">{excursion.maxParticipants}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-[#2d5a27] flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#3d2b1f]">Polazna točka: </span>
                    <span className="text-stone-600">{excursion.startingPoint}</span>
                  </div>
                </div>
                {excursion.nextDeparture && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-[#2d5a27] flex-shrink-0" />
                    <div>
                      <span className="font-medium text-[#3d2b1f]">Sljedeći polazak: </span>
                      <span className="text-stone-600">{new Date(excursion.nextDeparture).toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100">
                  <a
                    href="#"
                    className="block w-full text-center bg-[#2d5a27] hover:bg-[#1a3a16] text-white font-semibold py-3.5 rounded-xl transition-colors cursor-not-allowed opacity-80"
                    title="Online plaćanje uskoro!"
                  >
                    Rezerviraj — uskoro!
                  </a>
                  <a
                    href="mailto:info@hikeit.hr"
                    className="block w-full text-center mt-3 border border-[#2d5a27] text-[#2d5a27] hover:bg-[#2d5a27]/5 font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    Pošalji upit emailom
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>5.0 (12 recenzija)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

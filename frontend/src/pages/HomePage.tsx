import { Link } from 'react-router-dom';
import { ArrowRight, Mountain, Shield, Users, Star, ChevronDown } from 'lucide-react';
import ExcursionCard from '../components/ui/ExcursionCard';
import type { Excursion } from '../types';

const MOCK_EXCURSIONS: Excursion[] = [
  {
    id: 1,
    title: 'Triglav — Krov Julijskih Alpa',
    slug: 'triglav',
    description: 'Uspinjemo se na najviši vrh Slovenije i jednu od najljepših planina u ovom dijelu Europe.',
    content: '',
    difficulty: 'HARD',
    durationDays: 3,
    maxParticipants: 8,
    price: 249,
    coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    imageUrls: [],
    location: 'Julijske Alpe, Slovenija',
    startingPoint: 'Bled',
    guide: { id: 1, name: 'Tomislav', bio: '', avatarUrl: '', specialization: 'Planinarenje' },
    tags: ['alpe', 'triglav', 'visoko'],
    publishedAt: '2024-03-01',
    nextDeparture: '2025-07-15',
  },
  {
    id: 2,
    title: 'Velebit — Bajkovita Hrvatska Divljina',
    slug: 'velebit',
    description: 'Treking kroz srce Velebita — endemska flora, fauna i pogled koji oduzima dah.',
    content: '',
    difficulty: 'MODERATE',
    durationDays: 4,
    maxParticipants: 10,
    price: 189,
    coverImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    imageUrls: [],
    location: 'Velebit, Hrvatska',
    startingPoint: 'Zadar',
    guide: { id: 1, name: 'Tomislav', bio: '', avatarUrl: '', specialization: 'Planinarenje' },
    tags: ['velebit', 'treking', 'hrvatska'],
    publishedAt: '2024-03-10',
    nextDeparture: '2025-06-20',
  },
  {
    id: 3,
    title: 'Dubrovnik & Elafiti — Otočki Raj',
    slug: 'dubrovnik-elafiti',
    description: 'Kombinirani izlet s obilascima Dubrovnika i jedrilicama prema Elafitskim otocima.',
    content: '',
    difficulty: 'EASY',
    durationDays: 5,
    maxParticipants: 12,
    price: 320,
    coverImageUrl: 'https://images.unsplash.com/photo-1555990793-da11153b6BE8?w=800&q=80',
    imageUrls: [],
    location: 'Dubrovnik & Elafiti, Hrvatska',
    startingPoint: 'Dubrovnik',
    guide: { id: 2, name: 'Ana', bio: '', avatarUrl: '', specialization: 'Kulturni turizam' },
    tags: ['dubrovnik', 'more', 'otoci'],
    publishedAt: '2024-03-15',
    nextDeparture: '2025-08-01',
  },
];

const STATS = [
  { value: '120+', label: 'Sretnih putnika' },
  { value: '30+', label: 'Različitih ruta' },
  { value: '5★', label: 'Prosječna ocjena' },
  { value: '8+', label: 'Godina iskustva' },
];

const WHY_US = [
  {
    icon: <Mountain className="w-6 h-6" />,
    title: 'Certificirani vodiči',
    desc: 'Planinski i turistički vodiči s licencama i godinama terenske prakse.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Sigurnost na prvom mjestu',
    desc: 'Profesionalna oprema, osiguranje i protokoli za svaki izlet.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Male grupe',
    desc: 'Maksimalno 12 osoba po grupi — pravi doživljaj, ne masovni turizam.',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Autentično iskustvo',
    desc: 'Lokalna znanja, skrivene staze i priče koje ne naći u vodiču.',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=90)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Planinski & Turistički izleti • Hrvatska & Regija
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Svaki Vrh<br />
            <span className="text-[#a8d5a0]">Ima Svoju Priču</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Vodimo te na mjesta gdje planine grle nebo, a more šapuće tajne. 
            Profesionalni vodiči, male grupe, nezaboravna iskustva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/izleti"
              className="inline-flex items-center gap-2 bg-[#2d5a27] hover:bg-[#1a3a16] text-white font-semibold px-8 py-4 rounded-full transition-colors text-lg"
            >
              Pregledaj izlete <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/o-nama"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/40 text-white font-semibold px-8 py-4 rounded-full backdrop-blur-sm transition-colors text-lg"
            >
              Upoznaj nas
            </Link>
          </div>
        </div>

        <a href="#izleti" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce">
          <ChevronDown className="w-7 h-7" />
        </a>
      </section>

      {/* Stats */}
      <section className="bg-[#2d5a27] py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold font-display mb-1">{value}</div>
              <div className="text-white/70 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured excursions */}
      <section id="izleti" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#2d5a27] font-semibold text-sm uppercase tracking-widest">Popularni izleti</span>
            <h2 className="font-display text-4xl font-bold text-[#3d2b1f] mt-2 mb-4">Istaknute Avanture</h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              Od Velebita do Triglava, od Dubrovnika do Plitvica — odaberi svoju sljedeću avanturu.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_EXCURSIONS.map(exc => (
              <ExcursionCard key={exc.id} excursion={exc} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/izleti"
              className="inline-flex items-center gap-2 border-2 border-[#2d5a27] text-[#2d5a27] hover:bg-[#2d5a27] hover:text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Svi izleti <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 px-4 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#2d5a27] font-semibold text-sm uppercase tracking-widest">Naše prednosti</span>
            <h2 className="font-display text-4xl font-bold text-[#3d2b1f] mt-2">Zašto Baš Mi?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-[#3d2b1f] mb-2">{title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden" id="rezervacija">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=80)' }}
        />
        <div className="absolute inset-0 bg-[#1a3a16]/80" />
        <div className="relative max-w-2xl mx-auto text-center text-white">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Spreman za Avanturu?</h2>
          <p className="text-white/80 text-lg mb-8">
            Kontaktiraj nas i osmislimo tvoj savršeni izlet — prilagođen tebi, tvom tempu i tvojim snovima.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white text-[#2d5a27] font-bold px-10 py-4 rounded-full hover:bg-[#a8d5a0] transition-colors text-lg cursor-not-allowed opacity-80"
            title="Plaćanje putem weba — uskoro!"
          >
            Rezerviraj online — uskoro!
          </a>
          <p className="mt-4 text-white/50 text-sm">Za sada nas kontaktiraj emailom ili telefonom</p>
        </div>
      </section>
    </main>
  );
}

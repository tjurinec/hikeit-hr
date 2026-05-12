import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ExcursionCard from '../components/ui/ExcursionCard';
import type { Excursion } from '../types';

const ALL_EXCURSIONS: Excursion[] = [
  {
    id: 1,
    title: 'Triglav — Krov Julijskih Alpa',
    slug: 'triglav',
    description: 'Uspinjemo se na najviši vrh Slovenije i jednu od najljepših planina u ovom dijelu Europe. Trodnevna ekspedicija s iskusnim vodičem.',
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
    description: 'Treking kroz srce Velebita — endemska flora, fauna i pogled koji oduzima dah. Četiri dana čiste prirode.',
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
    description: 'Kombinirani izlet s obilascima Dubrovnika i jedrilicama prema Elafitskim otocima. Kultura i priroda u jednom.',
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
  {
    id: 4,
    title: 'Plitvička Jezera — Sedam Čuda',
    slug: 'plitvice',
    description: 'Čarobni obilazak UNESCO zaštićenog biserja Hrvatske prirode. Idealno za obitelji i početnike.',
    content: '',
    difficulty: 'EASY',
    durationDays: 1,
    maxParticipants: 15,
    price: 65,
    coverImageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80',
    imageUrls: [],
    location: 'Lika, Hrvatska',
    startingPoint: 'Zagreb / Split',
    guide: { id: 2, name: 'Ana', bio: '', avatarUrl: '', specialization: 'Kulturni turizam' },
    tags: ['plitvice', 'jezera', 'unesco'],
    publishedAt: '2024-04-01',
  },
  {
    id: 5,
    title: 'Risnjak — Šuma na Rubu Neba',
    slug: 'risnjak',
    description: 'Vikend planinarenje na Risnjaku — risu i šumi divljine koja osvoji svakoga.',
    content: '',
    difficulty: 'MODERATE',
    durationDays: 2,
    maxParticipants: 8,
    price: 120,
    coverImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    imageUrls: [],
    location: 'Gorski Kotar, Hrvatska',
    startingPoint: 'Rijeka',
    guide: { id: 1, name: 'Tomislav', bio: '', avatarUrl: '', specialization: 'Planinarenje' },
    tags: ['risnjak', 'šuma', 'gorski kotar'],
    publishedAt: '2024-04-10',
    nextDeparture: '2025-09-06',
  },
  {
    id: 6,
    title: 'Biokovo — Između Mora i Neba',
    slug: 'biokovo',
    description: 'Uspon na Sveti Jure i Biokovo skywalk s panoramom cijele Dalmacije i Jadrana.',
    content: '',
    difficulty: 'HARD',
    durationDays: 2,
    maxParticipants: 6,
    price: 145,
    coverImageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    imageUrls: [],
    location: 'Biokovo, Dalmacija',
    startingPoint: 'Makarska',
    guide: { id: 1, name: 'Tomislav', bio: '', avatarUrl: '', specialization: 'Planinarenje' },
    tags: ['biokovo', 'dalmacija', 'uspon'],
    publishedAt: '2024-04-20',
    nextDeparture: '2025-06-28',
  },
];

const DIFFICULTIES: Array<Excursion['difficulty'] | 'ALL'> = ['ALL', 'EASY', 'MODERATE', 'HARD', 'EXPERT'];
const DIFFICULTY_LABELS: Record<string, string> = {
  ALL: 'Sve težine',
  EASY: 'Lagano',
  MODERATE: 'Umjereno',
  HARD: 'Teško',
  EXPERT: 'Ekspert',
};

export default function ExcursionsPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'ALL' | Excursion['difficulty']>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = ALL_EXCURSIONS.filter(e => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = difficulty === 'ALL' || e.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <div className="relative py-16 px-4 overflow-hidden bg-[#2d5a27]">
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <span className="text-white/60 text-sm uppercase tracking-widest font-semibold">Naša ponuda</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-4">Svi Izleti</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Odaberi avanturu koja govori tvom srcu — od laganih šetnji do zahtjevnih usponima.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10">
        {/* Search & filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Pretraži izlete, lokacije, tagove..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-600 hover:border-[#2d5a27] transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtri
          </button>
        </div>

        {showFilters && (
          <div className="mb-8 p-4 bg-white rounded-xl border border-stone-200 flex flex-wrap gap-2">
            <span className="text-sm text-stone-500 font-medium self-center mr-2">Težina:</span>
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  difficulty === d
                    ? 'bg-[#2d5a27] text-white border-[#2d5a27]'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-[#2d5a27]'
                }`}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg">Nema rezultata za "{search}"</p>
            <button onClick={() => { setSearch(''); setDifficulty('ALL'); }} className="mt-4 text-[#2d5a27] underline text-sm">
              Resetiraj pretragu
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-500 mb-6">{filtered.length} {filtered.length === 1 ? 'izlet' : 'izleta'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(exc => (
                <ExcursionCard key={exc.id} excursion={exc} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

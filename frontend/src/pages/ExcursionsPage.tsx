import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { excursionsApi } from '../api';
import { Search, SlidersHorizontal } from 'lucide-react';
import ExcursionCard from '../components/ui/ExcursionCard';
import type { Excursion } from '../types';

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

  const { data: excursions = [], isLoading, isError } = useQuery({
    queryKey: ['excursions'],
    queryFn: excursionsApi.getAll,
  });

  const q = search.toLowerCase();
  const filtered = excursions.filter(e => {
    const matchSearch =
      e.title.toLowerCase().includes(q) ||
      (e.location ?? '').toLowerCase().includes(q) ||
      (e.tags ?? []).some(t => t.toLowerCase().includes(q));
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

        {isLoading ? (
          <div className="text-center py-20 text-stone-400">Učitavanje izleta...</div>
        ) : isError ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg">Trenutno ne mogu dohvatiti izlete.</p>
            <p className="text-sm mt-1">Pokušaj osvježiti stranicu za koji trenutak.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg">
              {excursions.length === 0 ? 'Još nema objavljenih izleta.' : `Nema rezultata za "${search}"`}
            </p>
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

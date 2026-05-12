import { useState } from 'react';
import { Mountain, LogOut, PlusCircle, List, Users } from 'lucide-react';
import { clearAdminAuth } from '../../api';
import ExcursionForm from './ExcursionForm';
import GuideList from './GuideList';

type Tab = 'new' | 'list' | 'guides';

interface Props {
  onLogout: () => void;
}

export default function AdminPage({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('new');
  const [savedCount, setSavedCount] = useState(0);

  const handleLogout = () => {
    clearAdminAuth();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Admin navbar */}
      <header className="bg-[#1a3a16] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Mountain className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm">hikeIT.hr</span>
            <span className="text-white/50 text-xs ml-2">· Admin</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Odjava
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[#3d2b1f]">Upravljanje sadržajem</h1>
          <p className="text-stone-500 text-sm mt-1">Dodaj ili uredi izlete koji se prikazuju na stranici.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('new')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === 'new'
                ? 'bg-[#2d5a27] text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-[#2d5a27]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Novi izlet
          </button>
          <button
            onClick={() => setTab('list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === 'list'
                ? 'bg-[#2d5a27] text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-[#2d5a27]'
            }`}
          >
            <List className="w-4 h-4" />
            Svi izleti
          </button>
          <button
            onClick={() => setTab('guides')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === 'guides'
                ? 'bg-[#2d5a27] text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-[#2d5a27]'
            }`}
          >
            <Users className="w-4 h-4" />
            Vodiči
          </button>
        </div>

        {tab === 'new' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
            <h2 className="font-display text-xl font-bold text-[#3d2b1f] mb-6">Dodaj novi izlet</h2>
            <ExcursionForm onSaved={() => setSavedCount(c => c + 1)} />
          </div>
        )}

        {tab === 'list' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
            <h2 className="font-display text-xl font-bold text-[#3d2b1f] mb-4">Popis izleta</h2>
            <p className="text-stone-500 text-sm">
              {savedCount > 0
                ? `Upravo si dodao ${savedCount} novi izlet.`
                : 'Upravljanje postojećim izletima dolazi uskoro.'
              }
            </p>
            <p className="text-stone-400 text-xs mt-2">
              Za sada koristi <strong>Novi izlet</strong> tab za dodavanje, i direktno bazu za uređivanje.
            </p>
          </div>
        )}

        {tab === 'guides' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
            <h2 className="font-display text-xl font-bold text-[#3d2b1f] mb-6">Vodiči</h2>
            <GuideList />
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { guidesApi } from '../../api';
import type { Guide } from '../../types';
import GuideForm from './GuideForm';

export default function GuideList() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Guide | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setGuides(await guidesApi.getAll());
    } catch {
      setError('Greška pri dohvaćanju vodiča.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Sigurno brišeš ovog vodiča?')) return;
    try {
      await guidesApi.delete(id);
      setGuides(g => g.filter(x => x.id !== id));
    } catch {
      alert('Greška pri brisanju.');
    }
  };

  const handleSaved = () => {
    setAdding(false);
    setEditing(null);
    load();
  };

  if (loading) return <p className="text-stone-400 text-sm">Učitavanje...</p>;

  return (
    <div className="space-y-6">
      {!adding && !editing && (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-[#2d5a27] hover:bg-[#1a3a16] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Dodaj vodiča
        </button>
      )}

      {adding && (
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
          <h3 className="font-semibold text-[#3d2b1f] mb-4">Novi vodič</h3>
          <GuideForm onSaved={handleSaved} onCancel={() => setAdding(false)} />
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-3">
        {guides.map(guide =>
          editing?.id === guide.id ? (
            <div key={guide.id} className="bg-stone-50 rounded-xl border border-[#2d5a27]/30 p-6">
              <h3 className="font-semibold text-[#3d2b1f] mb-4">Uredi — {guide.name}</h3>
              <GuideForm guide={guide} onSaved={handleSaved} onCancel={() => setEditing(null)} />
            </div>
          ) : (
            <div key={guide.id} className="flex items-center gap-4 bg-white rounded-xl border border-stone-200 p-4">
              {guide.avatarUrl ? (
                <img
                  src={guide.avatarUrl}
                  alt={guide.name}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 text-stone-400 text-xl font-bold">
                  {guide.name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#3d2b1f]">{guide.name}</p>
                {guide.specialization && (
                  <p className="text-sm text-[#2d5a27]">{guide.specialization}</p>
                )}
                {guide.bio && (
                  <p className="text-xs text-stone-400 mt-0.5 truncate">{guide.bio}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => { setAdding(false); setEditing(guide); }}
                  className="p-2 rounded-lg border border-stone-200 hover:border-[#2d5a27] text-stone-500 hover:text-[#2d5a27] transition-colors"
                  title="Uredi"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(guide.id)}
                  className="p-2 rounded-lg border border-stone-200 hover:border-red-400 text-stone-500 hover:text-red-500 transition-colors"
                  title="Obriši"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        )}
        {guides.length === 0 && !adding && (
          <p className="text-stone-400 text-sm">Nema vodiča. Dodaj prvog!</p>
        )}
      </div>
    </div>
  );
}

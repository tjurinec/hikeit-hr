import { useEffect, useState } from 'react';
import { Pencil, Trash2, Loader2, EyeOff, Star } from 'lucide-react';
import { excursionsApi } from '../../api';
import type { Excursion } from '../../types';
import ExcursionForm from './ExcursionForm';

export default function ExcursionList() {
  const [items, setItems] = useState<Excursion[]>([]);
  const [editing, setEditing] = useState<Excursion | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await excursionsApi.getAllForAdmin());
    } catch {
      setError('Ne mogu dohvatiti izlete. Provjeri jesi li prijavljen.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = async (id: number) => {
    setBusyId(id);
    setError('');
    try {
      // Popis vraća skraćeni zapis (bez opširnog opisa), pa za uređivanje treba detalj
      setEditing(await excursionsApi.getByIdForAdmin(id));
    } catch {
      setError('Ne mogu dohvatiti izlet za uređivanje.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (e: Excursion) => {
    if (!confirm(`Obrisati izlet "${e.title}"? Ovo se ne može poništiti.`)) return;
    setBusyId(e.id);
    setError('');
    try {
      await excursionsApi.delete(e.id);
      await load();
    } catch {
      setError('Brisanje nije uspjelo.');
    } finally {
      setBusyId(null);
    }
  };

  if (editing) {
    return (
      <div>
        <h3 className="font-display text-lg font-bold text-[#3d2b1f] mb-4">
          Uređivanje: {editing.title}
        </h3>
        <ExcursionForm
          excursion={editing}
          onSaved={() => { setEditing(null); load(); }}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  if (loading) return <div className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Učitavanje...</div>;

  return (
    <div className="space-y-3">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {items.length === 0 && <p className="text-stone-500 text-sm">Još nema izleta. Dodaj prvi kroz tab „Novi izlet".</p>}

      {items.map(e => (
        <div key={e.id} className="flex items-center gap-4 p-3 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          {e.coverImageUrl
            ? <img src={e.coverImageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
            : <div className="w-16 h-16 rounded-lg bg-stone-100 shrink-0" />}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#3d2b1f] truncate">{e.title}</span>
              {e.featured && <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
              {!e.published && (
                <span className="flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full shrink-0">
                  <EyeOff className="w-3 h-3" /> nije objavljen
                </span>
              )}
            </div>
            <p className="text-stone-500 text-xs truncate">{e.location || e.slug}</p>
          </div>

          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => handleEdit(e.id)}
              disabled={busyId === e.id}
              className="p-2 rounded-lg text-stone-500 hover:text-[#2d5a27] hover:bg-stone-100 transition-colors disabled:opacity-50"
              title="Uredi"
            >
              {busyId === e.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleDelete(e)}
              disabled={busyId === e.id}
              className="p-2 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Obriši"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Loader2, FolderPlus, ExternalLink, Images, ArrowUp, ArrowDown } from 'lucide-react';
import { galleryApi, thumbOf } from '../../api';
import type { Gallery } from '../../types';
import GalleryForm from './GalleryForm';

export default function GalleryList() {
  const [items, setItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Gallery | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await galleryApi.getAll());
    } catch {
      setError('Ne mogu dohvatiti galerije.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (g: Gallery) => {
    if (!confirm(`Obrisati galeriju "${g.title}" i njenih ${g.images.length} slika? Ovo se ne može poništiti.`)) return;
    setBusyId(g.id);
    try {
      await galleryApi.delete(g.id);
      await load();
    } catch {
      setError('Brisanje nije uspjelo.');
    } finally {
      setBusyId(null);
    }
  };

  /** Zamjena susjeda: prikaz se pomakne odmah, redoslijed se spremi u pozadini. */
  const move = async (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    setError('');
    try {
      await galleryApi.reorder(next.map(g => g.id));
    } catch {
      setError('Redoslijed nije spremljen.');
      await load();
    }
  };

  const done = () => { setEditing(null); setCreating(false); load(); };

  if (creating || editing) {
    return (
      <div>
        <h3 className="font-display text-lg font-bold text-[#3d2b1f] mb-4">
          {editing ? `Uređivanje: ${editing.title}` : 'Nova galerija'}
        </h3>
        <GalleryForm gallery={editing} onSaved={done} onCancel={() => { setEditing(null); setCreating(false); }} />
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Učitavanje...</div>;
  }

  return (
    <div className="space-y-3">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <button
        onClick={() => setCreating(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2d5a27] hover:bg-[#1a3a16] text-white text-sm font-medium transition-colors"
      >
        <FolderPlus className="w-4 h-4" /> Nova galerija
      </button>

      {items.length === 0 && <p className="text-stone-500 text-sm py-4">Još nema galerija.</p>}

      {items.length > 1 && (
        <p className="text-xs text-stone-400">Strelicama mijenjaš redoslijed kojim se galerije prikazuju na stranici.</p>
      )}

      {items.map((g, i) => (
        <div key={g.id} className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
          {items.length > 1 && (
            <div className="flex flex-col shrink-0">
              <button onClick={() => move(i, -1)} disabled={i === 0}
                className="p-1 rounded text-stone-400 hover:text-[#2d5a27] hover:bg-stone-100 disabled:opacity-30 transition-colors" title="Pomakni gore">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1}
                className="p-1 rounded text-stone-400 hover:text-[#2d5a27] hover:bg-stone-100 disabled:opacity-30 transition-colors" title="Pomakni dolje">
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          )}
          {g.images[0]
            ? <img src={thumbOf(g.images[0].url)} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
            : <div className="w-16 h-16 rounded-lg bg-stone-100 shrink-0" />}

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#3d2b1f] truncate">{g.title}</p>
            <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
              <span className="flex items-center gap-1"><Images className="w-3.5 h-3.5" /> {g.images.length}</span>
              {g.externalUrl && (
                <a href={g.externalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#2d5a27]">
                  <ExternalLink className="w-3.5 h-3.5" /> vanjski link
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            <button onClick={() => setEditing(g)}
              className="p-2 rounded-lg text-stone-500 hover:text-[#2d5a27] hover:bg-stone-100 transition-colors" title="Uredi">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(g)} disabled={busyId === g.id}
              className="p-2 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50" title="Obriši">
              {busyId === g.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

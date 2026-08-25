import { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2, Loader2, ImagePlus, Check, X } from 'lucide-react';
import { galleryApi, uploadApi } from '../../api';
import type { GalleryImage } from '../../types';

interface Draft {
  caption: string;
  location: string;
  category: string;
}

const emptyDraft: Draft = { caption: '', location: '', category: '' };

export default function GalleryList() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await galleryApi.getAll());
    } catch {
      setError('Ne mogu dohvatiti galeriju.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadApi.image(file);
      await galleryApi.create({ url, sortOrder: items.length });
      await load();
    } catch {
      setError('Upload nije uspio. Provjeri format (JPG, PNG, WEBP) i veličinu (max 20MB).');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setDraft({
      caption: img.caption ?? '',
      location: img.location ?? '',
      category: img.category ?? '',
    });
  };

  const saveEdit = async (img: GalleryImage) => {
    setBusyId(img.id);
    setError('');
    try {
      await galleryApi.update(img.id, {
        url: img.url,
        caption: draft.caption || null,
        location: draft.location || null,
        category: draft.category || null,
      });
      setEditingId(null);
      await load();
    } catch {
      setError('Spremanje nije uspjelo.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (img: GalleryImage) => {
    if (!confirm('Obrisati ovu sliku iz galerije?')) return;
    setBusyId(img.id);
    setError('');
    try {
      await galleryApi.delete(img.id);
      await load();
    } catch {
      setError('Brisanje nije uspjelo.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2d5a27] hover:bg-[#1a3a16] text-white text-sm font-medium transition-colors disabled:opacity-60"
      >
        {uploading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploadanje...</>
          : <><ImagePlus className="w-4 h-4" /> Dodaj sliku</>}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      {loading ? (
        <div className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Učitavanje...</div>
      ) : items.length === 0 ? (
        <p className="text-stone-500 text-sm">Galerija je prazna.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map(img => (
            <div key={img.id} className="rounded-xl border border-stone-200 overflow-hidden">
              <img src={img.url} alt={img.caption ?? ''} className="w-full h-40 object-cover" />

              {editingId === img.id ? (
                <div className="p-3 space-y-2">
                  <input
                    value={draft.caption}
                    onChange={e => setDraft(d => ({ ...d, caption: e.target.value }))}
                    placeholder="Opis slike"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-sm outline-none focus:border-[#2d5a27]"
                  />
                  <input
                    value={draft.location}
                    onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
                    placeholder="Lokacija"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-sm outline-none focus:border-[#2d5a27]"
                  />
                  <input
                    value={draft.category}
                    onChange={e => setDraft(d => ({ ...d, category: e.target.value }))}
                    placeholder="Kategorija"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-sm outline-none focus:border-[#2d5a27]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(img)}
                      disabled={busyId === img.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2d5a27] text-white text-xs font-medium disabled:opacity-60"
                    >
                      {busyId === img.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Spremi
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-xs font-medium"
                    >
                      <X className="w-3.5 h-3.5" /> Odustani
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#3d2b1f] truncate">{img.caption || <span className="text-stone-400">bez opisa</span>}</p>
                    <p className="text-xs text-stone-500 truncate">
                      {[img.location, img.category].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(img)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-[#2d5a27] hover:bg-stone-100 transition-colors"
                      title="Uredi"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(img)}
                      disabled={busyId === img.id}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Obriši"
                    >
                      {busyId === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useRef, useState } from 'react';
import { Loader2, Save, Trash2, ImagePlus, ArrowUp, ArrowDown } from 'lucide-react';
import { galleryApi, uploadApi, thumbOf } from '../../api';
import type { Gallery } from '../../types';

interface ImageDraft {
  url: string;
  caption: string;
  location: string;
}

interface Props {
  gallery?: Gallery | null;
  onSaved: () => void;
  onCancel: () => void;
}

const input = 'w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition';
const label = 'block text-sm font-semibold text-[#3d2b1f] mb-1.5';

export default function GalleryForm({ gallery, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(gallery?.title ?? '');
  const [description, setDescription] = useState(gallery?.description ?? '');
  const [externalUrl, setExternalUrl] = useState(gallery?.externalUrl ?? '');
  const [images, setImages] = useState<ImageDraft[]>(
    gallery?.images.map(i => ({ url: i.url, caption: i.caption ?? '', location: i.location ?? '' })) ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      // Redom, da se na malom instanceu ne otvori previše paralelnih uploada
      for (const file of files) {
        const url = await uploadApi.image(file);
        setImages(prev => [...prev, { url, caption: '', location: '' }]);
      }
    } catch {
      setError('Upload nije uspio. Provjeri format (JPG, PNG, WEBP) i veličinu (max 20MB).');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const setImg = (i: number, key: keyof ImageDraft, value: string) =>
    setImages(prev => prev.map((img, idx) => (idx === i ? { ...img, [key]: value } : img)));

  const removeImg = (i: number) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const move = (i: number, delta: number) =>
    setImages(prev => {
      const next = [...prev];
      const j = i + delta;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Galerija mora imati barem jednu sliku.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      title,
      description: description || null,
      externalUrl: externalUrl || null,
      images: images.map(i => ({ url: i.url, caption: i.caption || null, location: i.location || null })),
    };
    try {
      if (gallery) await galleryApi.update(gallery.id, payload);
      else await galleryApi.create(payload);
      onSaved();
    } catch {
      setError('Spremanje nije uspjelo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div>
        <label className={label}>Naslov galerije *</label>
        <input required type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="npr. Velebit, svibanj 2026." className={input} />
      </div>

      <div>
        <label className={label}>Opis</label>
        <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Nekoliko rečenica o izletu..." className={`${input} resize-y`} />
      </div>

      <div>
        <label className={label}>Link na vanjsku galeriju</label>
        <input type="url" value={externalUrl} onChange={e => setExternalUrl(e.target.value)}
          placeholder="https://photos.google.com/..." className={input} />
        <p className="text-xs text-stone-400 mt-1">Google Photos ili slično — prikazuje se kao poveznica ispod opisa.</p>
      </div>

      <div>
        <label className={label}>Slike * <span className="font-normal text-stone-400">({images.length})</span></label>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2d5a27] hover:bg-[#1a3a16] text-white text-sm font-medium transition-colors disabled:opacity-60">
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploadanje...</> : <><ImagePlus className="w-4 h-4" /> Dodaj slike</>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />

        {images.length === 0 ? (
          <p className="text-sm text-stone-400 mt-3">Galerija mora imati barem jednu sliku.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {images.map((img, i) => (
              <div key={img.url} className="flex gap-3 items-start p-2 rounded-xl border border-stone-200">
                <img src={thumbOf(img.url)} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <input type="text" value={img.caption} onChange={e => setImg(i, 'caption', e.target.value)}
                    placeholder="Opis slike (nije obavezno)" className={`${input} py-1.5`} />
                  <input type="text" value={img.location} onChange={e => setImg(i, 'location', e.target.value)}
                    placeholder="Lokacija (nije obavezno)" className={`${input} py-1.5`} />
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-[#2d5a27] hover:bg-stone-100 disabled:opacity-30" title="Gore">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-[#2d5a27] hover:bg-stone-100 disabled:opacity-30" title="Dolje">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => removeImg(i)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50" title="Ukloni">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel}
          className="px-6 py-3.5 rounded-xl border border-stone-300 text-stone-600 font-semibold hover:bg-stone-50 transition-colors">
          Odustani
        </button>
        <button type="submit" disabled={saving || uploading}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2d5a27] hover:bg-[#1a3a16] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60">
          {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Spremanje...</> : <><Save className="w-5 h-5" /> {gallery ? 'Spremi promjene' : 'Kreiraj galeriju'}</>}
        </button>
      </div>
    </form>
  );
}

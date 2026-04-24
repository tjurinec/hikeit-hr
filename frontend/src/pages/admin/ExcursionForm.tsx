import { useState, useRef } from 'react';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';
import { excursionsApi, uploadApi } from '../../api';

type Difficulty = 'EASY' | 'MODERATE' | 'HARD' | 'EXPERT';

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'EASY', label: 'Lagano' },
  { value: 'MODERATE', label: 'Umjereno' },
  { value: 'HARD', label: 'Teško' },
  { value: 'EXPERT', label: 'Ekspert' },
];

interface FormState {
  title: string;
  description: string;
  content: string;
  difficulty: Difficulty;
  durationDays: number;
  maxParticipants: number;
  price: string;
  coverImageUrl: string;
  location: string;
  startingPoint: string;
  tags: string;
  featured: boolean;
  published: boolean;
  nextDeparture: string;
}

const EMPTY: FormState = {
  title: '', description: '', content: '', difficulty: 'MODERATE',
  durationDays: 1, maxParticipants: 10, price: '', coverImageUrl: '',
  location: '', startingPoint: '', tags: '', featured: false,
  published: false, nextDeparture: '',
};

interface Props {
  onSaved: () => void;
}

export default function ExcursionForm({ onSaved }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const setCheck = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.checked }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadApi.image(file);
      setForm(f => ({ ...f, coverImageUrl: url }));
    } catch {
      setError('Greška pri uploadu slike. Provjeri format (JPG, PNG, WEBP) i veličinu (max 20MB).');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await excursionsApi.create({
        ...form,
        price: form.price ? parseFloat(form.price) : null,
        durationDays: Number(form.durationDays),
        maxParticipants: Number(form.maxParticipants),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        nextDeparture: form.nextDeparture || null,
      });
      setSuccess(`Izlet "${form.title}" je uspješno kreiran!`);
      setForm(EMPTY);
      onSaved();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Greška pri spremanju. Provjeri je li backend pokrenut i jesi li prijavljen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      {/* Naslovna slika */}
      <div>
        <label className="block text-sm font-semibold text-[#3d2b1f] mb-2">Naslovna slika</label>
        <div className="flex gap-3 items-start">
          <div
            className="flex-1 border-2 border-dashed border-stone-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#2d5a27] transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {form.coverImageUrl ? (
              <div className="relative">
                <img src={form.coverImageUrl} alt="Preview" className="h-40 w-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, coverImageUrl: '' })); }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ) : uploading ? (
              <div className="flex flex-col items-center gap-2 text-[#2d5a27]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-stone-400">
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm">Klikni za upload slike</span>
                <span className="text-xs">JPG, PNG, WEBP · max 20MB</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-xs text-stone-500 mb-1">ili upiši URL slike</label>
            <input
              type="url"
              value={form.coverImageUrl}
              onChange={set('coverImageUrl')}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:border-[#2d5a27] transition"
            />
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Osnovni podaci */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Naziv izleta *</label>
          <input
            required type="text" value={form.title} onChange={set('title')}
            placeholder="npr. Triglav — Krov Julijskih Alpa"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Kratki opis *</label>
          <textarea
            required rows={2} value={form.description} onChange={set('description')}
            placeholder="Kratki opis koji se prikazuje na kartici izleta..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Lokacija</label>
          <input type="text" value={form.location} onChange={set('location')}
            placeholder="npr. Julijske Alpe, Slovenija"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Polazna točka</label>
          <input type="text" value={form.startingPoint} onChange={set('startingPoint')}
            placeholder="npr. Bled, Slovenija"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Težina *</label>
          <select required value={form.difficulty} onChange={set('difficulty')}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] transition bg-white"
          >
            {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Cijena (€/osobi)</label>
          <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')}
            placeholder="0.00"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Trajanje (dana) *</label>
          <input required type="number" min="1" value={form.durationDays}
            onChange={e => setForm(f => ({ ...f, durationDays: parseInt(e.target.value) || 1 }))}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Maks. sudionika *</label>
          <input required type="number" min="1" max="50" value={form.maxParticipants}
            onChange={e => setForm(f => ({ ...f, maxParticipants: parseInt(e.target.value) || 10 }))}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Sljedeći polazak</label>
          <input type="date" value={form.nextDeparture} onChange={set('nextDeparture')}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">Tagovi</label>
          <input type="text" value={form.tags} onChange={set('tags')}
            placeholder="alpe, triglav, visoko (odvojeni zarezom)"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] transition"
          />
        </div>
      </div>

      {/* Sadržaj (markdown) */}
      <div>
        <label className="block text-sm font-semibold text-[#3d2b1f] mb-1.5">
          Opširni opis (Markdown)
        </label>
        <textarea
          rows={12} value={form.content} onChange={set('content')}
          placeholder={`## O izletu\n\nOpiši izlet detaljno...\n\n## Raspored\n\n### Dan 1\n...\n\n## Što je uključeno\n\n- Vodič\n- Prijevoz\n- ...`}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-mono outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition resize-y"
        />
        <p className="text-xs text-stone-400 mt-1">Podržava Markdown: ## Naslov, ### Podnaslov, - lista</p>
      </div>

      {/* Opcije objave */}
      <div className="flex flex-wrap gap-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={setCheck('published')}
            className="w-4 h-4 accent-[#2d5a27]" />
          <span className="text-sm font-medium text-[#3d2b1f]">Objavljeno (vidljivo posjetiteljima)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={setCheck('featured')}
            className="w-4 h-4 accent-[#2d5a27]" />
          <span className="text-sm font-medium text-[#3d2b1f]">Istaknuto (prikazuje se na početnoj)</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full flex items-center justify-center gap-2 bg-[#2d5a27] hover:bg-[#1a3a16] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60 text-base"
      >
        {saving
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Spremanje...</>
          : <><Upload className="w-5 h-5" /> Spremi izlet</>
        }
      </button>
    </form>
  );
}

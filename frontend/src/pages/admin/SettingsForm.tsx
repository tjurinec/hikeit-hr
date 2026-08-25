import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { settingsApi, type SiteSettings } from '../../api';

const EMPTY: SiteSettings = {
  contactEmail: '', phones: [], location: '', locationNote: '',
  workingHours: '', workingHoursNote: '', instagramUrl: '', facebookUrl: '',
  galleryIntro: '',
};

const input = 'w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition';
const label = 'block text-sm font-semibold text-[#3d2b1f] mb-1.5';

export default function SettingsForm() {
  const qc = useQueryClient();
  const [form, setForm] = useState<SiteSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    settingsApi.get()
      .then(d => setForm({ ...EMPTY, ...d, phones: d.phones ?? [] }))
      .catch(() => setError('Ne mogu dohvatiti postavke.'))
      .finally(() => setLoading(false));
  }, []);

  const set = (field: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const setPhone = (i: number, key: 'label' | 'number', value: string) =>
    setForm(f => ({ ...f, phones: f.phones.map((p, idx) => idx === i ? { ...p, [key]: value } : p) }));

  const addPhone = () => setForm(f => ({ ...f, phones: [...f.phones, { label: '', number: '' }] }));
  const removePhone = (i: number) => setForm(f => ({ ...f, phones: f.phones.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await settingsApi.update({ ...form, phones: form.phones.filter(p => p.number.trim()) });
      // Kontakt stranica i footer čitaju iste podatke — osvježi ih odmah
      qc.invalidateQueries({ queryKey: ['settings'] });
      setSuccess('Postavke su spremljene.');
    } catch {
      setError('Spremanje nije uspjelo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Učitavanje...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      <div>
        <label className={label}>Email</label>
        <input type="email" value={form.contactEmail ?? ''} onChange={set('contactEmail')} placeholder="info@hikeit.hr" className={input} />
      </div>

      {/* Telefoni */}
      <div>
        <label className={label}>Telefonski brojevi</label>
        <div className="space-y-2">
          {form.phones.length === 0 && (
            <p className="text-sm text-stone-400">Nema unesenih brojeva — bez njih se odjeljak ne prikazuje na stranici.</p>
          )}
          {form.phones.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={p.label ?? ''}
                onChange={e => setPhone(i, 'label', e.target.value)}
                placeholder="Ime (npr. Tomislav)"
                className={`${input} flex-1`}
              />
              <input
                type="tel"
                value={p.number}
                onChange={e => setPhone(i, 'number', e.target.value)}
                placeholder="+385 91 234 5678"
                className={`${input} flex-1`}
              />
              <button
                type="button"
                onClick={() => removePhone(i)}
                className="px-3 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Ukloni broj"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPhone}
          className="mt-2 flex items-center gap-1.5 text-sm text-[#2d5a27] hover:underline"
        >
          <Plus className="w-4 h-4" /> Dodaj broj
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Lokacija</label>
          <input type="text" value={form.location ?? ''} onChange={set('location')} placeholder="Zagreb, Hrvatska" className={input} />
        </div>
        <div>
          <label className={label}>Napomena uz lokaciju</label>
          <input type="text" value={form.locationNote ?? ''} onChange={set('locationNote')} placeholder="Izleti diljem HR i regije" className={input} />
        </div>
      </div>

      <div>
        <label className={label}>Radno vrijeme</label>
        <textarea
          rows={3}
          value={form.workingHours ?? ''}
          onChange={set('workingHours')}
          placeholder={'Ponedjeljak — Petak: 9:00 — 18:00\nSubota: 10:00 — 14:00'}
          className={`${input} resize-y`}
        />
        <p className="text-xs text-stone-400 mt-1">Svaki redak se prikazuje kao zaseban red.</p>
      </div>

      <div>
        <label className={label}>Napomena uz radno vrijeme</label>
        <input type="text" value={form.workingHoursNote ?? ''} onChange={set('workingHoursNote')} className={input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Instagram</label>
          <input type="url" value={form.instagramUrl ?? ''} onChange={set('instagramUrl')} placeholder="https://instagram.com/..." className={input} />
        </div>
        <div>
          <label className={label}>Facebook</label>
          <input type="url" value={form.facebookUrl ?? ''} onChange={set('facebookUrl')} placeholder="https://facebook.com/..." className={input} />
        </div>
      </div>

      <div className="pt-2 border-t border-stone-200">
        <label className={label}>Uvodni tekst na stranici Galerija</label>
        <textarea
          rows={3}
          value={form.galleryIntro ?? ''}
          onChange={set('galleryIntro')}
          placeholder="Prikazuje se iznad svih galerija."
          className={`${input} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-[#2d5a27] hover:bg-[#1a3a16] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60"
      >
        {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Spremanje...</> : <><Save className="w-5 h-5" /> Spremi postavke</>}
      </button>
    </form>
  );
}

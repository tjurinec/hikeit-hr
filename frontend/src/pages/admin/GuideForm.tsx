import { useState, useRef } from 'react';
import { Upload, Save } from 'lucide-react';
import { guidesApi, uploadApi } from '../../api';
import type { Guide } from '../../types';

interface Props {
  guide?: Guide;
  onSaved: () => void;
  onCancel?: () => void;
}

export default function GuideForm({ guide, onSaved, onCancel }: Props) {
  const [name, setName] = useState(guide?.name ?? '');
  const [specialization, setSpecialization] = useState(guide?.specialization ?? '');
  const [bio, setBio] = useState(guide?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(guide?.avatarUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadApi.image(file);
      setAvatarUrl(url);
    } catch {
      setError('Greška pri uploadu slike.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const data = {
        name: name.trim(),
        specialization: specialization.trim() || null,
        bio: bio.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
      };
      if (guide) {
        await guidesApi.update(guide.id, data);
      } else {
        await guidesApi.create(data);
      }
      onSaved();
    } catch {
      setError('Greška pri spremanju. Provjeri jesi li prijavljen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Ime i prezime *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
          placeholder="npr. Tomislav Jurić"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Specijalizacija</label>
        <input
          type="text"
          value={specialization}
          onChange={e => setSpecialization(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
          placeholder="npr. Visoko planinarenje & Alpinizam"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition resize-none"
          placeholder="Kratki opis vodiča..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Fotografija</label>
        <div className="flex gap-3 items-start">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 flex-shrink-0"
            />
          )}
          <div className="flex-1 space-y-2">
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
              placeholder="https://... ili uploadaj sliku ispod"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg border border-stone-200 hover:border-[#2d5a27] text-stone-600 hover:text-[#2d5a27] transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Uploadanje...' : 'Upload sliku'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="flex items-center gap-2 bg-[#2d5a27] hover:bg-[#1a3a16] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Sprema...' : guide ? 'Spremi promjene' : 'Dodaj vodiča'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm px-6 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:border-stone-300 transition-colors"
          >
            Odustani
          </button>
        )}
      </div>
    </form>
  );
}

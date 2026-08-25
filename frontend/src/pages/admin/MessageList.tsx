import { useEffect, useState } from 'react';
import { Trash2, Loader2, Mail, Phone, Check, RotateCcw } from 'lucide-react';
import { contactApi, type ContactMessage } from '../../api';

export default function MessageList() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [showHandled, setShowHandled] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await contactApi.getAll());
    } catch {
      setError('Ne mogu dohvatiti poruke.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleHandled = async (m: ContactMessage) => {
    setBusyId(m.id);
    try {
      await contactApi.setHandled(m.id, !m.handled);
      await load();
    } catch {
      setError('Promjena statusa nije uspjela.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (m: ContactMessage) => {
    if (!confirm(`Obrisati poruku od ${m.name}?`)) return;
    setBusyId(m.id);
    try {
      await contactApi.delete(m.id);
      await load();
    } catch {
      setError('Brisanje nije uspjelo.');
    } finally {
      setBusyId(null);
    }
  };

  const visible = showHandled ? items : items.filter(m => !m.handled);
  const unhandled = items.filter(m => !m.handled).length;

  if (loading) {
    return <div className="flex items-center gap-2 text-stone-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Učitavanje...</div>;
  }

  return (
    <div className="space-y-3">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          {unhandled === 0 ? 'Nema neriješenih upita.' : `${unhandled} neriješenih upita`}
        </p>
        <label className="flex items-center gap-2 text-sm text-stone-500 cursor-pointer">
          <input type="checkbox" checked={showHandled} onChange={e => setShowHandled(e.target.checked)} className="w-4 h-4 accent-[#2d5a27]" />
          Prikaži i riješene
        </label>
      </div>

      {visible.length === 0 && <p className="text-stone-400 text-sm py-6">Ništa za prikazati.</p>}

      {visible.map(m => (
        <div
          key={m.id}
          className={`p-4 rounded-xl border transition-colors ${m.handled ? 'border-stone-200 bg-stone-50 opacity-70' : 'border-stone-200 bg-white'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[#3d2b1f]">{m.name}</span>
                {m.subject && (
                  <span className="text-xs bg-[#2d5a27]/10 text-[#2d5a27] px-2 py-0.5 rounded-full">{m.subject}</span>
                )}
                <span className="text-xs text-stone-400">
                  {new Date(m.createdAt).toLocaleString('hr-HR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 flex-wrap">
                <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:text-[#2d5a27]">
                  <Mail className="w-3.5 h-3.5" /> {m.email}
                </a>
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="flex items-center gap-1 hover:text-[#2d5a27]">
                    <Phone className="w-3.5 h-3.5" /> {m.phone}
                  </a>
                )}
              </div>
            </div>

            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => toggleHandled(m)}
                disabled={busyId === m.id}
                className="p-2 rounded-lg text-stone-500 hover:text-[#2d5a27] hover:bg-stone-100 transition-colors disabled:opacity-50"
                title={m.handled ? 'Vrati u neriješene' : 'Označi kao riješeno'}
              >
                {busyId === m.id
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : m.handled ? <RotateCcw className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(m)}
                disabled={busyId === m.id}
                className="p-2 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                title="Obriši"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-sm text-stone-700 mt-3 whitespace-pre-wrap">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

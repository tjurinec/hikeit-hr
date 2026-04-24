import { useState } from 'react';
import { Mountain, Lock } from 'lucide-react';
import { setAdminAuth } from '../../api';
import axios from 'axios';

interface Props {
  onLogin: () => void;
}

export default function AdminLoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAdminAuth(username, password);
    try {
      // Provjeri kredencijale pokušajem admin poziva
      await axios.get('/api/excursions/featured', { auth: { username, password } });
      onLogin();
    } catch {
      setError('Pogrešno korisničko ime ili lozinka.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#2d5a27] flex items-center justify-center mx-auto mb-4">
            <Mountain className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#3d2b1f]">Admin pristup</h1>
          <p className="text-stone-500 text-sm mt-1">Vrh & Put — upravljanje sadržajem</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-7 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Korisničko ime</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
              placeholder="tomislav / ana"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#2d5a27] hover:bg-[#1a3a16] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <Lock className="w-4 h-4" />
            }
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>

        <p className="text-center text-xs text-stone-400 mt-5">
          Zadana lozinka: <code className="bg-stone-100 px-1 rounded">admin123</code> — promijeni u produkciji
        </p>
      </div>
    </div>
  );
}

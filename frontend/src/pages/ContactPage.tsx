import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: spojiti na backend /api/contact
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <div className="bg-[#2d5a27] py-16 px-4 text-center text-white mb-14">
        <span className="text-white/60 text-sm uppercase tracking-widest font-semibold">Dođi u kontakt</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-3">Kontakt</h1>
        <p className="text-white/80 max-w-lg mx-auto">
          Imaš pitanje, ideju za izlet ili samo želiš pozdraviti? Javi se — odgovaramo unutar 24 sata.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#3d2b1f] mb-6">Pronađi nas</h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-0.5">Email</p>
                    <a href="mailto:info@hikeit.hr" className="text-[#3d2b1f] hover:text-[#2d5a27] font-medium transition-colors">
                      info@hikeit.hr
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-0.5">Telefon / WhatsApp</p>
                    <a href="tel:+385912345678" className="text-[#3d2b1f] hover:text-[#2d5a27] font-medium transition-colors">
                      +385 91 234 5678
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-0.5">Lokacija</p>
                    <p className="text-[#3d2b1f] font-medium">Zagreb, Hrvatska</p>
                    <p className="text-stone-500 text-sm">Izleti diljem HR i regije</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#3d2b1f] mb-3">Prati nas</h3>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:opacity-90 transition">
                  Facebook
                </a>
              </div>
            </div>

            <div className="bg-[#f5f0e8] rounded-2xl p-5 border border-stone-200">
              <p className="text-sm font-semibold text-[#3d2b1f] mb-1">Radno vrijeme</p>
              <p className="text-sm text-stone-600">Ponedjeljak — Petak: 9:00 — 18:00</p>
              <p className="text-sm text-stone-600">Subota: 10:00 — 14:00</p>
              <p className="text-xs text-stone-400 mt-2">Na terenu smo dostupni i van radnog vremena — pišite slobodno!</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <CheckCircle className="w-16 h-16 text-[#2d5a27] mb-4" />
                <h2 className="font-display text-2xl font-bold text-[#3d2b1f] mb-2">Poruka poslana!</h2>
                <p className="text-stone-600 mb-6">Javit ćemo ti se u roku od 24 sata. Hvala na povjerenju!</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  className="text-[#2d5a27] underline text-sm"
                >
                  Pošalji novu poruku
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 space-y-5">
                <h2 className="font-display text-2xl font-bold text-[#3d2b1f] mb-2">Pošalji poruku</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Ime i prezime *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Ime Prezime"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="tvoj@email.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Telefon</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+385 9x xxx xxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Tema upita</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition bg-white"
                    >
                      <option value="">Odaberi...</option>
                      <option value="rezervacija">Rezervacija izleta</option>
                      <option value="custom">Privatni / custom izlet</option>
                      <option value="info">Opće informacije</option>
                      <option value="suradnja">Suradnja</option>
                      <option value="ostalo">Ostalo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3d2b1f] mb-1.5">Poruka *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Pitaj nas bilo što — o izletima, terminima, grupama, prilagodbi po mjeri..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/20 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#2d5a27] hover:bg-[#1a3a16] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? 'Šaljem...' : 'Pošalji poruku'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

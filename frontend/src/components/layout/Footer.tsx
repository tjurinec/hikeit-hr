import { Link } from 'react-router-dom';
import { Mountain, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a3a16] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-base font-bold font-display">hikeIT.hr</span>
                <span className="block text-[10px] text-white/60 uppercase tracking-widest">Avanturizam</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Vodimo te do vrhova koje nisi ni sanjao. Planinski i turistički izleti po mjeri — sigurno, odgovorno i nezaboravno.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors">
                Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors">
                Facebook
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">Navigacija</h4>
            <ul className="flex flex-col gap-2">
              {[
                { to: '/izleti', label: 'Svi izleti' },
                { to: '/galerija', label: 'Galerija' },
                { to: '/o-nama', label: 'O nama' },
                { to: '/kontakt', label: 'Kontakt' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">Kontakt</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@hikeit.hr" className="hover:text-white transition-colors">info@hikeit.hr</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+385912345678" className="hover:text-white transition-colors">+385 91 234 5678</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Zagreb, Hrvatska</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <span>© {new Date().getFullYear()} hikeIT.hr. Sva prava pridržana.</span>
          <span>Izrađeno s ❤️ za planine</span>
        </div>
      </div>
    </footer>
  );
}

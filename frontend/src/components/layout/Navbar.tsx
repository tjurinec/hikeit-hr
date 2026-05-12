import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Mountain } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Početna' },
  { to: '/izleti', label: 'Izleti' },
  { to: '/galerija', label: 'Galerija' },
  { to: '/o-nama', label: 'O nama' },
  { to: '/kontakt', label: 'Kontakt' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <div className="w-9 h-9 rounded-full bg-[#2d5a27] flex items-center justify-center">
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-[#2d5a27] tracking-wide font-display">hikeIT.hr</span>
            <span className="block text-[10px] text-[#8b7355] uppercase tracking-widest">Avanturizam</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2d5a27] text-white'
                      : 'text-[#3d2b1f] hover:bg-[#2d5a27]/10 hover:text-[#2d5a27]'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <a
          href="#rezervacija"
          className="hidden md:inline-flex items-center gap-2 bg-[#2d5a27] hover:bg-[#1a3a16] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          Rezerviraj
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[#3d2b1f] hover:bg-stone-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-3">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2d5a27] text-white'
                        : 'text-[#3d2b1f] hover:bg-[#2d5a27]/10'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <a
            href="#rezervacija"
            className="mt-3 flex items-center justify-center bg-[#2d5a27] text-white text-sm font-semibold px-5 py-3 rounded-full"
            onClick={() => setOpen(false)}
          >
            Rezerviraj izlet
          </a>
        </div>
      )}
    </header>
  );
}

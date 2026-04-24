import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  thumb: string;
  caption: string;
  location: string;
  category: 'planine' | 'mora' | 'kultura' | 'priroda';
}

const PHOTOS: Photo[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', caption: 'Triglav — Vrh iznad oblaka', location: 'Julijske Alpe', category: 'planine' },
  { id: 2, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', caption: 'Velebitska šuma', location: 'Velebit', category: 'priroda' },
  { id: 3, url: 'https://images.unsplash.com/photo-1555990793-da11153b6BE8?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1555990793-da11153b6BE8?w=600&q=80', caption: 'Dubrovnik iz zraka', location: 'Dubrovnik', category: 'kultura' },
  { id: 4, url: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600&q=80', caption: 'Plitvička jezera', location: 'Lika', category: 'priroda' },
  { id: 5, url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80', caption: 'Šuma na Risnjaku', location: 'Gorski Kotar', category: 'priroda' },
  { id: 6, url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80', caption: 'Zora na Biokovu', location: 'Biokovo', category: 'planine' },
  { id: 7, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', caption: 'Planinska panorama', location: 'Alpe', category: 'planine' },
  { id: 8, url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80', caption: 'Treking staza', location: 'Dinaridi', category: 'planine' },
  { id: 9, url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80', caption: 'Jadransko more', location: 'Dalmacija', category: 'mora' },
  { id: 10, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', caption: 'Plaža na Elafitima', location: 'Elafitski otoci', category: 'mora' },
  { id: 11, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80', caption: 'Zvjezdano nebo planine', location: 'Velebit', category: 'planine' },
  { id: 12, url: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=1200&q=90', thumb: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=600&q=80', caption: 'Stari grad', location: 'Hrvatska', category: 'kultura' },
];

const CATEGORIES = ['sve', 'planine', 'mora', 'kultura', 'priroda'] as const;
const CAT_LABELS: Record<string, string> = {
  sve: 'Sve', planine: 'Planine', mora: 'Mora & Otoci', kultura: 'Kultura', priroda: 'Priroda',
};

export default function GalleryPage() {
  const [active, setActive] = useState<string>('sve');
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const filtered = active === 'sve' ? PHOTOS : PHOTOS.filter(p => p.category === active);

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <div className="bg-[#2d5a27] py-16 px-4 text-center text-white mb-10">
        <span className="text-white/60 text-sm uppercase tracking-widest font-semibold">Naše fotografije</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-3">Galerija</h1>
        <p className="text-white/80 max-w-lg mx-auto">
          Svaka fotografija je priča. Ovo su trenuci koje smo živjeli zajedno s našim gostima.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                active === cat
                  ? 'bg-[#2d5a27] text-white border-[#2d5a27]'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-[#2d5a27] hover:text-[#2d5a27]'
              }`}
            >
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filtered.map(photo => (
            <div
              key={photo.id}
              className="relative group cursor-pointer break-inside-avoid rounded-xl overflow-hidden"
              onClick={() => setLightbox(photo)}
            >
              <img
                src={photo.thumb}
                alt={photo.caption}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium">{photo.caption}</p>
                <p className="text-white/70 text-xs">{photo.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} className="max-h-[85vh] max-w-full object-contain rounded-lg" />
            <div className="text-center mt-4">
              <p className="text-white font-medium">{lightbox.caption}</p>
              <p className="text-white/60 text-sm">{lightbox.location}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

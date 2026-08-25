import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ZoomIn } from 'lucide-react';
import { galleryApi, thumbOf } from '../api';
import type { GalleryImage } from '../types';

export default function GalleryPage() {
  const [active, setActive] = useState<string>('sve');
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const { data: photos = [], isLoading, isError } = useQuery({
    queryKey: ['gallery'],
    queryFn: galleryApi.getAll,
  });

  // Kategorije se izvode iz sadržaja — nema fiksnog popisa koji bi se razišao s bazom
  const categories = useMemo(
    () => ['sve', ...new Set(photos.map(p => p.category).filter((c): c is string => !!c))],
    [photos],
  );

  const filtered = active === 'sve' ? photos : photos.filter(p => p.category === active);

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
          {categories.length > 1 && categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                active === cat
                  ? 'bg-[#2d5a27] text-white border-[#2d5a27]'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-[#2d5a27] hover:text-[#2d5a27]'
              }`}
            >
              {cat === 'sve' ? 'Sve' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-center text-stone-400 py-16">Učitavanje galerije...</p>}
        {isError && <p className="text-center text-stone-400 py-16">Trenutno ne mogu dohvatiti galeriju.</p>}
        {!isLoading && !isError && photos.length === 0 && (
          <p className="text-center text-stone-400 py-16">Galerija je još prazna.</p>
        )}

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filtered.map(photo => (
            <div
              key={photo.id}
              className="relative group cursor-pointer break-inside-avoid rounded-xl overflow-hidden"
              onClick={() => setLightbox(photo)}
            >
              <img
                src={thumbOf(photo.url)}
                alt={photo.caption ?? ''}
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
            <img src={lightbox.url} alt={lightbox.caption ?? ''} className="max-h-[85vh] max-w-full object-contain rounded-lg" />
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

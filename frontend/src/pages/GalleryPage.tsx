import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { X, ExternalLink, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryApi, thumbOf } from '../api';
import { useSettings } from '../hooks/useSettings';
import type { GalleryImage } from '../types';

const PER_PAGE = 9;
const OPIS_MAX = 100;

function skrati(text: string, max = OPIS_MAX) {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max) > 0 ? text.lastIndexOf(' ', max) : max) + '…';
}

export default function GalleryPage() {
  const settings = useSettings();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState<GalleryImage | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['gallery', 'page', page],
    queryFn: () => galleryApi.getPage(page, PER_PAGE),
  });

  const visible = data?.content ?? [];
  const pages = data?.totalPages ?? 0;

  // Otvorena galerija dolazi iz URL-a (/galerija/:id), pa je link dijeljiv
  const { data: open } = useQuery({
    queryKey: ['gallery', 'one', id],
    queryFn: () => galleryApi.getById(Number(id)),
    enabled: !!id,
    // Kad je galerija već na ovoj stranici, nema potrebe za novim zahtjevom;
    // dohvat ostaje za dolazak izravnim linkom
    initialData: () => visible.find(g => g.id === Number(id)),
  });

  // Sljedeća stranica se dohvaća u pozadini da klik bude trenutačan
  useEffect(() => {
    if (page + 1 < pages) {
      qc.prefetchQuery({
        queryKey: ['gallery', 'page', page + 1],
        queryFn: () => galleryApi.getPage(page + 1, PER_PAGE),
      });
    }
  }, [page, pages, qc]);

  const goTo = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Zatvaranje tipkom Esc: prvo uvećana slika, pa modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (zoom) setZoom(null);
      else if (open) navigate('/galerija');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom, open, navigate]);

  return (
    <main className="pt-24 pb-20">
      <div className="bg-[#2d5a27] py-16 px-4 text-center text-white mb-10">
        <span className="text-white/60 text-sm uppercase tracking-widest font-semibold">Naše fotografije</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-3">Galerija</h1>
        <p className="text-white/80 max-w-lg mx-auto whitespace-pre-line">
          {settings?.galleryIntro || 'Svaka fotografija je priča. Ovo su trenuci koje smo živjeli zajedno s našim gostima.'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {isLoading && <p className="text-center text-stone-400 py-16">Učitavanje galerije...</p>}
        {isError && <p className="text-center text-stone-400 py-16">Trenutno ne mogu dohvatiti galeriju.</p>}
        {!isLoading && !isError && visible.length === 0 && (
          <p className="text-center text-stone-400 py-16">Galerija je još prazna.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map(g => (
            <article
              key={g.id}
              onClick={() => navigate(`/galerija/${g.id}`)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                {g.images[0] && (
                  <img
                    src={thumbOf(g.images[0].url)}
                    alt={g.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {g.images.length > 1 && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 flex justify-end">
                    <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
                      <Images className="w-4 h-4" />
                      +{g.images.length - 1}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h2 className="font-display text-lg font-bold text-[#3d2b1f] group-hover:text-[#2d5a27] transition-colors">
                  {g.title}
                </h2>
                {g.description && (
                  <p className="text-stone-600 text-sm mt-1.5" title={g.description}>
                    {skrati(g.description)}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {pages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goTo(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:border-[#2d5a27] disabled:opacity-40 disabled:hover:border-stone-200 transition"
              aria-label="Prethodna stranica"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium border transition ${
                  i === page
                    ? 'bg-[#2d5a27] text-white border-[#2d5a27]'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-[#2d5a27]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goTo(Math.min(pages - 1, page + 1))}
              disabled={page === pages - 1}
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:border-[#2d5a27] disabled:opacity-40 disabled:hover:border-stone-200 transition"
              aria-label="Sljedeća stranica"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>

      {/* Modal s galerijom */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-4 overflow-y-auto" onClick={() => navigate('/galerija')}>
          <div
            className="bg-[#f5f0e8] rounded-2xl max-w-5xl w-full my-8 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-stone-200">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#3d2b1f]">{open.title}</h2>
                {open.description && (
                  <p className="text-stone-600 text-sm mt-2 whitespace-pre-line">{open.description}</p>
                )}
                {open.externalUrl && (
                  <a
                    href={open.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-[#2d5a27] hover:underline"
                  >
                    Pogledaj cijelu galeriju <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <button
                onClick={() => navigate('/galerija')}
                className="p-2 rounded-full text-stone-500 hover:bg-stone-200 transition-colors shrink-0"
                aria-label="Zatvori"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {open.images.map(img => (
                <button
                  key={img.id}
                  onClick={() => setZoom(img)}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={thumbOf(img.url)}
                    alt={img.caption ?? open.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Uvećana pojedina slika */}
      {zoom && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoom(null)}>
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10"
            onClick={() => setZoom(null)}
            aria-label="Zatvori"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-full" onClick={e => e.stopPropagation()}>
            <img src={zoom.url} alt={zoom.caption ?? ''} className="max-h-[85vh] max-w-full object-contain rounded-lg" />
            {(zoom.caption || zoom.location) && (
              <div className="text-center mt-4">
                {zoom.caption && <p className="text-white font-medium">{zoom.caption}</p>}
                {zoom.location && <p className="text-white/60 text-sm">{zoom.location}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

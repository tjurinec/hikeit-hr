import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { excursionsApi } from '../api';
import { ArrowLeft, Clock, Users, MapPin, Calendar, Star, ChevronRight } from 'lucide-react';
import DifficultyBadge from '../components/ui/DifficultyBadge';

function renderContent(md: string) {
  return md.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="font-display text-2xl font-bold text-[#3d2b1f] mt-8 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="font-semibold text-lg text-[#2d5a27] mt-5 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-stone-700 mb-1 list-disc">{line.slice(2)}</li>;
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return <p key={i} className="text-stone-700 leading-relaxed">{line}</p>;
  });
}

export default function ExcursionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: excursion, isLoading } = useQuery({
    queryKey: ['excursion', slug],
    queryFn: () => excursionsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <main className="pt-32 pb-20 text-center text-stone-400">Učitavanje izleta...</main>;
  }

  if (!excursion) {
    return (
      <main className="pt-28 pb-20 text-center">
        <h1 className="font-display text-3xl text-[#3d2b1f]">Izlet nije pronađen</h1>
        <Link to="/izleti" className="mt-4 inline-flex items-center gap-1 text-[#2d5a27] underline">
          <ArrowLeft className="w-4 h-4" /> Natrag na izlete
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-16">
      {/* Hero image */}
      <div className="relative h-[50vh] min-h-80 overflow-hidden">
        <img src={excursion.coverImageUrl} alt={excursion.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <nav className="flex items-center gap-1 text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Početna</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/izleti" className="hover:text-white transition-colors">Izleti</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{excursion.title}</span>
          </nav>
          <div className="flex flex-wrap gap-2 items-center">
            <DifficultyBadge difficulty={excursion.difficulty} />
            {excursion.tags.map(t => (
              <span key={t} className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">{t}</span>
            ))}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3">{excursion.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <p className="text-lg text-stone-600 mb-6 leading-relaxed">{excursion.description}</p>

            {excursion.imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {excursion.imageUrls.map((url, i) => (
                  <img key={i} src={url} alt="" className="rounded-xl object-cover h-40 w-full" />
                ))}
              </div>
            )}

            <div className="prose max-w-none">
              {renderContent(excursion.content)}
            </div>

            {/* Guide */}
            <div className="mt-12 p-6 bg-[#f5f0e8] rounded-2xl border border-stone-200">
              <h3 className="font-display text-xl font-bold text-[#3d2b1f] mb-4">Vaš vodič</h3>
              <div className="flex items-start gap-4">
                <img
                  src={excursion.guide.avatarUrl ?? undefined}
                  alt={excursion.guide.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-[#3d2b1f] text-lg">{excursion.guide.name}</p>
                  <p className="text-[#2d5a27] text-sm font-medium mb-2">{excursion.guide.specialization}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{excursion.guide.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden">
              <div className="bg-[#2d5a27] p-6 text-white">
                <div className="text-3xl font-bold font-display">{excursion.price} €</div>
                <div className="text-white/70 text-sm">po osobi, sve uključeno</div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-[#2d5a27] flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#3d2b1f]">Trajanje: </span>
                    <span className="text-stone-600">{excursion.durationDays} {excursion.durationDays === 1 ? 'dan' : 'dana'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-5 h-5 text-[#2d5a27] flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#3d2b1f]">Maks. sudionika: </span>
                    <span className="text-stone-600">{excursion.maxParticipants}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-[#2d5a27] flex-shrink-0" />
                  <div>
                    <span className="font-medium text-[#3d2b1f]">Polazna točka: </span>
                    <span className="text-stone-600">{excursion.startingPoint}</span>
                  </div>
                </div>
                {excursion.nextDeparture && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-[#2d5a27] flex-shrink-0" />
                    <div>
                      <span className="font-medium text-[#3d2b1f]">Sljedeći polazak: </span>
                      <span className="text-stone-600">{new Date(excursion.nextDeparture).toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100">
                  <a
                    href="#"
                    className="block w-full text-center bg-[#2d5a27] hover:bg-[#1a3a16] text-white font-semibold py-3.5 rounded-xl transition-colors cursor-not-allowed opacity-80"
                    title="Online plaćanje uskoro!"
                  >
                    Rezerviraj — uskoro!
                  </a>
                  <a
                    href="mailto:info@hikeit.hr"
                    className="block w-full text-center mt-3 border border-[#2d5a27] text-[#2d5a27] hover:bg-[#2d5a27]/5 font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    Pošalji upit emailom
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>5.0 (12 recenzija)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

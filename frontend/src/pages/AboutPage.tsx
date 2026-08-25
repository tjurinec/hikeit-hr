import { useQuery } from '@tanstack/react-query';
import { Mountain, Award, Heart, User } from 'lucide-react';
import { guidesApi } from '../api';

const VALUES = [
  {
    icon: <Mountain className="w-6 h-6" />,
    title: 'Autentičnost',
    desc: 'Skrivene staze, lokalna hrana, prave priče — bez turističkih klišeja i masovnih grupnih izleta.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Strast',
    desc: 'Volimo ono što radimo. I to se osjeti. Svaki izlet planiramo kao da ga organiziramo za sebe.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Profesionalnost',
    desc: 'Certifikati, iskustvo i oprema — sve da bi tvoja sigurnost i ugoda bili na prvom mjestu.',
  },
];

export default function AboutPage() {
  const { data: guides = [], isLoading } = useQuery({
    queryKey: ['guides'],
    queryFn: guidesApi.getAll,
  });

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#1a3a16] py-20 px-4 text-center text-white mb-16">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=80)' }}
        />
        <div className="relative max-w-3xl mx-auto">
          <span className="text-white/60 text-sm uppercase tracking-widest font-semibold">Naša priča</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-4">O Nama</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            hikeIT.hr je nastao iz jednostavne ideje — dijeliti ljubav prema prirodi, kulturi i pustolovini
            s ljudima koji žele nešto više od prosječnog godišnjeg odmora.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#3d2b1f] mb-4">Kako je sve počelo</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Dvoje prijatelja, zajednička ljubav prema planinama i moru, i uvjerenje da Hrvatska i regija 
              nude nešto nevjerojatno — to je bio početak. Tomislav je godinama vodio planinare po Velebitu 
              i Alpama, Ana je upoznavala putnike s tajnama dalmatinskih gradova i otoka.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Jednog dana smo se pitali: zašto ne spojimo te dvije perspektive? Zašto ne napravimo agenciju 
              koja nudi i visoko planinarenje i kulturne ture — sve s istom razinom strasti i profesionalnosti?
            </p>
            <p className="text-stone-600 leading-relaxed">
              Tako je nastao <strong className="text-[#2d5a27]">hikeIT.hr</strong> — mali, strastveni tim
              koji vjeruje da prava avantura mijenja ljude iznutra.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80"
              alt="Planinski pejzaž"
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-4 -left-4 bg-[#2d5a27] text-white rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold font-display">8+</div>
              <div className="text-xs text-white/80">godina iskustva</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f5f0e8] py-16 px-4 mb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-[#3d2b1f]">Naše vrijednosti</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-7 text-center shadow-sm border border-stone-100">
                <div className="w-14 h-14 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-[#3d2b1f] text-lg mb-2">{title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[#2d5a27] font-semibold text-sm uppercase tracking-widest">Upoznaj nas</span>
          <h2 className="font-display text-3xl font-bold text-[#3d2b1f] mt-2">Naš Tim</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {isLoading && <p className="col-span-full text-center text-stone-400 py-10">Učitavanje...</p>}
          {!isLoading && guides.length === 0 && (
            <p className="col-span-full text-center text-stone-400 py-10">Vodiči će uskoro biti predstavljeni.</p>
          )}
          {guides.map(guide => (
            <div key={guide.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-lg transition-shadow">
              <div className="relative h-64 bg-stone-100">
                {guide.avatarUrl ? (
                  <img src={guide.avatarUrl} alt={guide.name} loading="lazy" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <User className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <h3 className="font-display text-2xl font-bold text-white">{guide.name}</h3>
                </div>
              </div>
              <div className="p-6">
                {guide.specialization && (
                  <p className="text-[#2d5a27] font-semibold text-sm mb-3">{guide.specialization}</p>
                )}
                {guide.bio && (
                  <p className="text-stone-600 text-sm leading-relaxed">{guide.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

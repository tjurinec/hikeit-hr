import { Link } from 'react-router-dom';
import { thumbOf } from '../../api';
import { Clock, Users, MapPin, ArrowRight, Mountain } from 'lucide-react';
import type { Excursion } from '../../types';
import DifficultyBadge from './DifficultyBadge';

export default function ExcursionCard({ excursion }: { excursion: Excursion }) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100">
      <Link to={`/izleti/${excursion.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          {excursion.coverImageUrl ? (
            <img
              src={thumbOf(excursion.coverImageUrl)}
              alt={excursion.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            // Bez slike ide neutralno polje — stock fotografija bi se čitala kao
            // fotografija baš tog izleta
            <div className="w-full h-full bg-stone-100 flex items-center justify-center">
              <Mountain className="w-12 h-12 text-stone-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-3 left-3">
            <DifficultyBadge difficulty={excursion.difficulty} />
          </div>
          {excursion.price && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-[#2d5a27] font-bold text-base">{excursion.price} €</span>
              <span className="text-stone-500 text-xs">/osobi</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs text-[#8b7355] mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{excursion.location}</span>
        </div>

        <Link to={`/izleti/${excursion.slug}`}>
          <h3 className="font-display text-lg font-bold text-[#3d2b1f] group-hover:text-[#2d5a27] transition-colors leading-snug mb-2">
            {excursion.title}
          </h3>
        </Link>

        <p className="text-sm text-stone-600 line-clamp-2 mb-4">{excursion.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {excursion.durationDays} {excursion.durationDays === 1 ? 'dan' : 'dana'}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              do {excursion.maxParticipants}
            </span>
          </div>
          <Link
            to={`/izleti/${excursion.slug}`}
            className="flex items-center gap-1 text-sm font-semibold text-[#2d5a27] hover:gap-2 transition-all"
          >
            Više <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

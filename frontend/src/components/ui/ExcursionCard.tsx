import { Link } from 'react-router-dom';
import { Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import type { Excursion } from '../../types';
import DifficultyBadge from './DifficultyBadge';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80';

export default function ExcursionCard({ excursion }: { excursion: Excursion }) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100">
      <Link to={`/izleti/${excursion.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={excursion.coverImageUrl || PLACEHOLDER}
            alt={excursion.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
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

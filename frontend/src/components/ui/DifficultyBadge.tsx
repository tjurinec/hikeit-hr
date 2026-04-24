import type { Excursion } from '../../types';

const config: Record<Excursion['difficulty'], { label: string; className: string }> = {
  EASY: { label: 'Lagano', className: 'bg-emerald-100 text-emerald-800' },
  MODERATE: { label: 'Umjereno', className: 'bg-amber-100 text-amber-800' },
  HARD: { label: 'Teško', className: 'bg-orange-100 text-orange-800' },
  EXPERT: { label: 'Ekspert', className: 'bg-red-100 text-red-800' },
};

export default function DifficultyBadge({ difficulty }: { difficulty: Excursion['difficulty'] }) {
  const { label, className } = config[difficulty];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

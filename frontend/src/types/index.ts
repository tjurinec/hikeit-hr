export interface Excursion {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: 'EASY' | 'MODERATE' | 'HARD' | 'EXPERT';
  durationDays: number;
  maxParticipants: number;
  price: number;
  coverImageUrl: string;
  imageUrls: string[];
  location: string;
  startingPoint: string;
  guide: Guide;
  tags: string[];
  // Opcionalni jer ih demo podaci po stranicama nemaju; API ih uvijek vraća
  featured?: boolean;
  published?: boolean;
  publishedAt: string;
  nextDeparture?: string;
}

export interface Guide {
  id: number;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  specialization: string | null;
}

export interface GalleryImage {
  id: number;
  url: string;
  caption: string | null;
  location: string | null;
  category: string | null;
  excursionTitle?: string | null;
}

export type DifficultyLabel = {
  [K in Excursion['difficulty']]: { label: string; color: string };
};

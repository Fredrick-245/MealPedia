export type Chef = {
  id: string;
  name: string;
  fullName: string;
  handle: string;
  avatarUrl: string;
  recipeCount: number;
  followingCount: number;
  followersCount: number;
  following: boolean;
  bio: string;
  whatsapp: string;
  facebook: string;
  twitter: string;
  instagram: string;
  website: string;
  location: string;
  joinedLabel: string;
  views: number;
};

export type Person = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  following: boolean;
};

export function formatCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `${value}`;
}

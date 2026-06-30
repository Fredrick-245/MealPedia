export const CURRENT_USER_AVATAR = 'https://i.pravatar.cc/100?img=68';

export type Ingredient = {
  text: string;
  emoji: string;
};

export type InstructionStep = {
  text: string;
  images: string[];
};

export type RecipeDetail = {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTime: string;
  origin: string;
  isOwn: boolean;
  imageUrl: string;
  galleryUrls: string[];
  authorName: string;
  authorHandle: string;
  authorAvatarUrl: string;
  category: string;
  foodCategory: string | null;
  bookmarked: boolean;
  servings: number;
  calories: number;
  commentCount: number;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
};

export type RecipeComment = {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  likes: number;
  timeLabel: string;
};

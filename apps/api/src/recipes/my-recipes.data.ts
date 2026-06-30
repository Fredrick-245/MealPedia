import { Recipe } from './recipe.entity';

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;

const YOU_AVATAR = 'https://i.pravatar.cc/100?img=68';

type OwnSeed = { title: string; image: string; food: string; published: boolean };

const OWN: OwnSeed[] = [
  // Drafts
  { title: 'Vegetable Fruit Salad Simple Recipe', image: 'photo-1512621776951-a57141f2eefd', food: 'Salad', published: false },
  { title: 'Original Burger & Special French Fries', image: 'photo-1568901346375-23c9450c58cd', food: 'Burger', published: false },
  { title: 'Seasoned Fried Shrimp Seafood', image: 'photo-1625938145744-e380515399b7', food: 'Seafood', published: false },
  { title: 'Tuna, Salmon and Sour Vinegar Sushi', image: 'photo-1553621042-f6e147245754', food: 'Sushi', published: false },
  { title: 'Sweet Birthday Cake with Berries', image: 'photo-1558636508-e0db3814bd1d', food: 'Cake', published: false },
  // Published
  { title: 'Vegetable, Fruit and Meat Salad', image: 'photo-1546069901-ba9599a7e63c', food: 'Salad', published: true },
  { title: 'Sweet and Spicy Beef Soup Recipe', image: 'photo-1604152135912-04a022e23696', food: 'Beef', published: true },
  { title: 'Chicken Noodles with Vegetables', image: 'photo-1569718212165-3a8278d5f624', food: 'Noodles', published: true },
  { title: 'Pan-Seared Salmon with Fresh Herbs', image: 'photo-1467003909585-2f8a72700288', food: 'Seafood', published: true },
  { title: 'Classic Margherita Pizza at Home', image: 'photo-1513104890138-7c749659a591', food: 'Pizza', published: true },
];

export const MY_RECIPES_SEED: Partial<Recipe>[] = OWN.map((r) => ({
  title: r.title,
  description: 'One of your own creations, ready to cook and share.',
  prepTimeMinutes: 25,
  cookTime: '25 mins',
  origin: 'United States of America',
  imageUrl: img(r.image),
  galleryUrls: [img(r.image)],
  authorName: 'You',
  authorHandle: '@you',
  authorAvatarUrl: YOU_AVATAR,
  category: 'yours',
  foodCategory: r.food,
  bookmarked: false,
  servings: 2,
  calories: 180,
  commentCount: 0,
  isOwn: true,
  isSeed: true,
  published: r.published,
}));

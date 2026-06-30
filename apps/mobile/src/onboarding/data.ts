import { CookingLevel } from './types';

export type Country = {
  code: string;
  name: string;
  flag: string;
};

export const countries: Country[] = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
];

export type CookingLevelOption = {
  value: CookingLevel;
  title: string;
  description: string;
  emoji: string;
};

export const cookingLevels: CookingLevelOption[] = [
  {
    value: 'beginner',
    title: 'Beginner',
    description: 'Just getting started — simple recipes with step-by-step guidance.',
    emoji: '🥄',
  },
  {
    value: 'intermediate',
    title: 'Intermediate',
    description: 'Comfortable in the kitchen and ready to try new techniques.',
    emoji: '🍳',
  },
  {
    value: 'advanced',
    title: 'Advanced',
    description: 'Confident cook looking for challenging, complex dishes.',
    emoji: '👨‍🍳',
  },
];

export type PreferenceOption = {
  id: string;
  label: string;
  emoji: string;
};

export const cuisines: PreferenceOption[] = [
  { id: 'italian', label: 'Italian', emoji: '🍕' },
  { id: 'breakfast', label: 'Breakfast', emoji: '🍳' },
  { id: 'salad', label: 'Salads', emoji: '🥗' },
  { id: 'soup', label: 'Soups', emoji: '🍲' },
  { id: 'mexican', label: 'Mexican', emoji: '🌮' },
  { id: 'japanese', label: 'Japanese', emoji: '🍱' },
  { id: 'chinese', label: 'Chinese', emoji: '🥡' },
  { id: 'indian', label: 'Indian', emoji: '🍛' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'seafood', label: 'Seafood', emoji: '🦐' },
  { id: 'bbq', label: 'BBQ', emoji: '🍖' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
  { id: 'pasta', label: 'Pasta', emoji: '🍝' },
  { id: 'thai', label: 'Thai', emoji: '🍜' },
  { id: 'bakery', label: 'Bakery', emoji: '🥐' },
];

export const dietaryOptions: PreferenceOption[] = [
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
  { id: 'keto', label: 'Keto', emoji: '🥑' },
  { id: 'halal', label: 'Halal', emoji: '🕌' },
  { id: 'kosher', label: 'Kosher', emoji: '✡️' },
  { id: 'nut-free', label: 'Nut-Free', emoji: '🥜' },
  { id: 'low-carb', label: 'Low-Carb', emoji: '🍗' },
  { id: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
  { id: 'paleo', label: 'Paleo', emoji: '🍠' },
  { id: 'none', label: 'No Restrictions', emoji: '🍽️' },
];

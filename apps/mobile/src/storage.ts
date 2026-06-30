import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingData } from './onboarding/types';

const ONBOARDING_KEY = 'cookpedia.onboarding.v1';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value != null;
  } catch {
    return false;
  }
}

export async function saveOnboarding(data: OnboardingData): Promise<void> {
  // Persist everything except the password.
  const safe = {
    country: data.country,
    cookingLevel: data.cookingLevel,
    cuisines: data.cuisines,
    dietary: data.dietary,
    profile: data.profile,
    account: {
      username: data.account.username,
      email: data.account.email,
      rememberMe: data.account.rememberMe,
    },
    completedAt: Date.now(),
  };
  await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(safe));
}

export type StoredProfile = {
  fullName: string;
  username: string;
  email: string;
  avatarUri: string | null;
  phoneNumber: string;
  gender: string | null;
  dateOfBirth: string;
  country: string | null;
};

export async function getStoredProfile(): Promise<StoredProfile | null> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    if (value == null) return null;
    const data = JSON.parse(value);
    return {
      fullName: data?.profile?.fullName ?? '',
      username: data?.account?.username ?? '',
      email: data?.account?.email ?? '',
      avatarUri: data?.profile?.avatarUri ?? null,
      phoneNumber: data?.profile?.phoneNumber ?? '',
      gender: data?.profile?.gender ?? null,
      dateOfBirth: data?.profile?.dateOfBirth ?? '',
      country: data?.country ?? null,
    };
  } catch {
    return null;
  }
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(ONBOARDING_KEY);
}

const RECENT_SEARCH_KEY = 'cookpedia.recentSearches.v1';

const DEFAULT_RECENT_SEARCHES = [
  'Classic Lasagna',
  'Spicy Chicken Tacos',
  'Pesto Pasta Salad',
  'Vegetable Stir-Fry',
  'Fettuccine Alfredo',
  'Tomato Basil Soup',
  'Creamy Garlic Shrimp',
  'Chocolate Chip Cookies',
];

export async function getRecentSearches(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
    if (value == null) {
      await AsyncStorage.setItem(
        RECENT_SEARCH_KEY,
        JSON.stringify(DEFAULT_RECENT_SEARCHES),
      );
      return DEFAULT_RECENT_SEARCHES;
    }
    return JSON.parse(value) as string[];
  } catch {
    return DEFAULT_RECENT_SEARCHES;
  }
}

export async function addRecentSearch(term: string): Promise<string[]> {
  const trimmed = term.trim();
  if (!trimmed) return getRecentSearches();
  const current = await getRecentSearches();
  const next = [trimmed, ...current.filter((t) => t !== trimmed)].slice(0, 12);
  await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
  return next;
}

export async function removeRecentSearch(term: string): Promise<string[]> {
  const current = await getRecentSearches();
  const next = current.filter((t) => t !== term);
  await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
  return next;
}

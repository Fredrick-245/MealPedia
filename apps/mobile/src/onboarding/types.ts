export type CookingLevel = 'beginner' | 'intermediate' | 'advanced';

export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';

export type ProfileDetails = {
  avatarUri: string | null;
  fullName: string;
  phoneNumber: string;
  gender: Gender | null;
  dateOfBirth: string;
};

export type AccountDetails = {
  username: string;
  email: string;
  password: string;
  rememberMe: boolean;
};

export type OnboardingData = {
  country: string | null;
  cookingLevel: CookingLevel | null;
  cuisines: string[];
  dietary: string[];
  profile: ProfileDetails;
  account: AccountDetails;
};

export const emptyOnboardingData: OnboardingData = {
  country: null,
  cookingLevel: null,
  cuisines: [],
  dietary: [],
  profile: {
    avatarUri: null,
    fullName: '',
    phoneNumber: '',
    gender: null,
    dateOfBirth: '',
  },
  account: {
    username: '',
    email: '',
    password: '',
    rememberMe: false,
  },
};

export const genderOptions: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

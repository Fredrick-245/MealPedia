import { getApiUrl } from '../config/api';
import { OnboardingData } from './types';

export type SignupResult = {
  id: string;
  username: string;
  email: string;
  fullName: string;
};

function buildPayload(data: OnboardingData) {
  const { profile, account } = data;
  return {
    fullName: profile.fullName.trim(),
    phoneNumber: profile.phoneNumber.trim(),
    gender: profile.gender ?? undefined,
    dateOfBirth: profile.dateOfBirth,
    avatarUri: profile.avatarUri ?? undefined,
    country: data.country ?? undefined,
    cookingLevel: data.cookingLevel ?? undefined,
    cuisines: data.cuisines,
    dietary: data.dietary,
    username: account.username.trim(),
    email: account.email.trim(),
    password: account.password,
  };
}

export async function signupUser(data: OnboardingData): Promise<SignupResult> {
  const response = await fetch(`${getApiUrl()}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPayload(data)),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(body?.message)
      ? body.message.join('\n')
      : body?.message ?? 'Something went wrong creating your account.';
    throw new Error(message);
  }

  return body.user as SignupResult;
}

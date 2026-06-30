import { OnboardingData } from './types';

export type StepProps = {
  step: number;
  totalSteps: number;
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  onBack?: () => void;
  onNext: () => void;
  submitting?: boolean;
  submitError?: string | null;
};

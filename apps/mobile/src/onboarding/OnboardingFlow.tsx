import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { emptyOnboardingData, OnboardingData } from './types';
import { StepProps } from './StepProps';
import { CountryStep } from './steps/CountryStep';
import { CookingLevelStep } from './steps/CookingLevelStep';
import { CuisineStep } from './steps/CuisineStep';
import { DietaryStep } from './steps/DietaryStep';
import { ProfileStep } from './steps/ProfileStep';
import { AccountStep } from './steps/AccountStep';
import { SuccessModal } from './components/SuccessModal';
import { signupUser } from './signup';

type OnboardingFlowProps = {
  onComplete: (data: OnboardingData) => void;
};

const steps: React.ComponentType<StepProps>[] = [
  CountryStep,
  CookingLevelStep,
  CuisineStep,
  DietaryStep,
  ProfileStep,
  AccountStep,
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>(emptyOnboardingData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalSteps = steps.length;
  const StepComponent = steps[stepIndex];

  function update(patch: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleBack() {
    setStepIndex((index) => Math.max(0, index - 1));
  }

  async function handleNext() {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((index) => index + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await signupUser(data);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not create your account.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <StepComponent
        step={stepIndex}
        totalSteps={totalSteps}
        data={data}
        update={update}
        onBack={stepIndex > 0 ? handleBack : undefined}
        onNext={handleNext}
        submitting={submitting}
        submitError={submitError}
      />
      <SuccessModal visible={showSuccess} onContinue={() => onComplete(data)} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

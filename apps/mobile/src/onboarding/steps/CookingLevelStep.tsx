import React from 'react';
import { StepScreen } from '../components/StepScreen';
import { OptionCard } from '../components/OptionCard';
import { cookingLevels } from '../data';
import { StepProps } from '../StepProps';

export function CookingLevelStep({
  step,
  totalSteps,
  data,
  update,
  onBack,
  onNext,
}: StepProps) {
  return (
    <StepScreen
      step={step}
      totalSteps={totalSteps}
      title="What is your cooking level? 🍳"
      subtitle="We'll tailor recipe difficulty to match your experience in the kitchen."
      onBack={onBack}
      onContinue={onNext}
      continueDisabled={!data.cookingLevel}
    >
      {cookingLevels.map((level) => (
        <OptionCard
          key={level.value}
          title={level.title}
          description={level.description}
          emoji={level.emoji}
          selected={data.cookingLevel === level.value}
          onPress={() => update({ cookingLevel: level.value })}
        />
      ))}
    </StepScreen>
  );
}

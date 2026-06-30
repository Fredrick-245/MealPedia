import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StepScreen } from '../components/StepScreen';
import { SelectableTile } from '../components/SelectableTile';
import { cuisines } from '../data';
import { spacing } from '../../theme';
import { StepProps } from '../StepProps';

export function CuisineStep({
  step,
  totalSteps,
  data,
  update,
  onBack,
  onNext,
}: StepProps) {
  function toggle(id: string) {
    const next = data.cuisines.includes(id)
      ? data.cuisines.filter((c) => c !== id)
      : [...data.cuisines, id];
    update({ cuisines: next });
  }

  return (
    <StepScreen
      step={step}
      totalSteps={totalSteps}
      title="Select your cuisine preferences 🍽️"
      subtitle="Pick a few favorites so we can fill your feed with dishes you'll love."
      onBack={onBack}
      onContinue={onNext}
      onSkip={onNext}
      continueDisabled={data.cuisines.length === 0}
    >
      <View style={styles.grid}>
        {cuisines.map((item) => (
          <SelectableTile
            key={item.id}
            label={item.label}
            emoji={item.emoji}
            selected={data.cuisines.includes(item.id)}
            onPress={() => toggle(item.id)}
          />
        ))}
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});

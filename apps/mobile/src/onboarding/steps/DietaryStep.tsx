import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StepScreen } from '../components/StepScreen';
import { SelectableTile } from '../components/SelectableTile';
import { dietaryOptions } from '../data';
import { spacing } from '../../theme';
import { StepProps } from '../StepProps';

export function DietaryStep({
  step,
  totalSteps,
  data,
  update,
  onBack,
  onNext,
}: StepProps) {
  function toggle(id: string) {
    if (id === 'none') {
      update({ dietary: data.dietary.includes('none') ? [] : ['none'] });
      return;
    }
    const withoutNone = data.dietary.filter((d) => d !== 'none');
    const next = withoutNone.includes(id)
      ? withoutNone.filter((d) => d !== id)
      : [...withoutNone, id];
    update({ dietary: next });
  }

  return (
    <StepScreen
      step={step}
      totalSteps={totalSteps}
      title="Do you have any dietary preferences? 🥗"
      subtitle="Tell us about restrictions so we only show recipes that work for you."
      onBack={onBack}
      onContinue={onNext}
      onSkip={onNext}
      continueDisabled={data.dietary.length === 0}
    >
      <View style={styles.grid}>
        {dietaryOptions.map((item) => (
          <SelectableTile
            key={item.id}
            label={item.label}
            emoji={item.emoji}
            selected={data.dietary.includes(item.id)}
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

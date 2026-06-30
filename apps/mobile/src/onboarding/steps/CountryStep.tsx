import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { StepScreen } from '../components/StepScreen';
import { SelectableRow } from '../components/SelectableRow';
import { countries } from '../data';
import { colors, fontSize, radius, spacing } from '../../theme';
import { StepProps } from '../StepProps';

export function CountryStep({
  step,
  totalSteps,
  data,
  update,
  onBack,
  onNext,
}: StepProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <StepScreen
      step={step}
      totalSteps={totalSteps}
      title="Which country are you from? 🌍"
      subtitle="Choose where you currently live so we can suggest recipes and ingredients near you."
      onBack={onBack}
      onContinue={onNext}
      continueDisabled={!data.country}
    >
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search country"
          placeholderTextColor={colors.textSubtle}
          style={styles.search}
        />
      </View>

      {filtered.map((country) => (
        <SelectableRow
          key={country.code}
          label={country.name}
          leading={country.flag}
          selected={data.country === country.code}
          onPress={() => update({ country: country.code })}
        />
      ))}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    marginBottom: spacing.lg,
  },
  search: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.md,
    color: colors.text,
  },
});

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';

const SUGGESTED = ['English (US)', 'English (UK)'];
const LANGUAGES = [
  'Mandarin',
  'Hindi',
  'Spanish',
  'French',
  'Arabic',
  'Bengali',
  'Russian',
  'Indonesian',
  'Portuguese',
  'German',
  'Japanese',
  'Swahili',
];

function Radio({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

export function LanguageScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState('English (US)');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Language" onBack={onBack} rightIcon="ellipsis-horizontal" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.section}>Suggested</Text>
        {SUGGESTED.map((lang) => (
          <Radio
            key={lang}
            label={lang}
            selected={selected === lang}
            onPress={() => setSelected(lang)}
          />
        ))}

        <Text style={styles.section}>Language</Text>
        {LANGUAGES.map((lang) => (
          <Radio
            key={lang}
            label={lang}
            selected={selected === lang}
            onPress={() => setSelected(lang)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  section: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
});

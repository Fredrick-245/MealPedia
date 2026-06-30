import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSize, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';

export type ToggleItem = {
  key: string;
  label: string;
  value: boolean;
};

type ToggleListScreenProps = {
  title: string;
  items: ToggleItem[];
  onBack: () => void;
  footer?: React.ReactNode;
};

export function ToggleListScreen({ title, items, onBack, footer }: ToggleListScreenProps) {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((i) => [i.key, i.value])),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={title} onBack={onBack} rightIcon="ellipsis-horizontal" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {items.map((item) => (
          <View key={item.key} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Switch
              value={state[item.key]}
              onValueChange={(v) => setState((prev) => ({ ...prev, [item.key]: v }))}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        ))}
        {footer}
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
  },
});

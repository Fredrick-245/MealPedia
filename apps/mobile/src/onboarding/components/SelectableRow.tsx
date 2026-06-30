import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';

type SelectableRowProps = {
  label: string;
  leading?: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectableRow({ label, leading, selected, onPress }: SelectableRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected ? styles.rowSelected : styles.rowDefault]}
    >
      <View style={styles.leadingWrap}>
        {leading ? <Text style={styles.leading}>{leading}</Text> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  rowDefault: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  rowSelected: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  leadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
  },
  leading: {
    fontSize: 22,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});

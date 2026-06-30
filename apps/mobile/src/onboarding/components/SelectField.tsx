import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';

type Option<T extends string> = { value: T; label: string };

type SelectFieldProps<T extends string> = {
  label: string;
  placeholder: string;
  value: T | null;
  options: Option<T>[];
  onChange: (value: T) => void;
  error?: string;
};

export function SelectField<T extends string>({
  label,
  placeholder,
  value,
  options,
  onChange,
  error,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.field, error ? styles.fieldError : null]}
      >
        <Text style={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.option, isActive && styles.optionActive]}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                    {option.label}
                  </Text>
                  {isActive ? <Text style={styles.optionCheck}>✓</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  fieldError: {
    borderBottomColor: colors.primary,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  placeholder: {
    fontSize: fontSize.md,
    color: colors.textSubtle,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
    marginTop: -6,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: fontSize.xs,
    color: colors.primary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  optionActive: {
    backgroundColor: colors.primaryTint,
  },
  optionLabel: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  optionLabelActive: {
    fontWeight: '700',
    color: colors.primary,
  },
  optionCheck: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.primary,
  },
});

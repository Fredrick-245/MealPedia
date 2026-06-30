import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'ghost';
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'solid',
  style,
}: PrimaryButtonProps) {
  const isGhost = variant === 'ghost';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.solid,
        isDisabled && !isGhost && styles.solidDisabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.label, isGhost ? styles.ghostLabel : styles.solidLabel]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  solid: {
    backgroundColor: colors.primary,
  },
  solidDisabled: {
    backgroundColor: colors.primaryTintBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  solidLabel: {
    color: colors.white,
  },
  ghostLabel: {
    color: colors.textMuted,
  },
});

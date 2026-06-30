import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, fontSize, spacing } from '../../theme';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  trailing?: React.ReactNode;
};

function EyeToggle({ hidden, onToggle }: { hidden: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
    >
      <View style={styles.eyeWrap}>
        <Text
          style={styles.eye}
          accessibilityRole="image"
          accessibilityLabel="Password visibility"
        >
          {'\u{1F441}'}
        </Text>
        {hidden ? <View style={styles.eyeSlash} /> : null}
      </View>
    </Pressable>
  );
}

export function TextField({
  label,
  error,
  trailing,
  style,
  secureTextEntry,
  ...inputProps
}: TextFieldProps) {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <TextInput
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={isPassword ? hidden : false}
          style={[styles.input, style]}
          {...inputProps}
        />
        {isPassword ? (
          <EyeToggle hidden={hidden} onToggle={() => setHidden((v) => !v)} />
        ) : (
          trailing
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  inputRowError: {
    borderBottomColor: colors.primary,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: fontSize.xs,
    color: colors.primary,
  },
  eyeWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    fontSize: 18,
    color: colors.primary,
  },
  eyeSlash: {
    position: 'absolute',
    width: 26,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
    transform: [{ rotate: '-45deg' }],
  },
});

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StepScreen } from '../components/StepScreen';
import { TextField } from '../components/TextField';
import { colors, fontSize, radius, spacing } from '../../theme';
import { StepProps } from '../StepProps';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountStep({
  step,
  totalSteps,
  data,
  update,
  onBack,
  onNext,
  submitting,
  submitError,
}: StepProps) {
  const { account } = data;
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState(false);

  function setAccount(patch: Partial<typeof account>) {
    update({ account: { ...account, ...patch } });
  }

  const usernameValid = account.username.trim().length > 2;
  const emailValid = EMAIL_REGEX.test(account.email.trim());
  const passwordValid = account.password.length >= 8;
  const confirmValid = confirm.length > 0 && confirm === account.password;
  const isValid = usernameValid && emailValid && passwordValid && confirmValid;

  function handleSubmit() {
    setTouched(true);
    if (isValid) onNext();
  }

  return (
    <StepScreen
      step={step}
      totalSteps={totalSteps}
      title="Create an Account 🔐"
      subtitle="Enter your username, email & password. If you forget it, then you have to do forgot password."
      onBack={onBack}
      onContinue={handleSubmit}
      continueLabel="Sign Up"
      continueLoading={submitting}
    >
      <TextField
        label="Username"
        placeholder="Username"
        value={account.username}
        onChangeText={(text) => setAccount({ username: text.replace(/\s/g, '') })}
        autoCapitalize="none"
        error={touched && !usernameValid ? 'Choose a username (min 3 characters)' : undefined}
      />
      <TextField
        label="Email"
        placeholder="Email"
        value={account.email}
        onChangeText={(text) => setAccount({ email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={touched && !emailValid ? 'Enter a valid email address' : undefined}
      />
      <TextField
        label="Password"
        placeholder="Password"
        value={account.password}
        onChangeText={(text) => setAccount({ password: text })}
        secureTextEntry
        error={
          touched && !passwordValid ? 'Password must be at least 8 characters' : undefined
        }
      />
      <TextField
        label="Confirm Password"
        placeholder="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        error={touched && !confirmValid ? 'Passwords do not match' : undefined}
      />

      <Pressable
        style={styles.rememberRow}
        onPress={() => setAccount({ rememberMe: !account.rememberMe })}
      >
        <View style={[styles.checkbox, account.rememberMe && styles.checkboxChecked]}>
          {account.rememberMe ? <Text style={styles.checkboxMark}>✓</Text> : null}
        </View>
        <Text style={styles.rememberText}>Remember me</Text>
      </Pressable>

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxMark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  rememberText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  submitError: {
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.primary,
    textAlign: 'center',
  },
});

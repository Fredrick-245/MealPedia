import React from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';
import { ToggleItem, ToggleListScreen } from './ToggleListScreen';

const ITEMS: ToggleItem[] = [
  { key: 'remember', label: 'Remember me', value: true },
  { key: 'faceId', label: 'Face ID', value: false },
  { key: 'biometric', label: 'Biometric ID', value: false },
  { key: 'sms', label: 'SMS Authenticator', value: false },
  { key: 'google', label: 'Google Authenticator', value: false },
];

export function SecurityScreen({ onBack }: { onBack: () => void }) {
  return (
    <ToggleListScreen
      title="Security"
      items={ITEMS}
      onBack={onBack}
      footer={
        <>
          <Pressable
            style={styles.deviceButton}
            onPress={() => Alert.alert('Device Management', 'This feature is coming soon.')}
          >
            <Text style={styles.deviceButtonText}>Google Authenticator</Text>
          </Pressable>
          <Pressable
            style={styles.changeButton}
            onPress={() => Alert.alert('Change Password', 'This feature is coming soon.')}
          >
            <Text style={styles.changeButtonText}>Change Password</Text>
          </Pressable>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  deviceButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
  },
  deviceButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  changeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  changeButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.white,
  },
});

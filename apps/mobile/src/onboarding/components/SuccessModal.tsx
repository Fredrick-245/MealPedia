import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';
import { PrimaryButton } from './PrimaryButton';

type SuccessModalProps = {
  visible: boolean;
  onContinue: () => void;
};

export function SuccessModal({ visible, onContinue }: SuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text
              style={styles.badgeIcon}
              accessibilityRole="image"
              accessibilityLabel="Celebration"
            >
              {'\u{1F389}'}
            </Text>
          </View>
          <Text style={styles.title}>Sign Up Successful!</Text>
          <Text style={styles.message}>
            Your Cookpedia account is ready. Let's start cooking something
            delicious.
          </Text>
          <PrimaryButton
            label="Get Started"
            onPress={onContinue}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  badge: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  badgeIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    lineHeight: 21,
    color: colors.textMuted,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
});

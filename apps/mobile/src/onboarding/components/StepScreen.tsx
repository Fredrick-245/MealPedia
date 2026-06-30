import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';
import { PrimaryButton } from './PrimaryButton';

type StepScreenProps = {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  onSkip?: () => void;
  scroll?: boolean;
  children: React.ReactNode;
};

function ProgressBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  return (
    <View style={styles.progressRow}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressSegment,
            index <= step ? styles.progressSegmentActive : styles.progressSegmentInactive,
          ]}
        />
      ))}
    </View>
  );
}

export function StepScreen({
  step,
  totalSteps,
  title,
  subtitle,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  continueLoading = false,
  onSkip,
  scroll = true,
  children,
}: StepScreenProps) {
  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? {
        contentContainerStyle: styles.bodyContent,
        showsVerticalScrollIndicator: false,
        keyboardShouldPersistTaps: 'handled' as const,
      }
    : { style: styles.bodyContent };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
          ) : (
            <View style={styles.backButton} />
          )}
          <ProgressBar step={step} totalSteps={totalSteps} />
          {onSkip ? (
            <Pressable onPress={onSkip} hitSlop={12}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>

        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <Body {...bodyProps}>{children}</Body>

      <View style={styles.footer}>
        <PrimaryButton
          label={continueLabel}
          onPress={onContinue}
          disabled={continueDisabled}
          loading={continueLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 30,
    lineHeight: 30,
    color: colors.text,
    marginTop: -4,
  },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: radius.pill,
  },
  progressSegmentActive: {
    backgroundColor: colors.primary,
  },
  progressSegmentInactive: {
    backgroundColor: colors.primaryTint,
  },
  skip: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  skipPlaceholder: {
    width: 28,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    lineHeight: 20,
    color: colors.textMuted,
  },
  bodyContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
});

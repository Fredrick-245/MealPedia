import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';

type OptionCardProps = {
  title: string;
  description?: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionCard({
  title,
  description,
  emoji,
  selected,
  onPress,
}: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected ? styles.cardSelected : styles.cardDefault]}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  cardDefault: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  cardSelected: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 26,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    lineHeight: 19,
    color: colors.textMuted,
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

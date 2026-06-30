import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';

type SelectableTileProps = {
  label: string;
  emoji: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectableTile({ label, emoji, selected, onPress }: SelectableTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, selected ? styles.tileSelected : styles.tileDefault]}
    >
      <View style={[styles.emojiCircle, selected && styles.emojiCircleSelected]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {selected ? (
        <View style={styles.check}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  tileDefault: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  tileSelected: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emojiCircleSelected: {
    backgroundColor: colors.white,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  check: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
});

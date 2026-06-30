import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../theme';

type ScreenHeaderProps = {
  title: string;
  onBack: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export function ScreenHeader({
  title,
  onBack,
  rightIcon = 'search',
  onRightPress,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Pressable
        onPress={onRightPress}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={rightIcon}
      >
        <Ionicons name={rightIcon} size={22} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  title: {
    flex: 1,
    marginLeft: spacing.lg,
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
});

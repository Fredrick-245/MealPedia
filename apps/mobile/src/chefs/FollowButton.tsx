import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

type FollowButtonProps = {
  initialFollowing: boolean;
  size?: 'sm' | 'lg';
};

export function FollowButton({ initialFollowing, size = 'sm' }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const large = size === 'lg';

  return (
    <Pressable
      onPress={() => setFollowing((v) => !v)}
      style={[
        styles.base,
        large ? styles.large : styles.small,
        following ? styles.outlined : styles.filled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={following ? 'Unfollow' : 'Follow'}
    >
      <Text
        style={[
          large ? styles.textLarge : styles.textSmall,
          following ? styles.textOutlined : styles.textFilled,
        ]}
      >
        {following ? 'Following' : 'Follow'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minWidth: 92,
  },
  large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minWidth: 110,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  outlined: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  textSmall: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  textLarge: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  textFilled: {
    color: colors.white,
  },
  textOutlined: {
    color: colors.primary,
  },
});

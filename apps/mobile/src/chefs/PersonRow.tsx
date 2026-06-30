import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';
import { Person } from './types';
import { FollowButton } from './FollowButton';

export function PersonRow({ person }: { person: Person }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: person.avatarUrl }} style={styles.avatar} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {person.name}
        </Text>
        <Text style={styles.handle} numberOfLines={1}>
          {person.handle}
        </Text>
      </View>
      <FollowButton initialFollowing={person.following} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  handle: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    marginTop: 2,
  },
});

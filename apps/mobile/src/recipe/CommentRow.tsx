import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';
import { RecipeComment } from './types';

export function CommentRow({ comment }: { comment: RecipeComment }) {
  const [liked, setLiked] = useState(false);
  const likeCount = comment.likes + (liked ? 1 : 0);

  return (
    <View style={styles.row}>
      <Image source={{ uri: comment.authorAvatarUrl }} style={styles.avatar} />
      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text style={styles.name} numberOfLines={1}>
            {comment.authorName}
          </Text>
          <Text style={styles.time}>{comment.timeLabel}</Text>
        </View>
        <Text style={styles.text}>{comment.text}</Text>
        <Pressable
          style={styles.likeRow}
          onPress={() => setLiked((v) => !v)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={liked ? 'Unlike' : 'Like'}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={15}
            color={liked ? colors.primary : colors.textMuted}
          />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  body: {
    flex: 1,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 2,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  likeCount: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '600',
  },
});

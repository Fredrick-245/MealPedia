import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';
import { useAppNavigation } from '../navigation/RootNavigator';

export type Recipe = {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  imageUrl: string;
  authorName: string;
  authorAvatarUrl: string;
  category: string;
  bookmarked: boolean;
};

type RecipeCardProps = {
  recipe: Recipe;
  onPress?: () => void;
};

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const [bookmarked, setBookmarked] = useState(recipe.bookmarked);
  const nav = useAppNavigation();

  return (
    <Pressable
      style={styles.card}
      onPress={onPress ?? (() => nav.push({ name: 'recipeDetail', recipeId: recipe.id }))}
    >
      <ImageBackground
        source={{ uri: recipe.imageUrl }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        <Pressable
          style={styles.bookmark}
          hitSlop={8}
          onPress={() => setBookmarked((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={16}
            color={colors.white}
          />
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <View style={styles.authorRow}>
            <Image source={{ uri: recipe.authorAvatarUrl }} style={styles.avatar} />
            <Text style={styles.authorName} numberOfLines={1}>
              {recipe.authorName}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const CARD_WIDTH = 176;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 210,
    borderRadius: radius.lg,
    marginRight: spacing.lg,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: radius.lg,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
  },
  bookmark: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  authorName: {
    flex: 1,
    color: 'rgba(255,255,255,0.92)',
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
});

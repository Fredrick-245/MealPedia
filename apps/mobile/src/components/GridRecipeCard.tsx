import React, { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';
import { Recipe } from '../home/RecipeCard';
import { useAppNavigation } from '../navigation/RootNavigator';

export function GridRecipeCard({ recipe, onPress }: { recipe: Recipe; onPress?: () => void }) {
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
          colors={['transparent', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0.82)']}
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
            size={15}
            color={colors.white}
          />
        </Pressable>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {recipe.authorName}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 175,
    borderRadius: radius.lg,
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
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
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
    lineHeight: 18,
  },
  author: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontSize.xs,
    marginTop: 4,
  },
});

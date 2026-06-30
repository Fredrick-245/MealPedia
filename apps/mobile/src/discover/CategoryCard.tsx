import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize, radius, spacing } from '../theme';

export type Category = {
  id: string;
  name: string;
  recipeCount: number;
  imageUrl: string;
};

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Pressable style={styles.card}>
      <ImageBackground
        source={{ uri: category.imageUrl }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.78)']}
          style={styles.gradient}
        />
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {category.name}
          </Text>
          <Text style={styles.count}>
            {category.recipeCount.toLocaleString()} recipes
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 110,
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
  content: {
    padding: spacing.md,
  },
  name: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  count: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { GET_RECIPES_BY_CATEGORY } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { Recipe } from '../home/RecipeCard';
import { GridRecipeCard } from '../components/GridRecipeCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { Category } from './CategoryCard';

type CategoryDetailScreenProps = {
  category: Category;
  onBack: () => void;
};

function Hero({ category }: { category: Category }) {
  return (
    <ImageBackground
      source={{ uri: category.imageUrl }}
      style={styles.hero}
      imageStyle={styles.heroRadius}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.heroGradient}
      />
      <View style={styles.heroBookmark}>
        <Ionicons name="bookmark" size={15} color={colors.white} />
      </View>
      <View style={styles.heroContent}>
        <Text style={styles.heroName}>{category.name}</Text>
        <Text style={styles.heroCount}>
          {category.recipeCount.toLocaleString()} recipes
        </Text>
      </View>
    </ImageBackground>
  );
}

export function CategoryDetailScreen({ category, onBack }: CategoryDetailScreenProps) {
  const { data, loading, error } = useQuery<{ recipesByCategory: Recipe[] }>(
    GET_RECIPES_BY_CATEGORY,
    { variables: { category: category.name } },
  );
  const recipes = data?.recipesByCategory ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={category.name} onBack={onBack} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Could not load recipes</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Hero category={category} />
              <View style={styles.sortRow}>
                <Text style={styles.sortLabel}>Sort by</Text>
                <Pressable style={styles.sortValue} hitSlop={8}>
                  <Text style={styles.sortValueText}>Most Popular</Text>
                  <Ionicons name="swap-vertical" size={16} color={colors.primary} />
                </Pressable>
              </View>
            </View>
          }
          renderItem={({ item }) => <GridRecipeCard recipe={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  grid: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  hero: {
    height: 130,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceMuted,
  },
  heroRadius: {
    borderRadius: radius.lg,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
  },
  heroBookmark: {
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
  heroContent: {
    padding: spacing.lg,
  },
  heroName: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  heroCount: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sortLabel: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.text,
  },
  sortValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sortValueText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  errorText: {
    textAlign: 'center',
    color: colors.textMuted,
  },
});

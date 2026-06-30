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
import { useQuery } from '@apollo/client/react';
import { GET_DISCOVER } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { Category } from './CategoryCard';
import { ScreenHeader } from '../components/ScreenHeader';

type RecipeCategoriesScreenProps = {
  onBack: () => void;
  onOpenCategory: (category: Category) => void;
};

function GridCategoryCard({
  category,
  onPress,
}: {
  category: Category;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
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

export function RecipeCategoriesScreen({
  onBack,
  onOpenCategory,
}: RecipeCategoriesScreenProps) {
  const { data, loading, error } = useQuery<{ recipeCategories: Category[] }>(
    GET_DISCOVER,
  );
  const categories = data?.recipeCategories ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Recipe Categories" onBack={onBack} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Could not load categories</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GridCategoryCard category={item} onPress={() => onOpenCategory(item)} />
          )}
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
  card: {
    width: '48%',
    height: 96,
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

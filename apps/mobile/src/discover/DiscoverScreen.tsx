import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { GET_DISCOVER, GET_RECIPES } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { Recipe, RecipeCard } from '../home/RecipeCard';
import { Category, CategoryCard } from './CategoryCard';
import { ChefCard } from './ChefCard';
import { Chef } from '../chefs/types';
import { useAppNavigation } from '../navigation/RootNavigator';

type RowProps<T> = {
  title: string;
  data: T[];
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
  onSeeAll?: () => void;
};

function Row<T>({ title, data, renderItem, keyExtractor, onSeeAll }: RowProps<T>) {
  if (data.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable
          hitSlop={8}
          onPress={onSeeAll}
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
        >
          <Ionicons name="arrow-forward" size={20} color={colors.primary} />
        </Pressable>
      </View>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => renderItem(item)}
      />
    </View>
  );
}

function DiscoverHeader({ onPressSearch }: { onPressSearch: () => void }) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.heading}>Discover</Text>
        <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Filter">
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </Pressable>
      </View>
      <Pressable
        style={styles.searchBar}
        onPress={onPressSearch}
        accessibilityRole="search"
        accessibilityLabel="Search for Recipe or Chef"
      >
        <Ionicons name="search" size={18} color={colors.textSubtle} />
        <Text style={styles.searchPlaceholder}>Search for Recipe or Chef</Text>
      </Pressable>
    </View>
  );
}

export function DiscoverScreen() {
  const nav = useAppNavigation();
  const recipesQuery = useQuery<{ recipes: Recipe[] }>(GET_RECIPES);
  const discoverQuery = useQuery<{ chefs: Chef[]; recipeCategories: Category[] }>(
    GET_DISCOVER,
  );

  const loading = recipesQuery.loading || discoverQuery.loading;
  const error = recipesQuery.error || discoverQuery.error;

  const recipes = recipesQuery.data?.recipes ?? [];
  const byCategory = (category: string) =>
    recipes.filter((recipe) => recipe.category === category);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerWrap}>
        <DiscoverHeader onPressSearch={() => nav.push({ name: 'search' })} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Could not load discover</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Row
            title="Most Popular"
            data={byCategory('popular')}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <RecipeCard recipe={item} />}
            onSeeAll={() => nav.push({ name: 'mostPopular' })}
          />
          <Row
            title="Recipe Categories"
            data={discoverQuery.data?.recipeCategories ?? []}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <CategoryCard category={item} />}
            onSeeAll={() => nav.push({ name: 'recipeCategories' })}
          />
          <Row
            title="Top Chefs"
            data={discoverQuery.data?.chefs ?? []}
            keyExtractor={(item) => item.id}
            renderItem={(item) => (
              <ChefCard
                chef={item}
                onPress={() => nav.push({ name: 'chefProfile', chef: item })}
              />
            )}
            onSeeAll={() => nav.push({ name: 'topChefs' })}
          />
          <Row
            title="Our Recommendations"
            data={byCategory('recommendations')}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <RecipeCard recipe={item} />}
          />
          <Row
            title="Most Searches"
            data={byCategory('searches')}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <RecipeCard recipe={item} />}
          />
          <Row
            title="New Recipes"
            data={byCategory('new')}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <RecipeCard recipe={item} />}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSubtle,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  list: {
    paddingHorizontal: spacing.xl,
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

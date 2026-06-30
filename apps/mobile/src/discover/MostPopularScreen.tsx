import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client/react';
import { GET_RECIPES } from '../graphql/client';
import { colors, fontSize, spacing } from '../theme';
import { Recipe } from '../home/RecipeCard';
import { GridRecipeCard } from '../components/GridRecipeCard';
import { ScreenHeader } from '../components/ScreenHeader';

type MostPopularScreenProps = {
  onBack: () => void;
};

export function MostPopularScreen({ onBack }: MostPopularScreenProps) {
  const { data, loading, error } = useQuery<{ recipes: Recipe[] }>(GET_RECIPES);
  const recipes = (data?.recipes ?? []).filter((r) => r.category === 'popular');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Most Popular" onBack={onBack} />

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

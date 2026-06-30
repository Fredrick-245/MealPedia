import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKMARKS } from '../graphql/client';
import { colors, fontSize, spacing } from '../theme';
import { Recipe } from '../home/RecipeCard';
import { GridRecipeCard } from '../components/GridRecipeCard';

type BookmarkScreenProps = {
  onBack: () => void;
};

export function BookmarkScreen({ onBack }: BookmarkScreenProps) {
  const { data, loading, error } = useQuery<{ bookmarkedRecipes: Recipe[] }>(
    GET_BOOKMARKS,
  );

  const recipes = data?.bookmarkedRecipes ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>My Bookmark</Text>
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Search bookmarks">
          <Ionicons name="search" size={22} color={colors.text} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Could not load bookmarks</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
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

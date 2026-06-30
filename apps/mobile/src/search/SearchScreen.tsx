import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { SEARCH_RECIPES, GET_PEOPLE } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { Recipe } from '../home/RecipeCard';
import { Person } from '../chefs/types';
import { GridRecipeCard } from '../components/GridRecipeCard';
import { PersonRow } from '../chefs/PersonRow';
import {
  addRecentSearch,
  getRecentSearches,
  removeRecentSearch,
} from '../storage';

type SearchScreenProps = {
  onBack: () => void;
};

type TabKey = 'recipes' | 'people';

function NotFound() {
  return (
    <View style={styles.notFound}>
      <View style={styles.notFoundIcon}>
        <Ionicons name="sad-outline" size={64} color={colors.primary} />
      </View>
      <Text style={styles.notFoundTitle}>Not Found</Text>
      <Text style={styles.notFoundText}>
        We&apos;re sorry, the keyword you were looking for could not be found. Please
        search with another keyword.
      </Text>
    </View>
  );
}

export function SearchScreen({ onBack }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<TabKey>('recipes');
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    getRecentSearches().then(setRecent);
  }, []);

  const term = query.trim();
  const hasQuery = term.length > 0;

  const recipesQuery = useQuery<{ searchRecipes: Recipe[] }>(SEARCH_RECIPES, {
    variables: { query: term },
    skip: !hasQuery || tab !== 'recipes',
  });
  const peopleQuery = useQuery<{ people: Person[] }>(GET_PEOPLE, {
    variables: { query: term },
    skip: !hasQuery || tab !== 'people',
  });

  function commit(value: string) {
    const v = value.trim();
    if (v) addRecentSearch(v).then(setRecent);
  }

  function pickRecent(value: string) {
    setQuery(value);
    commit(value);
  }

  function removeRecent(value: string) {
    removeRecentSearch(value).then(setRecent);
  }

  const recipes = recipesQuery.data?.searchRecipes ?? [];
  const people = peopleQuery.data?.people ?? [];
  const loading = tab === 'recipes' ? recipesQuery.loading : peopleQuery.loading;
  const results = tab === 'recipes' ? recipes : people;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.primary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => commit(query)}
            placeholder="Search"
            placeholderTextColor={colors.textSubtle}
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
          />
          {hasQuery ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Clear">
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {!hasQuery ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recentList}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.recentHeading}>Previous Search</Text>
          {recent.map((item) => (
            <View key={item} style={styles.recentRow}>
              <Pressable style={styles.recentMain} onPress={() => pickRecent(item)}>
                <Ionicons name="time-outline" size={18} color={colors.textMuted} />
                <Text style={styles.recentText}>{item}</Text>
              </Pressable>
              <Pressable onPress={() => removeRecent(item)} hitSlop={8} accessibilityLabel={`Remove ${item}`}>
                <Ionicons name="close" size={18} color={colors.textSubtle} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : (
        <>
          <View style={styles.toggle}>
            {(['recipes', 'people'] as TabKey[]).map((key) => {
              const active = tab === key;
              return (
                <Pressable
                  key={key}
                  style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
                  onPress={() => setTab(key)}
                >
                  <Text style={[styles.pillText, active ? styles.pillTextActive : styles.pillTextInactive]}>
                    {key === 'recipes' ? 'Recipes' : 'People'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : results.length === 0 ? (
            <NotFound />
          ) : tab === 'recipes' ? (
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.column}
              contentContainerStyle={styles.grid}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => <GridRecipeCard recipe={item} />}
            />
          ) : (
            <FlatList
              data={people}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.peopleList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => <PersonRow person={item} />}
            />
          )}
        </>
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
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
    padding: 0,
  },
  recentList: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  recentHeading: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  recentMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  recentText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  toggle: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillInactive: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  pillTextActive: {
    color: colors.white,
  },
  pillTextInactive: {
    color: colors.primary,
  },
  grid: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  peopleList: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  separator: {
    height: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  notFoundIcon: {
    width: 140,
    height: 140,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  notFoundTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  notFoundText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
});

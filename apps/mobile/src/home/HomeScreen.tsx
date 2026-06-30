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
import { GET_RECIPES } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { PromoBanner } from './PromoBanner';
import { Recipe, RecipeCard } from './RecipeCard';
import { useAppNavigation } from '../navigation/RootNavigator';

function HomeHeader() {
  const nav = useAppNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Ionicons name="restaurant" size={18} color={colors.white} />
        </View>
        <Text style={styles.brandText}>Cookpedia</Text>
      </View>
      <View style={styles.headerActions}>
        <Pressable
          hitSlop={8}
          onPress={() => nav.push({ name: 'notifications' })}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </Pressable>
        <Pressable
          hitSlop={8}
          onPress={() => nav.push({ name: 'bookmark' })}
          accessibilityRole="button"
          accessibilityLabel="Bookmarks"
        >
          <Ionicons name="bookmark-outline" size={24} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

function Section({ title, recipes }: { title: string; recipes: Recipe[] }) {
  if (recipes.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel={`See all ${title}`}>
          <Ionicons name="arrow-forward" size={20} color={colors.primary} />
        </Pressable>
      </View>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sectionList}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
      />
    </View>
  );
}

export function HomeScreen() {
  const { data, loading, error } = useQuery<{ recipes: Recipe[] }>(GET_RECIPES);

  const recipes = data?.recipes ?? [];
  const recent = recipes.filter((r) => r.category === 'recent');
  const yours = recipes.filter((r) => r.category === 'yours');
  const bookmark = recipes.filter((r) => r.category === 'bookmark');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <HomeHeader />

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.bannerWrap}>
            <PromoBanner />
          </View>
          <Section title="Recent Recipes" recipes={recent} />
          <Section title="Your Recipes" recipes={yours} />
          <Section title="Your Bookmark" recipes={bookmark} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  bannerWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  section: {
    marginTop: spacing.lg,
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
  sectionList: {
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

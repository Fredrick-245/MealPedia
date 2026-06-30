import React, { useState } from 'react';
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
import { GET_MY_RECIPES } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { useAppNavigation } from '../navigation/RootNavigator';

type MyRecipe = {
  id: string;
  title: string;
  imageUrl: string;
  authorName: string;
  authorAvatarUrl: string;
  published: boolean;
};

type TabKey = 'draft' | 'published';

function MyRecipeCard({
  recipe,
  onOpen,
  onEdit,
}: {
  recipe: MyRecipe;
  onOpen: () => void;
  onEdit: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onOpen}>
      <ImageBackground
        source={{ uri: recipe.imageUrl }}
        style={styles.cardImage}
        imageStyle={styles.cardRadius}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.82)']}
          style={styles.cardGradient}
        />
        <Pressable
          style={styles.editFab}
          onPress={onEdit}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Edit recipe"
        >
          <Ionicons name="pencil" size={14} color={colors.white} />
        </Pressable>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {recipe.title}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

export function MyRecipesScreen() {
  const nav = useAppNavigation();
  const [tab, setTab] = useState<TabKey>('draft');
  const { data, loading } = useQuery<{ myRecipes: MyRecipe[] }>(GET_MY_RECIPES);

  const all = data?.myRecipes ?? [];
  const drafts = all.filter((r) => !r.published);
  const published = all.filter((r) => r.published);
  const list = tab === 'draft' ? drafts : published;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Recipes</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => nav.push({ name: 'search' })}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <Ionicons name="search" size={22} color={colors.text} />
          </Pressable>
          <Pressable
            style={styles.moreButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Options"
          >
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.tabs}>
        {(['draft', 'published'] as TabKey[]).map((key) => {
          const active = tab === key;
          const count = key === 'draft' ? drafts.length : published.length;
          return (
            <Pressable key={key} style={styles.tab} onPress={() => setTab(key)}>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {key === 'draft' ? 'Draft' : 'Published'} ({count})
              </Text>
              <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : list.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="reader-outline" size={56} color={colors.textSubtle} />
          <Text style={styles.emptyTitle}>
            No {tab === 'draft' ? 'drafts' : 'published recipes'} yet
          </Text>
          <Text style={styles.emptyText}>
            Tap the + button to create a new recipe.
          </Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MyRecipeCard
              recipe={item}
              onOpen={() => nav.push({ name: 'recipeDetail', recipeId: item.id })}
              onEdit={() => nav.push({ name: 'recipeForm', recipeId: item.id })}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  moreButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabUnderline: {
    height: 3,
    width: '90%',
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },
  tabUnderlineActive: {
    backgroundColor: colors.primary,
  },
  grid: {
    padding: spacing.xl,
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  card: {
    width: '48%',
    height: 175,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardRadius: {
    borderRadius: radius.lg,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
  },
  editFab: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: spacing.md,
  },
  cardTitle: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '700',
    lineHeight: 18,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

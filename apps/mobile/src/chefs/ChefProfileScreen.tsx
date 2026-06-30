import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { GET_RECIPES_BY_AUTHOR } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { Recipe } from '../home/RecipeCard';
import { GridRecipeCard } from '../components/GridRecipeCard';
import { Chef, formatCount } from './types';
import { FollowButton } from './FollowButton';

type ChefProfileScreenProps = {
  chef: Chef;
  onBack: () => void;
  onOpenFollow: (mode: 'following' | 'followers') => void;
};

type TabKey = 'recipes' | 'about';

function Stat({
  value,
  label,
  onPress,
}: {
  value: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.stat} onPress={onPress} disabled={!onPress}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );
}

function SocialLink({
  icon,
  label,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={styles.infoText}>{label}</Text>
    </View>
  );
}

function About({ chef }: { chef: Chef }) {
  return (
    <View style={styles.about}>
      <Text style={styles.aboutHeading}>Description</Text>
      <Text style={styles.aboutBody}>{chef.bio}</Text>

      <Text style={styles.aboutHeading}>Social Media</Text>
      <SocialLink icon="logo-whatsapp" label={chef.whatsapp} color="#25D366" />
      <SocialLink icon="logo-facebook" label={chef.facebook} color="#1877F2" />
      <SocialLink icon="logo-twitter" label={chef.twitter} color="#1DA1F2" />
      <SocialLink icon="logo-instagram" label={chef.instagram} color="#E1306C" />

      <Text style={styles.aboutHeading}>More Info</Text>
      <Pressable
        style={styles.infoRow}
        onPress={() => Linking.openURL(`https://${chef.website}`).catch(() => undefined)}
      >
        <Ionicons name="globe-outline" size={18} color={colors.primary} />
        <Text style={[styles.infoText, styles.infoLink]}>{chef.website}</Text>
      </Pressable>
      <SocialLink icon="location-outline" label={chef.location} color={colors.textMuted} />
      <SocialLink icon="calendar-outline" label={chef.joinedLabel} color={colors.textMuted} />
      <SocialLink
        icon="eye-outline"
        label={`${chef.views.toLocaleString()} views`}
        color={colors.textMuted}
      />
    </View>
  );
}

export function ChefProfileScreen({ chef, onBack, onOpenFollow }: ChefProfileScreenProps) {
  const [tab, setTab] = useState<TabKey>('recipes');
  const { data, loading } = useQuery<{ recipesByAuthor: Recipe[] }>(
    GET_RECIPES_BY_AUTHOR,
    { variables: { author: chef.fullName } },
  );
  const recipes = data?.recipesByAuthor ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.topBarActions}>
          <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Share">
            <Ionicons name="paper-plane-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="More">
            <Ionicons name="ellipsis-horizontal" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.identity}>
        <Image source={{ uri: chef.avatarUrl }} style={styles.avatar} />
        <View style={styles.identityBody}>
          <Text style={styles.fullName}>{chef.fullName}</Text>
          <Text style={styles.handle}>{chef.handle}</Text>
        </View>
        <FollowButton initialFollowing={chef.following} size="lg" />
      </View>

      <View style={styles.statsRow}>
        <Stat value={`${chef.recipeCount}`} label="Recipes" />
        <View style={styles.statDivider} />
        <Stat
          value={`${chef.followingCount}`}
          label="Following"
          onPress={() => onOpenFollow('following')}
        />
        <View style={styles.statDivider} />
        <Stat
          value={formatCount(chef.followersCount)}
          label="Followers"
          onPress={() => onOpenFollow('followers')}
        />
      </View>

      <View style={styles.tabs}>
        {(['recipes', 'about'] as TabKey[]).map((key) => {
          const active = tab === key;
          return (
            <Pressable key={key} style={styles.tab} onPress={() => setTab(key)}>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {key === 'recipes' ? 'Recipes' : 'About'}
              </Text>
              <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
            </Pressable>
          );
        })}
      </View>

      {tab === 'about' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.aboutScroll}>
          <About chef={chef} />
        </ScrollView>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  identityBody: {
    flex: 1,
  },
  fullName: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.text,
  },
  handle: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
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
    paddingBottom: spacing.md,
  },
  tabLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabUnderline: {
    height: 3,
    width: '70%',
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
  aboutScroll: {
    padding: spacing.xl,
  },
  about: {
    gap: spacing.sm,
  },
  aboutHeading: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  aboutBody: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 21,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  infoLink: {
    color: colors.primary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
});

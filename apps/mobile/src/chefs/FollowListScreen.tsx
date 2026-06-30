import React, { useState } from 'react';
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
import { GET_PEOPLE } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { Chef, Person } from './types';
import { PersonRow } from './PersonRow';

type FollowMode = 'following' | 'followers';

type FollowListScreenProps = {
  chef: Chef;
  initialMode: FollowMode;
  onBack: () => void;
  onSearch: () => void;
};

export function FollowListScreen({
  chef,
  initialMode,
  onBack,
  onSearch,
}: FollowListScreenProps) {
  const [mode, setMode] = useState<FollowMode>(initialMode);
  const { data, loading } = useQuery<{ people: Person[] }>(GET_PEOPLE);
  const people = data?.people ?? [];

  // Present a different slice per tab so each feels distinct.
  const list =
    mode === 'following' ? people.filter((p) => p.following) : people;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {chef.fullName}
        </Text>
        <Pressable onPress={onSearch} hitSlop={10} accessibilityRole="button" accessibilityLabel="Search">
          <Ionicons name="search" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.toggle}>
        {(['following', 'followers'] as FollowMode[]).map((key) => {
          const active = mode === key;
          return (
            <Pressable
              key={key}
              style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
              onPress={() => setMode(key)}
            >
              <Text style={[styles.pillText, active ? styles.pillTextActive : styles.pillTextInactive]}>
                {key === 'following' ? 'Following' : 'Followers'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <PersonRow person={item} />}
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
    flex: 1,
    marginHorizontal: spacing.md,
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: '800',
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
  list: {
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
});

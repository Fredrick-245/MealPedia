import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { GET_NOTIFICATIONS } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';

type NotificationItem = {
  id: string;
  kind: 'general' | 'system';
  message: string;
  timeLabel: string;
  actorName: string | null;
  actorAvatarUrl: string | null;
  thumbnailUrl: string | null;
  iconKey: string | null;
  tag: string | null;
};

type NotificationsScreenProps = {
  onBack: () => void;
};

type TabKey = 'general' | 'system';

const SYSTEM_ICONS: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  security: { icon: 'shield-checkmark', color: '#2F6BFF', bg: '#E8EEFF' },
  bookmark: { icon: 'bookmark', color: '#F2994A', bg: '#FFF1E3' },
  update: { icon: 'sparkles', color: '#8B5CF6', bg: '#F0E9FF' },
  storage: { icon: 'cloud', color: '#E94B4B', bg: '#FDECEC' },
  account: { icon: 'checkmark-circle', color: '#22A06B', bg: '#E4F6EE' },
};

function GeneralRow({ item }: { item: NotificationItem }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.actorAvatarUrl ?? undefined }} style={styles.avatar} />
      <View style={styles.rowBody}>
        <Text style={styles.rowMessage}>{item.message}</Text>
        <Text style={styles.rowTime}>{item.timeLabel}</Text>
      </View>
      {item.thumbnailUrl ? (
        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      ) : null}
      <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="More options">
        <Ionicons name="ellipsis-vertical" size={16} color={colors.textSubtle} />
      </Pressable>
    </View>
  );
}

function SystemRow({ item }: { item: NotificationItem }) {
  const meta = SYSTEM_ICONS[item.iconKey ?? ''] ?? SYSTEM_ICONS.update;
  return (
    <View style={styles.row}>
      <View style={[styles.systemIcon, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon} size={20} color={meta.color} />
      </View>
      <View style={styles.rowBody}>
        <View style={styles.systemTitleRow}>
          <Text style={styles.systemTitle} numberOfLines={1}>
            {item.actorName}
          </Text>
          {item.tag ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          ) : null}
          <Text style={styles.systemTime}>{item.timeLabel}</Text>
        </View>
        <Text style={styles.systemMessage}>{item.message}</Text>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="clipboard-outline" size={56} color={colors.primaryTintBorder} />
      </View>
      <Text style={styles.emptyTitle}>Empty</Text>
      <Text style={styles.emptyText}>You don&apos;t have any notification at this time</Text>
    </View>
  );
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [tab, setTab] = useState<TabKey>('general');
  const { data, loading, error } = useQuery<{ notifications: NotificationItem[] }>(
    GET_NOTIFICATIONS,
  );

  const items = (data?.notifications ?? []).filter((n) => n.kind === tab);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Notification</Text>
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Notification settings">
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {(['general', 'system'] as TabKey[]).map((key) => {
          const active = tab === key;
          return (
            <Pressable key={key} style={styles.tab} onPress={() => setTab(key)}>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {key === 'general' ? 'General' : 'System'}
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
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Could not load notifications</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) =>
            tab === 'general' ? <GeneralRow item={item} /> : <SystemRow item={item} />
          }
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
  list: {
    padding: spacing.xl,
  },
  separator: {
    height: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  rowBody: {
    flex: 1,
  },
  rowMessage: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 19,
  },
  rowTime: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    marginTop: 4,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  systemIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  systemTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  tag: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tagText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  systemTime: {
    marginLeft: 'auto',
    fontSize: fontSize.xs,
    color: colors.textSubtle,
  },
  systemMessage: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 19,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
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

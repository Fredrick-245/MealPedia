import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { GET_MY_RECIPES } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { getStoredProfile, StoredProfile } from '../storage';
import { formatCount } from '../chefs/types';
import { useAppNavigation } from '../navigation/RootNavigator';

const FALLBACK_AVATAR = 'https://i.pravatar.cc/200?img=68';

type ProfileScreenProps = {
  onLogout: () => void;
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Ionicons name={icon} size={18} color={danger ? colors.primary : colors.text} />
      </View>
      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
    </Pressable>
  );
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const nav = useAppNavigation();
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const { data } = useQuery<{ myRecipes: { id: string }[] }>(GET_MY_RECIPES);

  useEffect(() => {
    getStoredProfile().then(setProfile);
  }, []);

  const recipeCount = data?.myRecipes?.length ?? 0;
  const name = profile?.fullName?.trim() || 'Cookpedia Chef';
  const handle = profile?.username ? `@${profile.username}` : '@cookpedia_chef';
  const avatar = profile?.avatarUri || FALLBACK_AVATAR;

  function comingSoon(feature: string) {
    Alert.alert(feature, 'This feature is coming soon.');
  }

  function confirmLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: onLogout },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable
          style={styles.headerButton}
          onPress={() => nav.push({ name: 'settings' })}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.handle}>{handle}</Text>
          {profile?.email ? <Text style={styles.email}>{profile.email}</Text> : null}
        </View>

        <View style={styles.statsRow}>
          <Stat value={`${recipeCount}`} label="Recipes" />
          <View style={styles.statDivider} />
          <Stat value={formatCount(584)} label="Following" />
          <View style={styles.statDivider} />
          <Stat value={formatCount(12300)} label="Followers" />
        </View>

        <Pressable
          style={styles.editButton}
          onPress={() => comingSoon('Edit Profile')}
          accessibilityRole="button"
        >
          <Ionicons name="create-outline" size={18} color={colors.primary} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>

        <View style={styles.group}>
          <MenuRow
            icon="reader-outline"
            label="My Recipes"
            onPress={() => comingSoon('My Recipes')}
          />
          <MenuRow
            icon="bookmark-outline"
            label="Bookmarks"
            onPress={() => nav.push({ name: 'bookmark' })}
          />
          <MenuRow
            icon="notifications-outline"
            label="Notifications"
            onPress={() => nav.push({ name: 'notifications' })}
          />
        </View>

        <View style={styles.group}>
          <MenuRow
            icon="settings-outline"
            label="Settings"
            onPress={() => nav.push({ name: 'settings' })}
          />
          <MenuRow
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => nav.push({ name: 'helpCenter' })}
          />
          <MenuRow
            icon="people-outline"
            label="Invite Friends"
            onPress={() => nav.push({ name: 'inviteFriends' })}
          />
        </View>

        <View style={styles.group}>
          <MenuRow icon="log-out-outline" label="Log Out" onPress={confirmLogout} danger />
        </View>
      </ScrollView>
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
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  identity: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
  },
  handle: {
    fontSize: fontSize.sm,
    color: colors.textSubtle,
    marginTop: 2,
  },
  email: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  editButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  group: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDanger: {
    backgroundColor: colors.primaryTint,
  },
  rowLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  rowLabelDanger: {
    color: colors.primary,
  },
});

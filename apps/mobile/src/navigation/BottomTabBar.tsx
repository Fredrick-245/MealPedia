import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme';

export type TabKey = 'home' | 'discover' | 'recipes' | 'profile';

type Tab = {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

const TABS: Tab[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'discover', label: 'Discover', icon: 'compass-outline', activeIcon: 'compass' },
  { key: 'recipes', label: 'My Recipes', icon: 'reader-outline', activeIcon: 'reader' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

type BottomTabBarProps = {
  active: TabKey;
  onChange: (key: TabKey) => void;
  onAdd?: () => void;
};

export function BottomTabBar({ active, onChange, onAdd }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  function renderTab(tab: Tab) {
    const isActive = active === tab.key;
    return (
      <Pressable key={tab.key} style={styles.tab} onPress={() => onChange(tab.key)}>
        <Ionicons
          name={isActive ? tab.activeIcon : tab.icon}
          size={22}
          color={isActive ? colors.primary : colors.textSubtle}
        />
        <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      {renderTab(TABS[0])}
      {renderTab(TABS[1])}

      <View style={styles.fabWrap}>
        <Pressable
          style={styles.fab}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add recipe"
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </Pressable>
      </View>

      {renderTab(TABS[2])}
      {renderTab(TABS[3])}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSubtle,
  },
  labelActive: {
    color: colors.primary,
  },
  fabWrap: {
    width: 64,
    alignItems: 'center',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

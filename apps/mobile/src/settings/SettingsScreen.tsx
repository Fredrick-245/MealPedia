import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { LogoutModal } from './LogoutModal';

export type SettingsRoute =
  | 'personalInfo'
  | 'notificationSettings'
  | 'security'
  | 'language'
  | 'inviteFriends'
  | 'helpCenter';

type SettingsScreenProps = {
  onBack: () => void;
  onNavigate: (route: SettingsRoute) => void;
  onLogout: () => void;
};

function Row({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Ionicons name={icon} size={18} color={danger ? colors.primary : colors.text} />
      </View>
      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
    </Pressable>
  );
}

export function SettingsScreen({ onBack, onNavigate, onLogout }: SettingsScreenProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Settings" onBack={onBack} rightIcon="ellipsis-horizontal" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.group}>
          <Row icon="person-outline" label="Personal Info" onPress={() => onNavigate('personalInfo')} />
          <Row
            icon="notifications-outline"
            label="Notification"
            onPress={() => onNavigate('notificationSettings')}
          />
          <Row
            icon="shield-checkmark-outline"
            label="Security"
            onPress={() => onNavigate('security')}
          />
          <Row
            icon="language-outline"
            label="Language"
            value="English (US)"
            onPress={() => onNavigate('language')}
          />
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="moon-outline" size={18} color={colors.text} />
            </View>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.group}>
          <Row
            icon="people-outline"
            label="Invite Friends"
            onPress={() => onNavigate('inviteFriends')}
          />
          <Row
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => onNavigate('helpCenter')}
          />
        </View>

        <View style={styles.group}>
          <Row
            icon="log-out-outline"
            label="Logout"
            onPress={() => setLogoutVisible(true)}
            danger
          />
        </View>
      </ScrollView>

      <LogoutModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={() => {
          setLogoutVisible(false);
          onLogout();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  group: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
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
  rowValue: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});

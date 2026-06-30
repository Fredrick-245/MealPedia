import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSize, radius, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { getStoredProfile, StoredProfile } from '../storage';

const FALLBACK_AVATAR = 'https://i.pravatar.cc/200?img=68';

const GENDER_LABELS: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  non_binary: 'Non-binary',
  prefer_not_to_say: 'Prefer not to say',
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueBox}>
        <Text style={styles.fieldValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

export function PersonalInfoScreen({ onBack }: { onBack: () => void }) {
  const [profile, setProfile] = useState<StoredProfile | null>(null);

  useEffect(() => {
    getStoredProfile().then(setProfile);
  }, []);

  const name = profile?.fullName?.trim() || 'Cookpedia Chef';
  const handle = profile?.username ? `@${profile.username}` : '@cookpedia_chef';
  const avatar = profile?.avatarUri || FALLBACK_AVATAR;
  const gender = profile?.gender ? GENDER_LABELS[profile.gender] ?? profile.gender : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Personal Info" onBack={onBack} rightIcon="create-outline" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.handle}>{handle}</Text>
          </View>
        </View>

        <Field label="Email" value={profile?.email ?? ''} />
        <Field label="Phone Number" value={profile?.phoneNumber ?? ''} />
        <Field label="Gender" value={gender} />
        <Field label="Date of Birth" value={profile?.dateOfBirth ?? ''} />
        <Field label="Country" value={profile?.country ?? ''} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.text,
  },
  handle: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    marginTop: 2,
  },
  field: {
    marginTop: spacing.lg,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  fieldValueBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  fieldValue: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
});

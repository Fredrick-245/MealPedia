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
import { useQuery } from '@apollo/client/react';
import { GET_PEOPLE } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Person } from '../chefs/types';

function InviteRow({ person }: { person: Person }) {
  const [invited, setInvited] = useState(false);
  return (
    <View style={styles.row}>
      <Image source={{ uri: person.avatarUrl }} style={styles.avatar} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {person.name}
        </Text>
        <Text style={styles.handle} numberOfLines={1}>
          {person.handle}
        </Text>
      </View>
      <Pressable
        style={[styles.button, invited ? styles.buttonOutlined : styles.buttonFilled]}
        onPress={() => setInvited((v) => !v)}
      >
        <Text style={[styles.buttonText, invited ? styles.buttonTextOutlined : styles.buttonTextFilled]}>
          {invited ? 'Invited' : 'Invite'}
        </Text>
      </Pressable>
    </View>
  );
}

export function InviteFriendsScreen({ onBack }: { onBack: () => void }) {
  const { data, loading } = useQuery<{ people: Person[] }>(GET_PEOPLE);
  const people = data?.people ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Invite Friends" onBack={onBack} rightIcon="ellipsis-horizontal" />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <InviteRow person={item} />}
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  handle: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    marginTop: 2,
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonFilled: {
    backgroundColor: colors.primary,
  },
  buttonOutlined: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  buttonTextFilled: {
    color: colors.white,
  },
  buttonTextOutlined: {
    color: colors.primary,
  },
});

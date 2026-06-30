import React from 'react';
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
import { useQuery } from '@apollo/client/react';
import { GET_CHEFS } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Chef } from './types';

type TopChefsScreenProps = {
  onBack: () => void;
  onOpenChef: (chef: Chef) => void;
  onSearch: () => void;
};

function GridChefCard({ chef, onPress }: { chef: Chef; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground
        source={{ uri: chef.avatarUrl }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.72)']}
          style={styles.gradient}
        />
        <Text style={styles.name} numberOfLines={1}>
          {chef.name}
        </Text>
      </ImageBackground>
    </Pressable>
  );
}

export function TopChefsScreen({ onBack, onOpenChef, onSearch }: TopChefsScreenProps) {
  const { data, loading, error } = useQuery<{ chefs: Chef[] }>(GET_CHEFS);
  const chefs = data?.chefs ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Top Chefs" onBack={onBack} onRightPress={onSearch} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Could not load chefs</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={chefs}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GridChefCard chef={item} onPress={() => onOpenChef(item)} />
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
  grid: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  card: {
    width: '48%',
    height: 150,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageRadius: {
    borderRadius: radius.lg,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
  },
  name: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '700',
    paddingBottom: spacing.md,
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

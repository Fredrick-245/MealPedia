import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize, radius, spacing } from '../theme';
import { Chef } from '../chefs/types';

export function ChefCard({ chef, onPress }: { chef: Chef; onPress?: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground
        source={{ uri: chef.avatarUrl }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {chef.name}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 130,
    borderRadius: radius.lg,
    marginRight: spacing.lg,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: radius.lg,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
  },
  content: {
    padding: spacing.sm,
    alignItems: 'center',
  },
  name: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});

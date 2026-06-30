import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';

export function PromoBanner() {
  return (
    <LinearGradient
      colors={['#F26D6D', '#E94B4B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <View style={styles.textCol}>
        <Text style={styles.heading}>Learn how to become a master chef right now!</Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Read more</Text>
        </Pressable>
      </View>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          name="chef-hat"
          size={92}
          color="rgba(255,255,255,0.9)"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  textCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heading: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: fontSize.xs,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

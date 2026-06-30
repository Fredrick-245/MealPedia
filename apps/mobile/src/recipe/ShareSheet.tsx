import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';

type ShareSheetProps = {
  visible: boolean;
  onClose: () => void;
};

type ShareTarget = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const TARGETS: ShareTarget[] = [
  { key: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366' },
  { key: 'facebook', label: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#E1306C' },
  { key: 'twitter', label: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
  { key: 'messenger', label: 'Messenger', icon: 'chatbubble-ellipses', color: '#0084FF' },
  { key: 'copy', label: 'Copy Link', icon: 'link', color: colors.textMuted },
  { key: 'email', label: 'Email', icon: 'mail', color: '#EA4335' },
  { key: 'more', label: 'More', icon: 'ellipsis-horizontal', color: colors.text },
];

export function ShareSheet({ visible, onClose }: ShareSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Share</Text>
          <View style={styles.grid}>
            {TARGETS.map((target) => (
              <Pressable key={target.key} style={styles.item} onPress={onClose}>
                <View style={[styles.iconCircle, { backgroundColor: target.color }]}>
                  <Ionicons name={target.icon} size={24} color={colors.white} />
                </View>
                <Text style={styles.itemLabel} numberOfLines={1}>
                  {target.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.xl,
  },
  item: {
    width: '25%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});

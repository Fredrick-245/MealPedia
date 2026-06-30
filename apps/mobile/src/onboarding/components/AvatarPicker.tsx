import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, fontSize, radius, spacing } from '../../theme';

type AvatarPickerProps = {
  uri: string | null;
  onChange: (uri: string | null) => void;
};

export function AvatarPicker({ uri, onChange }: AvatarPickerProps) {
  const [open, setOpen] = useState(false);

  async function pickFromGallery() {
    setOpen(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access to choose a picture.',
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    setOpen(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow camera access to take a picture.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.avatar} onPress={() => setOpen(true)}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.placeholderHead} />
            <View style={styles.placeholderBody} />
          </View>
        )}
      </Pressable>

      <Pressable style={styles.editBadge} onPress={() => setOpen(true)} hitSlop={8}>
        <Text style={styles.editIcon}>{'\u270E'}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Profile photo</Text>
            <Pressable style={styles.option} onPress={takePhoto}>
              <Text style={styles.optionLabel}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.option} onPress={pickFromGallery}>
              <Text style={styles.optionLabel}>Choose from Gallery</Text>
            </Pressable>
            {uri ? (
              <Pressable
                style={styles.option}
                onPress={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <Text style={[styles.optionLabel, styles.optionDanger]}>
                  Remove Photo
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const AVATAR_SIZE = 104;

const styles = StyleSheet.create({
  wrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignSelf: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    paddingTop: 22,
  },
  placeholderHead: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: '#CFCFCF',
    marginBottom: 6,
  },
  placeholderBody: {
    width: 60,
    height: 34,
    borderTopLeftRadius: radius.pill,
    borderTopRightRadius: radius.pill,
    backgroundColor: '#CFCFCF',
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 31, 31, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  option: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  optionLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  optionDanger: {
    color: colors.primary,
  },
});

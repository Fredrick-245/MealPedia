import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  CREATE_RECIPE,
  DELETE_RECIPE,
  GET_MY_RECIPES,
  GET_RECIPE,
  GET_RECIPES,
  UPDATE_RECIPE,
} from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { RecipeDetail } from './types';
import { DeleteRecipeModal } from './DeleteRecipeModal';

const MAX_COVER_IMAGES = 6;
const MAX_STEP_IMAGES = 3;

type CreateRecipeScreenProps = {
  recipeId?: string;
  onClose: () => void;
  onSaved: () => void;
};

type IngredientDraft = { text: string };
type InstructionDraft = { text: string; images: string[] };

async function pickImages(limit: number): Promise<string[]> {
  if (limit <= 0) return [];
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission needed', 'Please allow photo library access to add pictures.');
    return [];
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: limit,
    quality: 0.8,
  });
  if (result.canceled) return [];
  return result.assets.map((a) => a.uri);
}

function Label({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function CreateRecipeScreen({ recipeId, onClose, onSaved }: CreateRecipeScreenProps) {
  const isEdit = Boolean(recipeId);

  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [serves, setServes] = useState('');
  const [origin, setOrigin] = useState('');
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([
    { text: '' },
    { text: '' },
    { text: '' },
  ]);
  const [instructions, setInstructions] = useState<InstructionDraft[]>([
    { text: '', images: [] },
    { text: '', images: [] },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data } = useQuery<{ recipe: RecipeDetail }>(GET_RECIPE, {
    variables: { id: recipeId },
    skip: !recipeId,
  });

  useEffect(() => {
    const r = data?.recipe;
    if (!r) return;
    setImages(r.galleryUrls?.length ? r.galleryUrls : r.imageUrl ? [r.imageUrl] : []);
    setTitle(r.title);
    setDescription(r.description);
    setCookTime(r.cookTime || `${r.prepTimeMinutes} mins`);
    setServes(`${r.servings}`);
    setOrigin(r.origin);
    setIngredients(
      r.ingredients?.length ? r.ingredients.map((i) => ({ text: i.text })) : [{ text: '' }],
    );
    setInstructions(
      r.instructions?.length
        ? r.instructions.map((s) => ({ text: s.text, images: s.images }))
        : [{ text: '', images: [] }],
    );
  }, [data]);

  const baseRefetch = [{ query: GET_RECIPES }, { query: GET_MY_RECIPES }];
  const updateRefetch = recipeId
    ? [...baseRefetch, { query: GET_RECIPE, variables: { id: recipeId } }]
    : baseRefetch;
  const [createRecipe, { loading: creating }] = useMutation(CREATE_RECIPE, {
    refetchQueries: baseRefetch,
  });
  const [updateRecipe, { loading: updating }] = useMutation(UPDATE_RECIPE, {
    refetchQueries: updateRefetch,
  });
  const [deleteRecipe, { loading: deleting }] = useMutation(DELETE_RECIPE, {
    refetchQueries: baseRefetch,
  });
  const saving = creating || updating;

  async function addCoverImages() {
    const picked = await pickImages(MAX_COVER_IMAGES - images.length);
    if (picked.length) setImages((prev) => [...prev, ...picked].slice(0, MAX_COVER_IMAGES));
  }

  async function addStepImages(index: number) {
    const current = instructions[index].images;
    const picked = await pickImages(MAX_STEP_IMAGES - current.length);
    if (!picked.length) return;
    setInstructions((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, images: [...s.images, ...picked].slice(0, MAX_STEP_IMAGES) } : s,
      ),
    );
  }

  function updateIngredient(index: number, text: string) {
    setIngredients((prev) => prev.map((it, i) => (i === index ? { text } : it)));
  }

  function updateInstruction(index: number, text: string) {
    setInstructions((prev) => prev.map((it, i) => (i === index ? { ...it, text } : it)));
  }

  async function save(publish: boolean) {
    if (saving) return;
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please add a recipe title before saving.');
      return;
    }
    const input = {
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      imageUrl: images[0] ?? '',
      galleryUrls: images,
      cookTime: cookTime.trim(),
      servings: parseInt(serves, 10) || 1,
      origin: origin.trim(),
      calories: 0,
      published: publish,
      ingredients: ingredients
        .filter((i) => i.text.trim())
        .map((i) => ({ text: i.text.trim(), emoji: '' })),
      instructions: instructions
        .filter((s) => s.text.trim())
        .map((s) => ({ text: s.text.trim(), images: s.images })),
    };
    if (isEdit) {
      await updateRecipe({ variables: { input: { ...input, id: recipeId } } });
    } else {
      await createRecipe({ variables: { input } });
    }
    onSaved();
  }

  async function handleDelete() {
    if (deleting) return;
    await deleteRecipe({ variables: { id: recipeId } });
    setConfirmDelete(false);
    onSaved();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close">
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {isEdit ? 'Edit Recipe' : 'Create Recipe'}
        </Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton} onPress={() => save(false)} disabled={saving}>
            <Text style={styles.headerButtonText}>Save</Text>
          </Pressable>
          <Pressable
            style={[styles.headerButton, styles.headerButtonFilled]}
            onPress={() => save(true)}
            disabled={saving}
          >
            <Text style={[styles.headerButtonText, styles.headerButtonTextFilled]}>Publish</Text>
          </Pressable>
          {isEdit ? (
            <Pressable onPress={() => setMenuOpen((v) => !v)} hitSlop={8} accessibilityLabel="Options">
              <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {menuOpen && isEdit ? (
        <>
          <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menu}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                setConfirmDelete(true);
              }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.primary} />
              <Text style={styles.menuLabel}>Delete Recipe</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {images.length === 0 ? (
          <Pressable style={styles.coverPlaceholder} onPress={addCoverImages}>
            <Ionicons name="image-outline" size={40} color={colors.textSubtle} />
            <Text style={styles.coverPlaceholderText}>Add recipe cover image</Text>
          </Pressable>
        ) : (
          <View>
            <View style={styles.coverMain}>
              <Image source={{ uri: images[0] }} style={styles.coverImage} />
              <Pressable style={styles.coverEdit} onPress={addCoverImages} accessibilityLabel="Add images">
                <Ionicons name="pencil" size={16} color={colors.white} />
              </Pressable>
            </View>
            <View style={styles.thumbRow}>
              {images.map((uri, i) => (
                <View key={`${uri}-${i}`} style={styles.thumb}>
                  <Image source={{ uri }} style={styles.thumbImage} />
                  <Pressable
                    style={styles.thumbRemove}
                    onPress={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    accessibilityLabel="Remove image"
                  >
                    <Ionicons name="close" size={12} color={colors.white} />
                  </Pressable>
                </View>
              ))}
              {images.length < MAX_COVER_IMAGES ? (
                <Pressable style={styles.thumbAdd} onPress={addCoverImages} accessibilityLabel="Add image">
                  <Ionicons name="add" size={22} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>
            <Text style={styles.coverCount}>{images.length}/{MAX_COVER_IMAGES} photos</Text>
          </View>
        )}

        <Label>Title</Label>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Recipe Title"
          placeholderTextColor={colors.textSubtle}
          style={styles.input}
        />

        <Label>Description</Label>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Tell us about your recipe"
          placeholderTextColor={colors.textSubtle}
          style={[styles.input, styles.textarea]}
          multiline
        />

        <Label>Cook Time</Label>
        <TextInput
          value={cookTime}
          onChangeText={setCookTime}
          placeholder="1 hour 30 mins est"
          placeholderTextColor={colors.textSubtle}
          style={styles.input}
        />

        <Label>Serves</Label>
        <TextInput
          value={serves}
          onChangeText={setServes}
          placeholder="2 people"
          placeholderTextColor={colors.textSubtle}
          keyboardType="number-pad"
          style={styles.input}
        />

        <Label>Origin</Label>
        <View style={[styles.input, styles.inputWithIcon]}>
          <TextInput
            value={origin}
            onChangeText={setOrigin}
            placeholder="Location"
            placeholderTextColor={colors.textSubtle}
            style={styles.inputFlex}
          />
          <Ionicons name="location-outline" size={18} color={colors.textSubtle} />
        </View>

        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {ingredients.map((item, index) => (
          <View key={index} style={styles.listRow}>
            <Ionicons name="reorder-three" size={20} color={colors.textSubtle} />
            <View style={styles.listIndex}>
              <Text style={styles.listIndexText}>{index + 1}</Text>
            </View>
            <TextInput
              value={item.text}
              onChangeText={(t) => updateIngredient(index, t)}
              placeholder={`Ingredient ${index + 1}`}
              placeholderTextColor={colors.textSubtle}
              style={styles.listInput}
            />
            <Pressable
              onPress={() => setIngredients((prev) => prev.filter((_, i) => i !== index))}
              hitSlop={8}
              accessibilityLabel="Remove ingredient"
            >
              <Ionicons name="trash-outline" size={18} color={colors.primary} />
            </Pressable>
          </View>
        ))}
        <Pressable
          style={styles.addButton}
          onPress={() => setIngredients((prev) => [...prev, { text: '' }])}
        >
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={styles.addButtonText}>Add Ingredients</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Instructions:</Text>
        {instructions.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.listRow}>
              <Ionicons name="reorder-three" size={20} color={colors.textSubtle} />
              <View style={styles.listIndex}>
                <Text style={styles.listIndexText}>{index + 1}</Text>
              </View>
              <TextInput
                value={step.text}
                onChangeText={(t) => updateInstruction(index, t)}
                placeholder={`Instruction ${index + 1}`}
                placeholderTextColor={colors.textSubtle}
                style={styles.listInput}
                multiline
              />
              <Pressable
                onPress={() => setInstructions((prev) => prev.filter((_, i) => i !== index))}
                hitSlop={8}
                accessibilityLabel="Remove instruction"
              >
                <Ionicons name="trash-outline" size={18} color={colors.primary} />
              </Pressable>
            </View>
            <View style={styles.stepImages}>
              {step.images.map((uri, i) => (
                <View key={`${uri}-${i}`} style={styles.stepThumb}>
                  <Image source={{ uri }} style={styles.stepThumbImage} />
                  <Pressable
                    style={styles.thumbRemove}
                    onPress={() =>
                      setInstructions((prev) =>
                        prev.map((s, idx) =>
                          idx === index
                            ? { ...s, images: s.images.filter((_, j) => j !== i) }
                            : s,
                        ),
                      )
                    }
                    accessibilityLabel="Remove image"
                  >
                    <Ionicons name="close" size={12} color={colors.white} />
                  </Pressable>
                </View>
              ))}
              {step.images.length < MAX_STEP_IMAGES ? (
                <Pressable style={styles.stepImageAdd} onPress={() => addStepImages(index)}>
                  <Ionicons name="image-outline" size={20} color={colors.textMuted} />
                  <Text style={styles.stepImageAddText}>Add image</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ))}
        <Pressable
          style={styles.addButton}
          onPress={() => setInstructions((prev) => [...prev, { text: '', images: [] }])}
        >
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={styles.addButtonText}>Add Instructions</Text>
        </Pressable>
      </ScrollView>

      <DeleteRecipeModal
        visible={confirmDelete}
        deleting={deleting}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
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
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  headerButtonFilled: {
    backgroundColor: colors.primary,
  },
  headerButtonText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
  },
  headerButtonTextFilled: {
    color: colors.white,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  menu: {
    position: 'absolute',
    top: 52,
    right: spacing.xl,
    zIndex: 6,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    minWidth: 168,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  coverPlaceholder: {
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  coverPlaceholderText: {
    fontSize: fontSize.sm,
    color: colors.textSubtle,
  },
  coverMain: {
    height: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverEdit: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbRemove: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbAdd: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverCount: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    marginTop: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputFlex: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
    padding: 0,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  listIndex: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIndexText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
  },
  listInput: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  addButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  stepCard: {
    marginBottom: spacing.lg,
  },
  stepImages: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingLeft: 52,
  },
  stepThumb: {
    width: 72,
    height: 56,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  stepThumbImage: {
    width: '100%',
    height: '100%',
  },
  stepImageAdd: {
    flex: 1,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  stepImageAddText: {
    fontSize: 10,
    color: colors.textMuted,
  },
});

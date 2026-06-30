import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  ADD_COMMENT,
  DELETE_RECIPE,
  GET_MY_RECIPES,
  GET_RECIPE,
  GET_RECIPE_COMMENTS,
  GET_RECIPES,
} from '../graphql/client';
import { DeleteRecipeModal } from './DeleteRecipeModal';
import { colors, fontSize, radius, spacing } from '../theme';
import { Recipe, RecipeCard } from '../home/RecipeCard';
import { FollowButton } from '../chefs/FollowButton';
import { CommentRow } from './CommentRow';
import { ShareSheet } from './ShareSheet';
import { CURRENT_USER_AVATAR, RecipeComment, RecipeDetail } from './types';

type RecipeDetailScreenProps = {
  recipeId: string;
  onBack: () => void;
  onOpenComments: (recipeId: string, commentCount: number) => void;
  onEdit: (recipeId: string) => void;
};

function Chip({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <View>
        <Text style={styles.chipValue}>{value}</Text>
        <Text style={styles.chipLabel}>{label}</Text>
      </View>
    </View>
  );
}

function SectionHeader({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPress ? (
        <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityLabel={`See all ${title}`}>
          <Ionicons name="arrow-forward" size={20} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function RecipeDetailScreen({
  recipeId,
  onBack,
  onOpenComments,
  onEdit,
}: RecipeDetailScreenProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [shareVisible, setShareVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { data, loading } = useQuery<{ recipe: RecipeDetail }>(GET_RECIPE, {
    variables: { id: recipeId },
  });
  const [deleteRecipe, { loading: deleting }] = useMutation(DELETE_RECIPE, {
    refetchQueries: [{ query: GET_RECIPES }, { query: GET_MY_RECIPES }],
  });

  async function handleDelete() {
    if (deleting) return;
    await deleteRecipe({ variables: { id: recipeId } });
    setConfirmDelete(false);
    onBack();
  }
  const commentsQuery = useQuery<{ recipeComments: RecipeComment[] }>(
    GET_RECIPE_COMMENTS,
    { variables: { recipeId } },
  );
  const moreQuery = useQuery<{ recipes: Recipe[] }>(GET_RECIPES);

  const recipe = data?.recipe;
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [addComment, { loading: posting }] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_RECIPE_COMMENTS, variables: { recipeId } }],
  });

  async function submitComment() {
    const value = commentText.trim();
    if (!value || posting) return;
    setCommentText('');
    await addComment({ variables: { input: { recipeId, text: value } } });
  }
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (recipe) setBookmarked(recipe.bookmarked);
  }, [recipe]);

  function toggleBookmark() {
    const next = !bookmarked;
    setBookmarked(next);
    if (next) {
      setShowToast(true);
      Animated.sequence([
        Animated.timing(toastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.delay(1400),
        Animated.timing(toastOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start(() => setShowToast(false));
    }
  }

  if (loading || !recipe) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const comments = commentsQuery.data?.recipeComments ?? [];
  const moreRecipes = (moreQuery.data?.recipes ?? [])
    .filter((r) => r.id !== recipe.id)
    .slice(0, 8);
  const gallery = recipe.galleryUrls?.length ? recipe.galleryUrls : [recipe.imageUrl];
  const pageWidth = windowWidth - spacing.lg * 2;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) =>
              setActiveImage(Math.round(e.nativeEvent.contentOffset.x / pageWidth))
            }
          >
            {gallery.map((uri, i) => (
              <ImageBackground
                key={`${uri}-${i}`}
                source={{ uri }}
                style={[styles.heroImage, { width: pageWidth }]}
                imageStyle={styles.heroRadius}
              />
            ))}
          </ScrollView>

          <View style={styles.heroTopRow}>
            <Pressable style={styles.heroButton} onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </Pressable>
            <View style={styles.heroTopRight}>
              <Pressable style={styles.heroButton} onPress={() => setShareVisible(true)} accessibilityRole="button" accessibilityLabel="Share">
                <Ionicons name="paper-plane-outline" size={18} color={colors.white} />
              </Pressable>
              <View>
                <Pressable
                  style={styles.heroButton}
                  onPress={toggleBookmark}
                  accessibilityRole="button"
                  accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Ionicons
                    name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={18}
                    color={colors.white}
                  />
                </Pressable>
                {showToast ? (
                  <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                    <Text style={styles.toastText}>Save | Added to Bookmark</Text>
                  </Animated.View>
                ) : null}
              </View>
              {recipe.isOwn ? (
                <Pressable
                  style={styles.heroButton}
                  onPress={() => setMenuOpen((v) => !v)}
                  accessibilityRole="button"
                  accessibilityLabel="Recipe options"
                >
                  <Ionicons name="ellipsis-horizontal" size={18} color={colors.white} />
                </Pressable>
              ) : null}
            </View>
          </View>

          {gallery.length > 1 ? (
            <View style={styles.dots}>
              {gallery.map((_, i) => (
                <View key={i} style={[styles.dot, i === activeImage && styles.dotActive]} />
              ))}
            </View>
          ) : null}

          {menuOpen && recipe.isOwn ? (
            <>
              <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)} />
              <View style={styles.menu}>
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuOpen(false);
                    onEdit(recipe.id);
                  }}
                >
                  <Ionicons name="create-outline" size={18} color={colors.text} />
                  <Text style={styles.menuLabel}>Edit Recipe</Text>
                </Pressable>
                <View style={styles.menuDivider} />
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuOpen(false);
                    setConfirmDelete(true);
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.primary} />
                  <Text style={[styles.menuLabel, styles.menuDanger]}>Delete Recipe</Text>
                </Pressable>
              </View>
            </>
          ) : null}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.authorRow}>
            <Image source={{ uri: recipe.authorAvatarUrl }} style={styles.authorAvatar} />
            <View style={styles.authorBody}>
              <Text style={styles.authorName}>{recipe.authorName}</Text>
              <Text style={styles.authorHandle}>{recipe.authorHandle}</Text>
            </View>
            <FollowButton initialFollowing={false} />
          </View>

          <Text style={styles.description}>{recipe.description}</Text>

          <View style={styles.chips}>
            <Chip
              icon="time-outline"
              value={recipe.cookTime || `${recipe.prepTimeMinutes} mins`}
              label="cook time"
            />
            <Chip icon="restaurant-outline" value={`${recipe.servings} serve`} label="serving" />
            <Chip icon="flame-outline" value={`${recipe.calories}`} label="Kcal" />
          </View>

          <SectionHeader title={`Ingredients: ${recipe.ingredients.length} items`} />
          <View style={styles.ingredients}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={`${ingredient.text}-${index}`} style={styles.ingredientRow}>
                <View style={styles.ingredientIndex}>
                  <Text style={styles.ingredientIndexText}>{index + 1}</Text>
                </View>
                <Text style={styles.ingredientText}>{ingredient.text}</Text>
                <Text style={styles.ingredientEmoji}>{ingredient.emoji}</Text>
              </View>
            ))}
          </View>

          <SectionHeader title="Instructions:" />
          <View style={styles.instructions}>
            {recipe.instructions.map((step, index) => (
              <View key={index} style={styles.step}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
                {step.images.length ? (
                  <View style={styles.stepImages}>
                    {step.images.map((uri, i) => (
                      <Image key={i} source={{ uri }} style={styles.stepImage} />
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>

          <SectionHeader
            title={`Comments (${recipe.commentCount})`}
            onPress={() => onOpenComments(recipe.id, recipe.commentCount)}
          />
          <View style={styles.commentsPreview}>
            {comments.slice(0, 3).map((comment) => (
              <CommentRow key={comment.id} comment={comment} />
            ))}
          </View>
          <View style={styles.addComment}>
            <Image source={{ uri: CURRENT_USER_AVATAR }} style={styles.addCommentAvatar} />
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textSubtle}
              style={styles.addCommentInput}
              multiline
            />
            <Pressable
              onPress={submitComment}
              disabled={!commentText.trim() || posting}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Send comment"
            >
              <Ionicons
                name="send"
                size={18}
                color={commentText.trim() ? colors.primary : colors.textSubtle}
              />
            </Pressable>
          </View>

          <View style={styles.moreHeader}>
            <Text style={styles.sectionTitle}>More Recipes Like This</Text>
          </View>
          <FlatList
            data={moreRecipes}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
          />
        </View>
      </ScrollView>
      <ShareSheet visible={shareVisible} onClose={() => setShareVisible(false)} />
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
  scroll: {
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    position: 'relative',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  heroImage: {
    height: 260,
  },
  heroRadius: {
    borderRadius: radius.xl,
  },
  heroTopRow: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTopRight: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  heroButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    position: 'absolute',
    top: 44,
    right: 0,
    backgroundColor: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    width: 170,
  },
  toastText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  menu: {
    position: 'absolute',
    top: 58,
    right: spacing.xl,
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
  menuDanger: {
    color: colors.primary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  authorBody: {
    flex: 1,
  },
  authorName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  authorHandle: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    marginTop: 2,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 22,
    marginTop: spacing.lg,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  chipValue: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  chipLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  ingredients: {
    gap: spacing.md,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  ingredientIndex: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientIndexText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
  },
  ingredientText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  ingredientEmoji: {
    fontSize: 18,
  },
  instructions: {
    gap: spacing.xl,
  },
  step: {
    gap: spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
  },
  stepText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 21,
  },
  stepImages: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingLeft: 38,
  },
  stepImage: {
    flex: 1,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  commentsPreview: {
    gap: spacing.xl,
  },
  addComment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addCommentAvatar: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  addCommentInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: fontSize.sm,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  moreHeader: {
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
});

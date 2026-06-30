import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@apollo/client/react';
import { ADD_COMMENT, GET_RECIPE_COMMENTS } from '../graphql/client';
import { colors, fontSize, radius, spacing } from '../theme';
import { CURRENT_USER_AVATAR, RecipeComment } from './types';
import { CommentRow } from './CommentRow';

type CommentsScreenProps = {
  recipeId: string;
  commentCount: number;
  onBack: () => void;
};

type SortKey = 'newest' | 'popular';

export function CommentsScreen({ recipeId, commentCount, onBack }: CommentsScreenProps) {
  const [sort, setSort] = useState<SortKey>('newest');
  const [text, setText] = useState('');

  const { data, loading } = useQuery<{ recipeComments: RecipeComment[] }>(
    GET_RECIPE_COMMENTS,
    { variables: { recipeId } },
  );
  const [addComment, { loading: posting }] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_RECIPE_COMMENTS, variables: { recipeId } }],
  });

  const comments = [...(data?.recipeComments ?? [])];
  if (sort === 'popular') {
    comments.sort((a, b) => b.likes - a.likes);
  }

  async function submit() {
    const value = text.trim();
    if (!value || posting) return;
    setText('');
    await addComment({ variables: { input: { recipeId, text: value } } });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Comments ({commentCount})</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.sortRow}>
        {(['newest', 'popular'] as SortKey[]).map((key) => {
          const active = sort === key;
          return (
            <Pressable
              key={key}
              style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
              onPress={() => setSort(key)}
            >
              <Text style={[styles.pillText, active ? styles.pillTextActive : styles.pillTextInactive]}>
                {key === 'newest' ? 'Newest' : 'Popular'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <CommentRow comment={item} />}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={styles.inputBar}>
          <Image source={{ uri: CURRENT_USER_AVATAR }} style={styles.inputAvatar} />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
            multiline
          />
          <Pressable
            style={styles.sendButton}
            onPress={submit}
            disabled={!text.trim() || posting}
            accessibilityRole="button"
            accessibilityLabel="Send comment"
          >
            <Ionicons name="send" size={18} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  headerSpacer: {
    width: 24,
  },
  sortRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  pill: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillInactive: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  pillTextActive: {
    color: colors.white,
  },
  pillTextInactive: {
    color: colors.primary,
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
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  input: {
    flex: 1,
    maxHeight: 110,
    fontSize: fontSize.sm,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

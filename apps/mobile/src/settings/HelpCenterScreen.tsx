import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';

type TabKey = 'faq' | 'contact';

const CATEGORIES = ['General', 'Account', 'Service', 'Payment', 'Recipe'];

type Faq = { category: string; question: string; answer: string };

const FAQS: Faq[] = [
  {
    category: 'General',
    question: 'What is Cookpedia?',
    answer:
      'Cookpedia is a recipe app that helps you discover, save, and share recipes from chefs and home cooks around the world.',
  },
  {
    category: 'General',
    question: 'How do I use Cookpedia?',
    answer:
      'Browse the Home and Discover tabs, search for recipes or chefs, bookmark your favorites, and create your own recipes from the + button.',
  },
  {
    category: 'Recipe',
    question: 'Is there a subscription fee to use Cookpedia?',
    answer:
      'No. Cookpedia is free to use. Some premium recipe collections may be added in the future.',
  },
  {
    category: 'Account',
    question: 'How do I cancel my subscription?',
    answer:
      'Go to Settings → Account to manage your plan. You can cancel any active subscription there.',
  },
  {
    category: 'Service',
    question: 'How can I contact support?',
    answer:
      'Open the Contact us tab in the Help Center to reach our team via Customer Service, WhatsApp, or social media.',
  },
];

const CONTACTS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { key: 'cs', label: 'Customer Service', icon: 'headset', color: colors.primary },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366' },
  { key: 'website', label: 'Website', icon: 'globe-outline', color: '#1DA1F2' },
  { key: 'facebook', label: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
  { key: 'twitter', label: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#E1306C' },
];

function FaqRow({ item }: { item: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable style={styles.faqRow} onPress={() => setOpen((v) => !v)}>
      <View style={styles.faqQuestionLine}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.primary}
        />
      </View>
      {open ? <Text style={styles.faqAnswer}>{item.answer}</Text> : null}
    </Pressable>
  );
}

export function HelpCenterScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<TabKey>('faq');
  const [category, setCategory] = useState('General');
  const [query, setQuery] = useState('');

  const filtered = FAQS.filter(
    (f) =>
      (category === 'General' || f.category === category) &&
      f.question.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Help Center" onBack={onBack} rightIcon="ellipsis-horizontal" />

      <View style={styles.tabs}>
        {(['faq', 'contact'] as TabKey[]).map((key) => {
          const active = tab === key;
          return (
            <Pressable key={key} style={styles.tab} onPress={() => setTab(key)}>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {key === 'faq' ? 'FAQ' : 'Contact us'}
              </Text>
              <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
            </Pressable>
          );
        })}
      </View>

      {tab === 'faq' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <Pressable
                  key={c}
                  style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSubtle} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor={colors.textSubtle}
              style={styles.searchInput}
            />
          </View>

          {filtered.map((item) => (
            <FaqRow key={item.question} item={item} />
          ))}
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {CONTACTS.map((c) => (
            <Pressable key={c.key} style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: c.color }]}>
                <Ionicons name={c.icon} size={18} color={colors.white} />
              </View>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabUnderline: {
    height: 3,
    width: '90%',
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },
  tabUnderlineActive: {
    backgroundColor: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  chips: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.white,
  },
  chipTextInactive: {
    color: colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
    padding: 0,
  },
  faqRow: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  faqQuestionLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  faqAnswer: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 21,
    marginTop: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
});

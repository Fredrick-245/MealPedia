import React from 'react';
import { ToggleItem, ToggleListScreen } from './ToggleListScreen';

const ITEMS: ToggleItem[] = [
  { key: 'general', label: 'General Notification', value: true },
  { key: 'recommendation', label: 'There is a content Recommendation', value: true },
  { key: 'following', label: 'Someone is following me', value: false },
  { key: 'sharing', label: 'Someone is sharing my content', value: true },
  { key: 'tagged', label: 'Someone tagged me in a content', value: false },
  { key: 'liked', label: 'Someone liked my content', value: true },
  { key: 'commented', label: 'Someone commented on my content', value: true },
  { key: 'updates', label: 'There is a new update', value: false },
  { key: 'activity', label: 'There is activity on my account', value: true },
];

export function NotificationSettingsScreen({ onBack }: { onBack: () => void }) {
  return <ToggleListScreen title="Notification" items={ITEMS} onBack={onBack} />;
}

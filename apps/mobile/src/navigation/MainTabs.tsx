import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { HomeScreen } from '../home/HomeScreen';
import { DiscoverScreen } from '../discover/DiscoverScreen';
import { MyRecipesScreen } from '../recipe/MyRecipesScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { BottomTabBar, TabKey } from './BottomTabBar';
import { useAppNavigation } from './RootNavigator';

export function MainTabs({ onLogout }: { onLogout: () => void }) {
  const [active, setActive] = useState<TabKey>('home');
  const nav = useAppNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {active === 'home' ? <HomeScreen /> : null}
        {active === 'discover' ? <DiscoverScreen /> : null}
        {active === 'recipes' ? <MyRecipesScreen /> : null}
        {active === 'profile' ? <ProfileScreen onLogout={onLogout} /> : null}
      </View>
      <BottomTabBar
        active={active}
        onChange={setActive}
        onAdd={() => nav.push({ name: 'recipeForm' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
});

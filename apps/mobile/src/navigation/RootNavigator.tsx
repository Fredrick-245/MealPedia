import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { MainTabs } from './MainTabs';
import { NotificationsScreen } from '../notifications/NotificationsScreen';
import { BookmarkScreen } from '../bookmark/BookmarkScreen';
import { MostPopularScreen } from '../discover/MostPopularScreen';
import { RecipeCategoriesScreen } from '../discover/RecipeCategoriesScreen';
import { CategoryDetailScreen } from '../discover/CategoryDetailScreen';
import { Category } from '../discover/CategoryCard';
import { TopChefsScreen } from '../chefs/TopChefsScreen';
import { ChefProfileScreen } from '../chefs/ChefProfileScreen';
import { FollowListScreen } from '../chefs/FollowListScreen';
import { SearchScreen } from '../search/SearchScreen';
import { RecipeDetailScreen } from '../recipe/RecipeDetailScreen';
import { CommentsScreen } from '../recipe/CommentsScreen';
import { CreateRecipeScreen } from '../recipe/CreateRecipeScreen';
import { SettingsScreen } from '../settings/SettingsScreen';
import { PersonalInfoScreen } from '../settings/PersonalInfoScreen';
import { NotificationSettingsScreen } from '../settings/NotificationSettingsScreen';
import { SecurityScreen } from '../settings/SecurityScreen';
import { LanguageScreen } from '../settings/LanguageScreen';
import { InviteFriendsScreen } from '../settings/InviteFriendsScreen';
import { HelpCenterScreen } from '../settings/HelpCenterScreen';
import { Chef } from '../chefs/types';

export type Route =
  | { name: 'notifications' }
  | { name: 'bookmark' }
  | { name: 'mostPopular' }
  | { name: 'recipeCategories' }
  | { name: 'categoryDetail'; category: Category }
  | { name: 'topChefs' }
  | { name: 'chefProfile'; chef: Chef }
  | { name: 'followList'; chef: Chef; mode: 'following' | 'followers' }
  | { name: 'search' }
  | { name: 'recipeDetail'; recipeId: string }
  | { name: 'comments'; recipeId: string; commentCount: number }
  | { name: 'recipeForm'; recipeId?: string }
  | { name: 'settings' }
  | { name: 'personalInfo' }
  | { name: 'notificationSettings' }
  | { name: 'security' }
  | { name: 'language' }
  | { name: 'inviteFriends' }
  | { name: 'helpCenter' };

type NavContextValue = {
  push: (route: Route) => void;
  pop: () => void;
};

const NavContext = createContext<NavContextValue>({
  push: () => undefined,
  pop: () => undefined,
});

export function useAppNavigation(): NavContextValue {
  return useContext(NavContext);
}

function renderRoute(
  route: Route,
  pop: () => void,
  push: (r: Route) => void,
  onLogout: () => void,
) {
  switch (route.name) {
    case 'notifications':
      return <NotificationsScreen onBack={pop} />;
    case 'bookmark':
      return <BookmarkScreen onBack={pop} />;
    case 'mostPopular':
      return <MostPopularScreen onBack={pop} />;
    case 'recipeCategories':
      return (
        <RecipeCategoriesScreen
          onBack={pop}
          onOpenCategory={(category) => push({ name: 'categoryDetail', category })}
        />
      );
    case 'categoryDetail':
      return <CategoryDetailScreen category={route.category} onBack={pop} />;
    case 'topChefs':
      return (
        <TopChefsScreen
          onBack={pop}
          onOpenChef={(chef) => push({ name: 'chefProfile', chef })}
          onSearch={() => push({ name: 'search' })}
        />
      );
    case 'chefProfile':
      return (
        <ChefProfileScreen
          chef={route.chef}
          onBack={pop}
          onOpenFollow={(mode) => push({ name: 'followList', chef: route.chef, mode })}
        />
      );
    case 'followList':
      return (
        <FollowListScreen
          chef={route.chef}
          initialMode={route.mode}
          onBack={pop}
          onSearch={() => push({ name: 'search' })}
        />
      );
    case 'search':
      return <SearchScreen onBack={pop} />;
    case 'recipeDetail':
      return (
        <RecipeDetailScreen
          recipeId={route.recipeId}
          onBack={pop}
          onOpenComments={(recipeId, commentCount) =>
            push({ name: 'comments', recipeId, commentCount })
          }
          onEdit={(recipeId) => push({ name: 'recipeForm', recipeId })}
        />
      );
    case 'comments':
      return (
        <CommentsScreen
          recipeId={route.recipeId}
          commentCount={route.commentCount}
          onBack={pop}
        />
      );
    case 'recipeForm':
      return (
        <CreateRecipeScreen recipeId={route.recipeId} onClose={pop} onSaved={pop} />
      );
    case 'settings':
      return (
        <SettingsScreen
          onBack={pop}
          onNavigate={(name) => push({ name } as Route)}
          onLogout={onLogout}
        />
      );
    case 'personalInfo':
      return <PersonalInfoScreen onBack={pop} />;
    case 'notificationSettings':
      return <NotificationSettingsScreen onBack={pop} />;
    case 'security':
      return <SecurityScreen onBack={pop} />;
    case 'language':
      return <LanguageScreen onBack={pop} />;
    case 'inviteFriends':
      return <InviteFriendsScreen onBack={pop} />;
    case 'helpCenter':
      return <HelpCenterScreen onBack={pop} />;
    default:
      return null;
  }
}

export function RootNavigator({ onLogout }: { onLogout: () => void }) {
  const [stack, setStack] = useState<Route[]>([]);

  const value: NavContextValue = {
    push: (route) => setStack((prev) => [...prev, route]),
    pop: () => setStack((prev) => prev.slice(0, -1)),
  };

  const top = stack[stack.length - 1];

  return (
    <NavContext.Provider value={value}>
      <View style={styles.root}>
        <MainTabs onLogout={onLogout} />
        {top ? (
          <View style={styles.overlay}>
            {renderRoute(top, value.pop, value.push, onLogout)}
          </View>
        ) : null}
      </View>
    </NavContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
});

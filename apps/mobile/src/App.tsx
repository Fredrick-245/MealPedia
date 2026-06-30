import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './graphql/client';
import { colors } from './theme';
import { OnboardingFlow } from './onboarding/OnboardingFlow';
import { OnboardingData } from './onboarding/types';
import { hasCompletedOnboarding, resetOnboarding, saveOnboarding } from './storage';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  const [checking, setChecking] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    hasCompletedOnboarding()
      .then(setOnboarded)
      .finally(() => setChecking(false));
  }, []);

  async function handleComplete(data: OnboardingData) {
    await saveOnboarding(data);
    setOnboarded(true);
  }

  async function handleLogout() {
    await resetOnboarding();
    setOnboarded(false);
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ApolloProvider client={client}>
        {checking ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : onboarded ? (
          <RootNavigator onLogout={handleLogout} />
        ) : (
          <OnboardingFlow onComplete={handleComplete} />
        )}
      </ApolloProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

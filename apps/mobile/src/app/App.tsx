import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ApolloProvider, useQuery } from '@apollo/client/react';
import { client, GET_RECIPES } from '../graphql/client';

type Recipe = {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
};

function RecipeList() {
  const { data, loading, error } = useQuery<{ recipes: Recipe[] }>(GET_RECIPES);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#c2410c" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Could not load recipes</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data?.recipes ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Cookpedia</Text>
          <Text style={styles.subtitle}>Your recipe collection</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <Text style={styles.cardMeta}>{item.prepTimeMinutes} min</Text>
        </View>
      )}
    />
  );
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ApolloProvider client={client}>
        <SafeAreaView style={styles.container}>
          <RecipeList />
        </SafeAreaView>
      </ApolloProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#9a3412',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: '#78716c',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1917',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#57534e',
    lineHeight: 20,
  },
  cardMeta: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#c2410c',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#991b1b',
  },
  errorText: {
    textAlign: 'center',
    color: '#57534e',
  },
});

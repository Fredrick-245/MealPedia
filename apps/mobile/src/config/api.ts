import { Platform } from 'react-native';

const DEFAULT_PORT = 3000;

export function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:${DEFAULT_PORT}`;
}

export function getGraphqlUrl(): string {
  return `${getApiUrl()}/graphql`;
}

import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';
import { getGraphqlUrl } from '../config/api';

export const client = new ApolloClient({
  link: new HttpLink({ uri: getGraphqlUrl() }),
  cache: new InMemoryCache(),
});

export const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      title
      description
      prepTimeMinutes
    }
  }
`;

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
      imageUrl
      authorName
      authorAvatarUrl
      category
      bookmarked
    }
  }
`;

export const GET_BOOKMARKS = gql`
  query GetBookmarks {
    bookmarkedRecipes {
      id
      title
      description
      prepTimeMinutes
      imageUrl
      authorName
      authorAvatarUrl
      category
      bookmarked
    }
  }
`;

export const GET_RECIPES_BY_CATEGORY = gql`
  query GetRecipesByCategory($category: String!) {
    recipesByCategory(category: $category) {
      id
      title
      description
      prepTimeMinutes
      imageUrl
      authorName
      authorAvatarUrl
      category
      bookmarked
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      kind
      message
      timeLabel
      actorName
      actorAvatarUrl
      thumbnailUrl
      iconKey
      tag
    }
  }
`;

const CHEF_FIELDS = `
  id
  name
  fullName
  handle
  avatarUrl
  recipeCount
  followingCount
  followersCount
  following
  bio
  whatsapp
  facebook
  twitter
  instagram
  website
  location
  joinedLabel
  views
`;

export const GET_DISCOVER = gql`
  query GetDiscover {
    chefs {
      ${CHEF_FIELDS}
    }
    recipeCategories {
      id
      name
      recipeCount
      imageUrl
    }
  }
`;

export const GET_CHEFS = gql`
  query GetChefs {
    chefs {
      ${CHEF_FIELDS}
    }
  }
`;

export const GET_PEOPLE = gql`
  query GetPeople($query: String) {
    people(query: $query) {
      id
      name
      handle
      avatarUrl
      following
    }
  }
`;

export const GET_RECIPES_BY_AUTHOR = gql`
  query GetRecipesByAuthor($author: String!) {
    recipesByAuthor(author: $author) {
      id
      title
      description
      prepTimeMinutes
      imageUrl
      authorName
      authorAvatarUrl
      category
      bookmarked
    }
  }
`;

export const GET_RECIPE = gql`
  query GetRecipe($id: String!) {
    recipe(id: $id) {
      id
      title
      description
      prepTimeMinutes
      cookTime
      origin
      isOwn
      imageUrl
      galleryUrls
      authorName
      authorHandle
      authorAvatarUrl
      category
      foodCategory
      bookmarked
      servings
      calories
      commentCount
      ingredients {
        text
        emoji
      }
      instructions {
        text
        images
      }
    }
  }
`;

export const GET_MY_RECIPES = gql`
  query GetMyRecipes {
    myRecipes {
      id
      title
      description
      prepTimeMinutes
      imageUrl
      authorName
      authorAvatarUrl
      category
      bookmarked
      published
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      id
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($input: UpdateRecipeInput!) {
    updateRecipe(input: $input) {
      id
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: String!) {
    deleteRecipe(id: $id)
  }
`;

export const GET_RECIPE_COMMENTS = gql`
  query GetRecipeComments($recipeId: String) {
    recipeComments(recipeId: $recipeId) {
      id
      authorName
      authorAvatarUrl
      text
      likes
      timeLabel
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      id
      authorName
      authorAvatarUrl
      text
      likes
      timeLabel
    }
  }
`;

export const SEARCH_RECIPES = gql`
  query SearchRecipes($query: String!) {
    searchRecipes(query: $query) {
      id
      title
      description
      prepTimeMinutes
      imageUrl
      authorName
      authorAvatarUrl
      category
      bookmarked
    }
  }
`;

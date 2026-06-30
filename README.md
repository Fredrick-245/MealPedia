# Cookpedia

An Nx monorepo for a recipe app with an Expo mobile client, NestJS GraphQL API, and PostgreSQL database.

## Stack

| Layer | Technology |
| --- | --- |
| Monorepo | [Nx](https://nx.dev) |
| Mobile | Expo (`apps/mobile`) |
| API | NestJS + GraphQL (`apps/api`) |
| Database | PostgreSQL via Docker + TypeORM |

## Project structure

```
cookpedia/
├── apps/
│   ├── api/          # NestJS GraphQL backend
│   └── mobile/       # Expo (React Native) client
├── docker-compose.yml
└── .env.example
```

## Prerequisites

- Node.js **20.19.4+**
- Docker Desktop (for PostgreSQL)
- [Expo Go](https://expo.dev/go) on your device, or Xcode / Android Studio for simulators

## Getting started

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Configure environment**

   ```sh
   cp .env.example .env
   ```

3. **Start PostgreSQL**

   ```sh
   npm run db:up
   ```

4. **Start the API** (GraphQL playground at http://localhost:3000/graphql)

   ```sh
   npm run api:serve
   ```

5. **Start the Expo app**

   ```sh
   npm run mobile:start
   ```

   Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

   Or run directly:

   ```sh
   npm run mobile:ios
   npm run mobile:android
   npm run mobile:web
   ```

## GraphQL API

The API exposes a sample `recipes` query and `createRecipe` mutation. Seed data is inserted on first startup.

Example query:

```graphql
query {
  recipes {
    id
    title
    description
    prepTimeMinutes
  }
}
```

## Mobile ↔ API connectivity

| Platform | Default API URL |
| --- | --- |
| iOS Simulator | `http://localhost:3000` |
| Android Emulator | `http://10.0.2.2:3000` |
| Physical device | Set `EXPO_PUBLIC_API_URL` to your machine's LAN IP |

Override with `EXPO_PUBLIC_API_URL` in `.env`.

## Useful commands

```sh
nx graph                    # Explore project dependencies
nx serve api                # Run NestJS API
nx start mobile             # Start Expo dev server
nx run-ios mobile           # iOS simulator
nx run-android mobile       # Android emulator
nx serve mobile             # Web via Expo
nx lint api                 # Lint API
nx lint mobile              # Lint mobile app
```

## Adding shared code

Generate a shared library for types or utilities used by both apps:

```sh
nx g @nx/js:lib shared --directory=libs/shared
```

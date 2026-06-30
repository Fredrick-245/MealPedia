# Cookpedia

An Nx monorepo for a recipe app with an Expo mobile client, NestJS GraphQL API, and PostgreSQL database.

## Stack

| Layer | Technology |
| --- | --- |
| Monorepo | [Nx](https://nx.dev) |
| Mobile | Expo SDK 54 (`apps/mobile`) — compatible with App Store Expo Go |
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
- **Expo Go** from the App Store / Play Store (supports SDK 54)

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

   Run this in your **system terminal** (Terminal.app, iTerm, etc.), not only through IDE task runners — Expo needs a real TTY to render the QR code.

   You should see a QR code to scan with **Expo Go**. Press `i` for iOS simulator or `a` for Android emulator.

   If the QR code still does not appear, start Expo directly:

   ```sh
   cd apps/mobile && npx expo start --go --lan
   ```

   For a device on a different network, use tunnel mode:

   ```sh
   npm run mobile:start:tunnel
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

## Expo Go compatibility

This project uses **Expo SDK 54**, which matches the version of **Expo Go** available on the App Store and Play Store.

If you see *"Project is incompatible with this version of Expo Go"*, your phone's Expo Go app is outdated — update it from the store. If you previously used SDK 55, pull the latest changes and run `npm install` again.

To use SDK 55+ before Expo Go catches up, you need a [development build](https://docs.expo.dev/develop/development-builds/introduction/) instead of Expo Go.

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

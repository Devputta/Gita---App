# Bhagavad Gita — Day 1–3 Foundation

This ZIP continues the Day 1 foundation through Day 2 premium UI and Day 3 content architecture.

## Requirements

- Node.js 22.x (22.13+ recommended)
- npm
- Android Studio + Android SDK 36 for native Android builds
- Expo Go for quick physical-device development testing

## Clean install (fixed dependency set)

If this folder came from a previous broken installation, do not copy `node_modules` or `package-lock.json` from the old project.

```bat
rmdir /s /q node_modules
del package-lock.json
npm install
```

## Run

```bat
npm run typecheck
npx expo-doctor
npx expo start --clear
```

For Android emulator:

```bat
npm run android
```

For browser:

```bat
npm run web
```

## Production AAB

Generate native Android files:

```bat
npx expo prebuild --platform android
```

Then build the release bundle:

```bat
cd android
gradlew.bat app:bundleRelease
```

The AAB will be under:

`android/app/build/outputs/bundle/release/app-release.aab`

Before publishing, replace the placeholder icon/splash assets, configure signing/credentials, and verify the final application ID.

## Day 3 database

The project includes:

- `lib/database/schema.sql`
- `lib/database/seed.sql`

They define one book, 18 chapters, Verse and Translation relationships, source metadata, review status, constraints, and indexes. No scripture verses or translations are seeded.

The UI uses a repository/service boundary so Supabase/PostgreSQL can be connected later without putting database calls inside screens.

## Content safety

No Bhagavad Gita verse or translation text is included. Chapter names and verse counts are intentionally left pending verification.


## Important
This fixed package aligns the Expo SDK 57 peer dependencies, including expo-constants, expo-font, expo-linking, expo-splash-screen, and expo-status-bar. Web dependencies are included so `npm run web` can resolve React Native Web. Do not use `--force` or `--legacy-peer-deps`.

## Day 9–12 additions

This package now includes:

- English translation support through the reviewed `Translation` model.
- Four-language reader: Sanskrit, Kannada, Hindi, English only.
- Single-language and Parallel reading modes.
- Persistent language and reader-mode preferences.
- Provider-independent audio contracts and a persistent browser Web Speech player.
- Play, Pause, Resume, Replay, Stop and playback speed controls (0.75x, 1x, 1.25x, 1.5x).
- Server-side TTS provider abstraction for Sarvam AI, Google Cloud TTS, Azure Speech and ElevenLabs.
- Explicit admin audio-generation approval UI and audio metadata migration.
- No API keys in frontend code and no copyrighted translation text bundled.

### Important production note

`app/admin/audio.tsx` is an implementation scaffold, not an authentication system. Before production release, protect the admin route with real administrator authentication/authorization and connect the server-side TTS provider. Do not put provider credentials in Expo/React Native code.

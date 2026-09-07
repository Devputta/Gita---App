# Bhagavad Gita — Day 13 to Day 16

This archive is the Day 1–12 project plus Day 13–16 functionality.

## 1. Install

```bat
npm install
```

## 2. Database / Sanskrit validation

If your PostgreSQL container is already running and `.env` has DATABASE_URL:

```bat
npm run db:generate
npm run db:validate-sanskrit
npm run db:import-sanskrit
```

Do not recreate an already-running PostgreSQL container.

## 3. TypeScript

```bat
npm run typecheck
```

This must pass before continuing.

## 4. Expo check

```bat
npx expo-doctor
```

Peer-dependency warnings may appear. Do not use `npm audit fix --force` during this functional test.

## 5. Run web

```bat
npm run web
```

## Day 13 acceptance test — Chapter Audio

1. Open Chapters.
2. Open a chapter.
3. Press **Play Chapter**.
4. Confirm Verse 1 starts.
5. Confirm the player moves to Verse 2, Verse 3, etc. automatically.
6. Test Pause, Resume, Previous, Next, Replay and Stop.
7. Open another verse while audio is active and confirm the player follows the new verse.
8. Test on desktop and mobile layouts.

Browser Web Speech is the current development playback adapter. Generated audio files from Day 12 can later replace it without changing the reader API.

## Day 14 acceptance test — Bookmarks

1. Open any verse.
2. Press Bookmark.
3. Press Remove Bookmark and confirm it disappears.
4. Bookmark again.
5. Open `/gita/bookmarks`.
6. Confirm Chapter, Verse, selected language and bookmark date appear.
7. Click the bookmark and confirm the exact verse opens.
8. Change language and verify the bookmark remains because it is keyed to the verse, not the language.
9. Storage currently uses an anonymous local user architecture. A real auth ID can replace it later.

## Day 15 acceptance test — Reading Progress

1. Open a verse such as Chapter 2 Verse 47.
2. Return to Home.
3. Confirm **Continue Reading** shows Chapter 2 · Verse 47.
4. Click Continue reading.
5. Confirm the exact verse opens.
6. Change language and verify the same progress remains.
7. Only chapter, verse and timestamp are stored for local progress.

## Day 16 acceptance test — Search

1. Open Search.
2. Search a Sanskrit keyword.
3. Search an English/Kannada/Hindi keyword after reviewed translations are loaded.
4. Confirm each result shows Chapter, Verse, matching text and language.
5. Click a result and confirm the exact verse opens.
6. Search is debounced for mobile-friendly typing.
7. The repository is split into a PostgreSQL-ready search interface and a local fallback. Production PostgreSQL should use a `tsvector` + GIN index and a server endpoint.

## Translation and copyright rule

Only reviewed `PUBLISHED` translations are displayed. The project does not scrape or copy copyrighted translations from websites. Add only translations you own, have permission to use, or that are clearly licensed for redistribution.

## Audio security rule

TTS provider credentials must remain server-side. The Expo/browser client must never contain provider API keys.

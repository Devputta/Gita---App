# Bhagavad Gita App — Day 6 to Day 8

This snapshot fixes the Day 4/5 TypeScript error and adds the Day 6–8 reader architecture.

## What was fixed

The original error was:

`Type 'number | undefined' is not assignable to type 'number | null'.`

In `lib/content/seed.ts`, the indexed verse-count lookup now uses:

`...[index] ?? null`

`tsconfig.json` was also adjusted so the installed TypeScript 6 compiler accepts the project configuration.

## Day 6 — Verse Reader

Implemented:

- `/gita/verse/[chapterNumber]/[verseNumber]`
- Chapter number, chapter title, verse number
- Verified Sanskrit verse display
- Previous / Next verse navigation
- Cross-chapter navigation
- Chapter navigation button
- Copy Sanskrit
- Share Verse
- Bookmark placeholder
- Calm, readable Sanskrit layout
- Devanagari typography
- No audio implementation
- No translations shown by default

## Day 7 — Kannada Translation

Implemented:

- Kannada language option: `ಕನ್ನಡ`
- Shared verse IDs across languages
- Translation repository architecture
- Translation metadata:
  - source
  - translator
  - publisher
  - license
  - sourceUrl
  - notes
  - reviewStatus
- Only `PUBLISHED` translations are displayed
- Empty Kannada dataset included so no copyrighted/unverified translation is silently imported
- Kannada font-family support

## Day 8 — Hindi Translation

Implemented:

- Hindi language option: `हिन्दी`
- Same verse ID as Sanskrit/Kannada
- Same translation metadata model
- Only `PUBLISHED` translations are displayed
- Empty Hindi dataset included
- Devanagari font-family support

## Full Windows run

Open Command Prompt in the project folder.

### 1. Install dependencies

```bat
npm install
npx expo install expo-clipboard
```

If Expo changes the `expo-clipboard` version to the SDK-compatible version, keep the version selected by Expo.

### 2. Verify the Sanskrit dataset

```bat
npm run db:validate-sanskrit
```

Expected:

```text
18 chapters / 700 verses / no duplicates / no gaps
```

### 3. Import Sanskrit into the database

Make sure `DATABASE_URL` is configured in `.env`, then:

```bat
npm run db:import-sanskrit
```

Expected:

```text
Sanskrit import completed successfully.
Validated: 18 chapters / 700 verses / no duplicates / no gaps.
No translations were imported.
```

### 4. Run TypeScript check

```bat
npm run typecheck
```

Expected:

```text
(no errors)
```

### 5. Check Expo project

```bat
npm run doctor
```

### 6. Start the app

For the browser:

```bat
npm run web
```

For Expo development:

```bat
npm start
```

Then press:

```text
w = web
a = Android
```

## Important translation rule

Do NOT paste a copyrighted translation into the JSON files unless its license explicitly permits this use.

Add future records to:

- `data/translations/kannada.json`
- `data/translations/hindi.json`

Example record shape:

```json
{
  "id": "translation-id",
  "verseId": "gita-001-chapter-02-verse-047",
  "language": "KANNADA",
  "text": "YOUR LICENSED OR ORIGINAL TRANSLATION",
  "source": "Source name",
  "translator": "Translator name",
  "publisher": "Publisher",
  "license": "License name",
  "sourceUrl": "https://example.com/source",
  "notes": "Verification notes",
  "reviewStatus": "REVIEW_REQUIRED",
  "createdAt": "2026-09-02T00:00:00.000Z",
  "updatedAt": "2026-09-02T00:00:00.000Z"
}
```

Change `reviewStatus` to `PUBLISHED` only after the translation has been properly reviewed and its licensing/source information is confirmed.

## Day 6–8 acceptance test

1. Open Chapters.
2. Open Chapter 2.
3. Open Verse 47.
4. Confirm Sanskrit is visible.
5. Tap Previous Verse and Next Verse.
6. At Chapter 1 Verse 1, Previous should be disabled.
7. At Chapter 18 Verse 78, Next should be disabled.
8. Tap Copy Sanskrit and verify clipboard content.
9. Tap Share Verse and verify the native share sheet.
10. Confirm Bookmark is visibly a placeholder and does not pretend to save.
11. Switch to Kannada.
12. Confirm the app shows the "no published translation" state because the snapshot intentionally contains no unverified translation.
13. Switch to Hindi and confirm the same behavior.
14. Switch back to Sanskrit and confirm the clean Sanskrit reader.

## Do not add yet

- Audio playback
- Automatic AI translation publishing
- Separate books for each language
- Scraped copyrighted translations
- Real bookmark persistence

Those should be implemented only in later days with the same source/review architecture.

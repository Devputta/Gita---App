# Bhagavad Gita — Day 4 + Day 5

This archive continues the existing Day 1–3 Expo/React Native project. It does **not** rebuild the application.

## Day 4

Added a PostgreSQL + Prisma architecture with:

- Book → Chapter → Verse
- Verse → Translation / Commentary / Audio
- User → Bookmark / ReadingProgress
- Language metadata
- Review status
- Source metadata
- Stable Verse IDs
- Uniqueness and indexes
- PostgreSQL migration
- Structural seed: 1 book, 18 chapters, 4 languages
- No translations or generated scripture in the structural seed

Prisma is a server-side/database dependency. Do not import `@prisma/client` into an Expo screen or React Native bundle.

## Day 5

Added a verified-source Sanskrit import pipeline.

Primary source:

- `gita/gita`
- `data/verse.json`
- Unlicense
- https://github.com/gita/gita
- https://raw.githubusercontent.com/gita/gita/main/data/verse.json

The source contains an optional Chapter 13 verse 13.1 in addition to the standard 700-verse edition. The importer explicitly excludes that optional verse and maps source 13.2–13.35 to standard 13.1–13.34.

The importer validates:

- exactly 18 chapters
- exactly 700 verses after normalization
- expected verse count per chapter
- no duplicate chapter/verse pairs
- no missing verse numbers
- non-empty Sanskrit text
- no translations imported

It writes the validated Sanskrit records to `data/sanskrit/verses.json` and to PostgreSQL.

## Recommended Windows setup

### 1. Check Node

Use Node 22.x (the project uses React Native 0.86 / Expo SDK 57).

```bat
node -v
npm -v
```

### 2. Install dependencies

From the project folder:

```bat
npm install
```

If you are starting from a fresh ZIP, `node_modules` is intentionally not included.

### 3. Start PostgreSQL

If Docker Desktop is installed:

```bat
docker compose up -d postgres
```

Then create `.env` from `.env.example`:

```bat
copy .env.example .env
```

The default local connection is:

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bhagavad_gita?schema=public"
```

### 4. Generate Prisma client

```bat
npm run db:generate
```

### 5. Run the Day 4 migration

```bat
npm run db:migrate
```

When Prisma asks for a migration name during development, use:

```text
init
```

For an existing database where the included migration is already present, use the appropriate Prisma migration workflow rather than recreating the database.

### 6. Seed structural data

```bat
npm run db:seed
```

Expected:

```text
Structural seed complete: 1 book, 18 chapters, 4 languages.
No Sanskrit verses or translations were inserted by this seed.
```

### 7. Validate the Sanskrit source before import

```bat
npm run db:validate-sanskrit
```

Expected:

```text
Sanskrit source validation passed: 18 chapters / 700 verses / no duplicates / no gaps.
```

This downloads the source at import/validation time, so an internet connection is required.

### 8. Import Sanskrit

```bat
npm run db:import-sanskrit
```

Expected:

```text
Sanskrit import completed successfully.
Validated: 18 chapters / 700 verses / no duplicates / no gaps.
No translations were imported.
```

This also creates:

```text
data/sanskrit/verses.json
```

The local Expo content repository can read that generated file without putting Prisma inside the mobile bundle.

### 9. Start the Android/Expo application

```bat
npx expo start --clear
```

Then:

- scan the QR code with Expo Go, or
- press `a` for an Android emulator/device configured for Expo development.

For a native Android development build:

```bat
npm run android
```

## Important

Do not run:

```bat
npm audit fix --force
```

as a first troubleshooting step. It can introduce breaking dependency upgrades into an Expo project.

Do not add translations yet.

Do not add AI-generated content.

Do not add commentary text.

Do not add audio.

Do not add additional languages.

## Day 5 source/licensing note

The Sanskrit source itself is an ancient text and is not being presented as a newly authored copyrighted translation. The selected repository distributes its dataset under the Unlicense. The importer records the source URL and license context in this project documentation.

Before a Google Play release, retain source attribution/license records and have the final content bundle reviewed for the exact dataset/version being shipped.

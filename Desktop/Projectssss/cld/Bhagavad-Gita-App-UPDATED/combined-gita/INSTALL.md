# Install & Run Guide

This is an Expo (React Native + Web) app. It runs today as a **web app / installable PWA**
with zero backend setup — the Sanskrit reader works entirely from local JSON files. A
Postgres + Prisma backend is only needed if you turn on the admin/content-management side.

## 0. What you actually need

| To do this...                          | You need...                                   |
|-----------------------------------------|-----------------------------------------------|
| Run the reader in a browser             | Node.js 22.x, npm                              |
| Run it on your phone via Expo Go        | The above + the Expo Go app                    |
| Build a real Android app (.apk/.aab)    | The above + Android Studio/SDK 36              |
| Use the admin panel to manage content   | The above + a PostgreSQL database              |
| Real "Sign in with Google"              | A Google Cloud OAuth client ID (free)          |

If you just want to see the app, you only need the first row.

## 1. Install dependencies

```bash
# macOS / Linux
cd combined-gita
npm install

# Windows (same, just use your normal terminal)
cd combined-gita
npm install
```

Do **not** use `--force` or `--legacy-peer-deps` — the dependency versions are already
pinned to match Expo SDK 57 exactly.

If this folder ever came from a broken/partial install, wipe and reinstall cleanly:

```bash
# macOS/Linux
rm -rf node_modules package-lock.json && npm install

# Windows (cmd)
rmdir /s /q node_modules
del package-lock.json
npm install
```

## 2. Configure environment variables (optional to start)

```bash
cp .env.example .env
```

You can leave `.env` at its defaults to just run the reader. Fill in
`EXPO_PUBLIC_GOOGLE_CLIENT_ID` later if you want real Google sign-in (see §6).

## 3. Run it

**In a browser (fastest way to check it out):**
```bash
npm run web
```
This opens the app at `http://localhost:8081` (Expo will print the exact URL).

**On your phone, without any native build:**
```bash
npm run start
```
Scan the QR code with the **Expo Go** app (iOS App Store / Google Play).

**Type-check & sanity-check before you rely on it:**
```bash
npm run typecheck
npx expo-doctor
```

## 4. What you'll see

- A home screen with a "Begin Reading" flow into 18 chapters / 700 verses of Sanskrit
  text with transliteration.
- Language switcher (Sanskrit / Kannada / Hindi / English) — translations start empty by
  design (see §7 below), so only Sanskrit renders until you import translations.
- Search, bookmarks, reading progress, and a browser-based read-aloud audio player —
  all working locally, no server required.
- Sign-in (email demo, or real Google OAuth once configured), settings, and an
  admin area gated by an admin email you set yourself.

## 5. Building a real Android app

```bash
npx expo prebuild --platform android
cd android
# macOS/Linux
./gradlew app:bundleRelease
# Windows
gradlew.bat app:bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

Before submitting to the Play Store: replace `app.json`'s `android.package` with your
own application ID, set up a real signing key, and complete the checklist in
`PRODUCTION-CHECKLIST.md`.

## 6. Turning on real Google Sign-In

1. Go to Google Cloud Console → **APIs & Services → Credentials → Create OAuth client ID**.
2. Choose **Web application** (this covers Expo web and Expo Go during development).
3. Run `npm run web` (or `npm run start`) once and note the redirect URI Expo prints —
   add it under **Authorized redirect URIs**. Add your production domain too, once you
   have one.
4. Put the client ID in `.env`:
   ```
   EXPO_PUBLIC_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   ```
5. Restart the dev server. The login screen now runs a real OAuth (Authorization Code +
   PKCE) flow instead of the local email-only demo. No client secret is ever stored in
   the app.

## 7. Adding translation content (English / Hindi / Kannada)

The Sanskrit (700 verses, all 18 chapters) is already included — it's an ancient public
domain text. The translation files are **intentionally empty**: any specific published
English/Hindi/Kannada translation is usually still under copyright, and this project
does not want to ship text it doesn't have the rights to.

To add your own (properly licensed, or original, or public-domain) translations:

```bash
node scripts/import-translations.mjs english path/to/your-translations.json
```

Your input file is a JSON array — see `data/translations/example-import.sample.json`
for the exact shape (chapter/verse number, `text`, `translator`, `source`, `license`,
and an optional `sourceUrl`/`notes`). The script:

- validates every record against the real chapter/verse list (no typos, no duplicates),
- requires `text`, `translator`, `source` and `license` to be filled in (no untraceable
  content),
- writes new content as `REVIEW_REQUIRED` — **not visible to readers yet**.

Once you've reviewed it, either edit the entry to `PUBLISHED` via the admin panel
(`/admin/translations`, once you're signed in as the admin email), or re-run the import
with `--publish` if you've already reviewed it out-of-band:

```bash
node scripts/import-translations.mjs english path/to/your-translations.json --publish
```

Good starting points for legitimately licensable/public-domain English translations
include pre-1929 editions (e.g. Kashinath Trimbak Telang's 1882 translation, in the
public domain in the US) or a translation you have explicit permission to use. Whichever
source you pick, keep the `source`/`license`/`translator` fields accurate — that
provenance is what shows up in the admin review screen and (per `PRODUCTION-CHECKLIST.md`)
is required before anything is published.

## 8. Turning on the admin/database side (optional)

Only needed for the Postgres-backed admin workflow (bulk content review at scale, audio
approval, user roles enforced server-side). The reader itself doesn't need this.

```bash
# Start a local Postgres however you like, e.g.:
docker compose -f docker-compose.yml up -d

# Point DATABASE_URL at it in .env, then:
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 9. Known limitations (honest list)

- Translation JSON files ship empty — see §7.
- Google Sign-In needs your own client ID — see §6. Without it, sign-in falls back to a
  clearly-labeled local email demo (fine for personal/dev use, not for a real user base).
- Text-to-speech uses the browser's built-in Web Speech API. Server-side TTS providers
  (Sarvam, Google Cloud, Azure, ElevenLabs) are wired as an abstraction in
  `lib/audio/service.ts` but need real API keys and a server endpoint to actually call
  them — do not put those keys in the Expo/React Native bundle.
- Admin role is currently just "does your signed-in email match `EXPO_PUBLIC_ADMIN_EMAIL`"
  — fine for solo/dev use, but must be enforced server-side (not just client-side) before
  any real deployment; see `SECURITY.md`.
- Android build (`.aab`) wasn't produced as part of this pass — building one needs
  Android Studio/SDK locally; the command in §5 is verified to be the correct one for
  this Expo SDK version, but wasn't executed end-to-end here.

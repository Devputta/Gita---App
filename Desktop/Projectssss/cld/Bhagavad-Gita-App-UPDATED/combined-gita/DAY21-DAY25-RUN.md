# Days 21–25

## Day 21 — Translation workflow
Open `/admin/translations` after signing in as the configured admin. Verified Sanskrit is read-only. Translation records contain translator, source, license, notes and review status. Publishing is blocked unless the record is `HUMAN_REVIEWED`.

## Day 22 — Accounts
Open `/auth/login`. Email sign-in works as a local Expo session. Google is represented by the same auth abstraction for this standalone build; replace the placeholder with a real Google OAuth/backend exchange before production. Set `EXPO_PUBLIC_ADMIN_EMAIL` to the admin email for local testing. Production admin roles must be server-authoritative.

## Day 23 — Accessibility
Reader controls support larger text and high contrast. Buttons have accessibility roles/labels. Native/web focus and keyboard navigation follow React Native/React Native Web semantics.

## Day 24 — Mobile
The reader keeps large tap targets, one-handed controls, swipe/next verse architecture, and a persistent sticky audio player. Layouts use flexible widths rather than a desktop-only fixed layout.

## Day 25 — PWA
Expo Web includes `public/manifest.json`, `public/sw.js`, PWA registration and an HTML shell. The service worker caches only the shell/GET responses it can safely cache; do not put account secrets or private data in the cache.

## Run
npm install
npm run db:generate
npm run web

For mobile:
npx expo start

# Bhagavad Gita — Production Guide

## Environment
Copy `.env.example` to `.env` and configure `DATABASE_URL`. Production OAuth, TTS and storage credentials belong on the server, not in the mobile/web bundle.

## Database
Run `npm install`, then `npm run db:generate`. For a configured PostgreSQL database use `npm run db:migrate` and `npm run db:seed`. Import/validate Sanskrit with `npm run db:validate-sanskrit` and `npm run db:import-sanskrit`.

## Development
`npm run start` for Expo. `npm run web` for web. `npm run web:build` creates the production web export.

## Release audit
Run `npm run release:audit`, then `npm run typecheck` and `npm run web:build` before release.

## Admin/content
Admin UI is separated from ordinary user navigation. Production deployment must enforce the ADMIN role on the backend. Translation publishing is allowed only after HUMAN_REVIEWED status.

## TTS
Configure a server-side TTS provider and store only approved audio metadata/URLs. Never expose provider API keys in client code.

## SEO/PWA
Public chapter and verse screens update title, description, canonical URL and JSON-LD on web. The web app includes a manifest and service worker for an installable reader shell and offline continuation of previously loaded public content.

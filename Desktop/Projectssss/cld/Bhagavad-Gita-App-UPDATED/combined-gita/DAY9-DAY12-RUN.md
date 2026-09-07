# Bhagavad Gita — Day 9–12

## Day 9 — English translation

The reader now supports the four-language model: Sanskrit, Kannada, Hindi, English. English is read from the same Translation repository as Kannada and Hindi, and only `PUBLISHED` translation records are displayed.

No copyrighted web translation is bundled. `data/translations/english.json` is intentionally empty until licensed or original reviewed content is supplied.

## Day 10 — Multilingual reader

Two modes are available on every verse:

1. **Single Language** — Sanskrit plus the selected Kannada/Hindi/English translation.
2. **Parallel** — Sanskrit, Kannada, Hindi, and English together. The layout stacks cleanly on mobile and uses the same responsive React Native flow on desktop/web.

The selected language and reader mode persist using AsyncStorage.

## Day 11 — Audio architecture

`lib/audio/service.ts` defines provider-independent audio request, generation, and playback contracts. Supported provider targets:

- Sarvam AI
- Google Cloud Text-to-Speech
- Azure Speech
- ElevenLabs
- Browser Web Speech API
- Expo/native playback can be added behind the same interface

The current reader uses Browser Web Speech on web as a safe playback fallback. Playback exposes Play, Pause, Resume, Replay, Stop, and 0.75x/1x/1.25x/1.5x speed controls.

No API keys are stored in the frontend.

## Day 12 — Text-to-speech generation

`app/admin/audio.tsx` provides an explicit administrator approval step and provider selection. The generation service is server-side by design. A production provider must:

1. retrieve the verified verse/translation text;
2. select language and voice;
3. generate audio;
4. store the file in approved storage;
5. save provider/voice/language/speed metadata;
6. link the audio record to the verse;
7. permit administrator-approved regeneration.

Generation is never automatic.

## Database migration

After creating `.env` and starting PostgreSQL:

```bat
npm run db:generate
npx prisma migrate deploy
```

For a development database where migrations are managed interactively, `npx prisma migrate dev` may be used.

## Validation

```bat
npm run typecheck
npx expo-doctor
npm run web
```

If Expo reports packages that can be updated, do not blindly upgrade them. Keep the Expo SDK 57-compatible dependency set until the app is intentionally upgraded as a separate task.

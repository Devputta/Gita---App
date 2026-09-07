# Day 29 — Release Test Plan

Automated dataset audit is provided by `npm run release:audit` and verifies 18 chapters / 700 Sanskrit verses, missing Sanskrit and duplicate verse keys.

Before production, execute the following matrix in Chrome/Edge/Safari and Android/iOS:

- Home, chapter list, every chapter, every verse and public alias URLs
- Sanskrit plus Kannada/Hindi/English where licensed/published
- Single and Parallel reader modes
- Language switching and reader preferences
- Verse audio, previous/next and chapter queue playback
- Bookmarks, reading progress and search
- Verse of the Day and share actions
- Login/profile and denial of `/admin` for ordinary users
- Admin translation/audio workflows and publish gates
- Keyboard-only navigation, focus visibility, screen readers and high contrast
- Responsive layouts, dark/system theme and mobile touch targets
- PWA installation and offline shell
- Browser console/network errors

Do not mark the release green until all critical failures are fixed. This project cannot truthfully claim a full browser/device matrix was executed inside the source-generation environment.

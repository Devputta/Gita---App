# Security & production notes

- Keep `DATABASE_URL`, OAuth client secrets, TTS keys and admin secrets on the server only. Never put them in `EXPO_PUBLIC_*` variables.
- The client must never decide that a user is an admin. Production authorization must be enforced by a trusted backend/session claims.
- Validate chapter/verse numbers and all admin content on the server before persistence.
- Use Prisma parameterized queries; do not concatenate SQL from request input.
- Escape/sanitize user-authored rich text before rendering as HTML. React Native `<Text>` does not execute HTML.
- Add CSRF protection for cookie-authenticated state-changing web endpoints.
- Add rate limits to login, admin writes, search and TTS-generation endpoints.
- Use secure, HttpOnly, SameSite cookies for web sessions when cookie auth is adopted.
- Do not log credentials, access tokens, database URLs or private storage URLs.
- Use pagination for admin lists and search results.

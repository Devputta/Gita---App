# Production deployment checklist

## Content
- [ ] 18 chapters and exactly 700 verified Sanskrit verses
- [ ] No fake/placeholder scripture, translation or audio URLs
- [ ] Every published translation has source, license and review status
- [ ] Traditional commentary is separately sourced and licensed

## Security
- [ ] Real server-side authentication and role authorization
- [ ] Google OAuth redirect URIs locked to production domains
- [ ] Secrets stored in server/hosting secret manager
- [ ] Rate limiting enabled
- [ ] CSRF protection enabled where cookie sessions are used
- [ ] Input validation and output escaping verified
- [ ] Database backups and least-privilege database user configured

## Performance
- [ ] Web build tested on mobile and desktop
- [ ] Audio generated/loaded lazily
- [ ] Search and admin lists paginated
- [ ] Database indexes verified
- [ ] CDN/cache strategy configured

## Release
- [ ] `npm run release:audit`
- [ ] `npm run typecheck`
- [ ] `npm run web:build`
- [ ] Test all 18 chapters and representative verses
- [ ] Test Sanskrit/Kannada/Hindi/English switching
- [ ] Test bookmarks, progress, search, audio and sharing
- [ ] Test dark mode, accessibility and keyboard navigation
- [ ] Verify canonical URLs, OpenGraph and structured data
- [ ] Verify PWA install/offline reader shell

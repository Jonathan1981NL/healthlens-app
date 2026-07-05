# HealthLens Stage 1I — Refresh-safe build

This build is designed to fix stale mobile browser / PWA cache issues.

## Use this URL after deployment

`https://jonathan1981nl.github.io/healthlens-app/stage1i.html?v=force-1i`

## Why this should refresh correctly

- unique CSS filename: `styles-1i-20260705.css`
- unique JS filename: `app-1i-20260705.js`
- separate entry page: `stage1i.html`
- `service-worker.js` unregisters itself and clears old caches
- visible version badge: `1I-refresh-safe-20260705`

## Commit message

`Stage 1I refresh-safe atlas upgrade`

# Obidient Benue — Community & Public Information Website

A Next.js 16 / React 19 / TypeScript / Tailwind CSS 4 site inspired by the folder architecture of `Octalve/IAMimpact-Foundation`, without copying foundation-specific databases or misleading preview data.

## Public site
Home, About, The Candidates, Policy Priorities, Registration, Privacy, Contact. News and Events exist but stay hidden and return 404 until their flags are enabled.

## Local development

1. Install Node.js >=22.13 and pnpm 10.
2. `pnpm install`
3. `pnpm data:import` (downloads a pinned August 2026 transcription of the INEC public polling-unit directory; validates exactly 23 LGAs, 276 wards, and 5,102 PUs before writing the static Benue file).
4. `pnpm dev`
5. `pnpm check` (lint, strict TS, source tests, build).

Source provenance: `https://cvr.inecnigeria.org/pu`, transcribed at GitHub `saidiadegoke/nigeria-inec-geo` commit `3cf617721aea519eef960681d3d86a4fad4325da`. The transcription is *not* a direct INEC downloadable CSV. Verify the snapshot against current INEC notices before public use; do not portray it as a live official feed.

## Registration launch gate (default: CLOSED)

- Create a dedicated, access-restricted Postgres database (e.g. Neon). Apply `scripts/schema.sql`. Backups and encryption-at-rest must be enabled.
- Add `DATABASE_URL`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, and `PRIVACY_CONTACT_EMAIL` to Vercel Production environment, never GitHub.
- Approve privacy contact, retention period and access policy for political-affiliation data. Implement a private, audited admin review interface before granting campaign operators access to stored submissions.
- Add platform-level (Vercel WAF) rate limits to `/api/registrations` and monitor abuse. The Turnstile server verification alone is not a rate limit.
- Import full Benue directory and confirm count/source and representative PU-code matches with current INEC official portal.
- Perform real end-to-end tests in a non-public environment: valid self/assisted, mis-matched LGA/ward/PU refusal, invalid captcha, missing consent, missing DB, mobile, keyboard, multiple submissions.
- Only after certification set `REGISTRATION_OPEN=true`. The site fails closed otherwise.

## Publication and sources
Candidate records are attributed to published election reporting. The themes under Policy Priorities are **not** invented candidate manifesto promises. Approved written Benue manifesto content can be added to `content/site.ts` and linked with its original source.

## Vercel deployment discipline
Do **not** connect the repo to Vercel until local `pnpm check` passes and a production acceptance report is signed. In Vercel Project > Settings > Git, disable Git-connected Preview deployments for non-main branches. When ready, deploy Production from `main` only; inspect live health, error logs and forms after each release. Do not add a Preview GitHub Action workflow. No Vercel integration/deployment has been made.

## Design system
CSS design tokens in `app/globals.css`. Prefer Tailwind utilities and small feature-level TSX components, not long global CSS files. No development jargon in public-facing UI. Campaign artwork in `public/images` supplied by the project requester; confirm publication rights and preferred replacement portrait/logo before final launch.

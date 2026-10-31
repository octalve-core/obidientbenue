# Architectural mapping from IAMimpact-Foundation

| Reference | New project |
|---|---|
| `app/` App Router | `app/` public routes and public API |
| `components/layout` | Shared Header/Footer |
| `components/ui` | Wordmark and PageIntro |
| `features/home` | Hero, Overview, Candidates, Registration CTA |
| `features/forms` | `features/registration` with dependent dropdowns |
| `content/site.ts` | All public navigation, titles, public sources and policy themes |
| `lib/validation` | `lib/registration.ts` + `lib/electoral.ts` |
| `tests` | CSV parser and integrity security tests |
| `prisma/` | Deferred: registration tables managed via an explicit SQL migration while database integration is prepared |

No foundation branding, event payments, QR attendance, fake achievements, placeholder submissions, or admin access is inherited. Admin and other future modules stay unlinked until tested.

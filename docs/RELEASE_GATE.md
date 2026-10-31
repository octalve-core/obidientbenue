# Launch evidence checklist — Obidient Benue

Status: **NOT CERTIFIED / NOT DEPLOYED**

## Required evidence
- [ ] Domain ownership `obidientbenue.com` and DNS verified; do not assume available.
- [ ] Campaign / NDC logo rights and real candidate imagery approved.
- [ ] Written candidate manifesto and profile facts signed off by content owner.
- [ ] Full INEC Benue geographic directory imported and independently spot-checked against official portal.
- [ ] Privacy notice completed with administrator, retention, deletion mechanism and contact.
- [ ] Dedicated encrypted database configured, migration applied and recovery tested.
- [ ] Strict server-side registration validation + bot protection and WAF rate limits.
- [ ] Independent review of political-affiliation data minimisation and access control.
- [ ] 320, 360, 390, 430, 768, 1024, 1440 widths verified in Chrome mobile/desktop.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass.
- [ ] Signoff for public release; only then enable Production deployment from main.

Avoid collecting people’s party-affiliation data until privacy and storage controls are certified. No fake registration success.

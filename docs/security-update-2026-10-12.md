# APG dependency security update — October 12, 2026

## Changes

- Next.js and eslint-config-next: 16.3.5 → 16.3.8, staying on the same minor release line.
- Locked Sharp: 0.35.4 → 0.35.5.
- Locked source-map-js: 1.2.1 → 1.2.2.
- Regenerated package-lock.json through npm; no forced audit downgrade or major framework upgrade.
- No application behavior, database schema, credentials, design or listing content changes.

Next.js advisories addressed include image generation, image optimization, metadata routes and cache behavior. References:

- https://github.com/advisories/GHSA-vcvr-r3jv-pc5j
- https://github.com/advisories/GHSA-cjq9-62q9-8jv4
- https://github.com/advisories/GHSA-f87g-xv8r-7p7x
- https://github.com/advisories/GHSA-3w37-wq28-93x7
- https://github.com/advisories/GHSA-4jqv-mc3x-m676
- https://github.com/advisories/GHSA-mcj8-r9mp-w47p
- https://github.com/advisories/GHSA-39w2-rjm5-chcv
- https://github.com/advisories/GHSA-wq5f-xc86-pv6w
- https://github.com/advisories/GHSA-68fv-2mgg-jv7q

Version-level audit findings do not establish that APG is exploitable or that a compromise occurred.

## Validation completed

- `npm run build`: PASS using Next.js 16.3.8's default Turbopack builder, including TypeScript and route generation.
- `npm audit --omit=dev`: 0 known vulnerabilities.
- Full `npm audit`: 5 high package-level findings in one development-only chain: eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces 3.0.3. The underlying advisory is GHSA-vfj7-8cjw-p6xm. No patched braces version was available from npm at the time of the check. npm's suggested downgrade to eslint-config-next 14.2.35 was not applied.
- Sharp's native PNG resize/encoding: PASS.
- Local production server HTTP checks: login, password reset, marketplace and learning links pages returned 200; an actual published listing detail returned 200.
- Signed-out admin, sell, messages and notifications routes redirected to login (307).
- Signed-out message creation, notification subscription and listing update API requests returned 401; no data writes or notifications were sent.
- Training provider content and the corrected Nassau CDL link were retained from current main.
- `git diff --check`: PASS.

## Release limitations and remaining checks

The browser executable could not be downloaded in this environment (invalid/truncated download). No authenticated test account/session was available. HTTP rendering and access checks do not replace full browser interaction testing.

Before merging and publishing, complete sign-in/sign-out, password-reset email/link flow, listing creation/editing and photo upload, test-account messaging, notification delivery and admin behavior as a regular signed-in user. Check the mobile UI and provider-filter interactions in a browser. Run these on a preview or dedicated test environment; do not message real members as test recipients.

The connected Vercel tooling previously denied access to the APG team. This change is prepared on a security branch as a draft PR; production publication has not been verified. After release, confirm the deployed commit and repeat read-only smoke checks on the live site.

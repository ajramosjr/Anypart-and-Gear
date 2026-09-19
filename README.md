# Anypart & Gear

**Buy and sell what keeps you moving.**

Anypart & Gear is a responsive marketplace for parts, tools, vehicles, machinery, workwear and gear. Buyers contact sellers directly; the platform does not process payments, arrange shipping, guarantee fitment or handle returns.

## Included

- Responsive marketplace homepage with search and category filters
- Cars, boats, motorcycles, trucks, tools, machinery, apparel and vehicles
- Supabase email/password authentication and protected seller pages
- Cloudflare Turnstile bot protection for sign-in, signup and password reset
- Single-item listings with up to six photos
- Business CSV upload for up to 500 listings
- Listing detail pages, trades, saved favorites and safety guidance
- Private buyer/seller conversations and messages
- Seller dashboard for active/sold/removed listings
- PostgreSQL schema, indexes, triggers, Storage bucket and row-level security policies
- Sample listings when Supabase is not configured

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL, publishable key and Turnstile site key.
3. Run `npm install` and `npm run dev`.
4. Open `http://localhost:3000`.

## Supabase setup

1. Open the Supabase SQL editor.
2. Run `supabase/schema.sql`.
3. In Authentication URL Configuration, set the production Site URL.
4. Add `https://YOUR-DOMAIN/auth/callback` as an allowed redirect URL.
5. In Authentication Attack Protection, enable Cloudflare Turnstile and add its secret key.
6. Keep the service-role and Turnstile secret keys private; the website only needs public keys.

## Vercel environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `NEXT_PUBLIC_SITE_URL` (the production URL)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (the public Cloudflare Turnstile site key)
- `GOOGLE_SITE_VERIFICATION` (the HTML-tag token from Google Search Console)

The repository uses Next.js App Router and deploys normally through Vercel's GitHub integration. Vercel Web Analytics and Speed Insights are included in the root layout.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

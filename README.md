# Anypart & Gear

**Buy and sell what keeps you moving.**

Anypart & Gear is a responsive marketplace for parts, tools, vehicles, machinery, workwear and gear. Buyers contact sellers directly; the platform does not process payments, arrange shipping, guarantee fitment or handle returns.

## Included

- Responsive marketplace homepage with search and category filters
- Cars, boats, motorcycles, trucks, tools, machinery, apparel and vehicles
- Supabase email/password authentication and protected seller pages
- Single-item listings with up to six photos
- Business CSV upload for up to 500 listings
- Listing detail pages, trades, saved favorites and safety guidance
- Private buyer/seller conversations and messages
- Seller dashboard for active/sold/removed listings
- PostgreSQL schema, indexes, triggers, Storage bucket and row-level security policies
- Sample listings when Supabase is not configured

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and anon key.
3. Run `npm install` and `npm run dev`.
4. Open `http://localhost:3000`.

## Supabase setup

1. Open the Supabase SQL editor.
2. Run `supabase/schema.sql`.
3. In Authentication URL Configuration, set the production Site URL.
4. Add `https://YOUR-DOMAIN/auth/callback` as an allowed redirect URL.
5. Keep the service-role key private; the website only needs the anon key.

## Vercel environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (the production URL)
- `GOOGLE_SITE_VERIFICATION` (the HTML-tag token from Google Search Console)

The repository uses Next.js App Router and deploys normally through Vercel's GitHub integration. Vercel Web Analytics and Speed Insights are included in the root layout.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

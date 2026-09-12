# Any Part & Gear — GitHub + Vercel + Supabase

This is the Vercel-ready version of the marketplace. Supabase handles email sign-in, listings, private messages, reports and listing photos.

## 1. Upload to GitHub

1. Extract the ZIP.
2. Open the extracted **any-part-and-gear-vercel** folder.
3. Upload everything inside it to an empty GitHub repository.
4. Keep the folders intact. GitHub should show **app**, **components**, **lib**, **public** and **supabase**.

The easiest method is GitHub Desktop on a computer: select **File → Add local repository**, choose the extracted folder, then select **Publish repository**.

## 2. Set up Supabase

1. Create a free project at https://supabase.com.
2. Open **SQL Editor → New query**.
3. Open `supabase/schema.sql` from this project, copy all of it, paste it into Supabase and select **Run**.
4. Open **Project Settings → API** and copy the **Project URL** and **anon public key**.
5. Never use or publish the service-role key.

## 3. Deploy through Vercel

1. Go to https://vercel.com/new and select **Import Git Repository**.
2. Choose this GitHub repository. Vercel will detect Next.js.
3. Add two Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon public key
4. Select **Deploy**.
5. Copy the Vercel address after deployment.
6. In Supabase, open **Authentication → URL Configuration**.
7. Set **Site URL** to your Vercel address.
8. Add `https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback` under Redirect URLs.

## Run on a computer

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Important

- Do not commit `.env.local`.
- This creates a new Supabase database. Existing data from the original hosted site is not copied automatically.
- Sample listings remain visible at launch.
- Sellers cannot verify themselves. Verified Business status is controlled in Supabase.

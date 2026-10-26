# Homepage feed and rollback

The previous complete website source is preserved at Git branch
`backup/before-home-feed-2026-10-26`, commit `612d2e33abee3f9a3098401061dce6c52057cca7`.

## Restore the classic homepage without a deployment

Sign in as an APG administrator, open `/admin/feed`, and select **Restore classic
homepage**. Select **Use the new homepage feed** to switch back. The setting is
stored in `public.apg_home_settings`. It changes presentation only; listings,
accounts, posts, and replies are retained. `/classic` always opens the previous
homepage. If the layout setting cannot be loaded, the homepage falls back to the
classic layout.

The legacy external forum is not enabled. `/community` redirects to the homepage.
The floating assistant is removed; Tools & Work Gear is retained.

## Restore the entire previous website

Use the backup branch's source to prepare a normal restoration commit/deployment.
Do not drop the new feed tables: they contain any posts made after launch and can
be retained when restoring older code. Existing account, listing, directory,
message, and other tables were not changed by the feed migration.

## Validation

- `npm run typecheck` and `npm run build`
- `node scripts/check-home-feed.mjs` (read-only integration check against APG)
- `supabase/tests/home_feed_permissions.sql` (transactional RLS tests; writes
  are rolled back)
- Anonymous `/api/feed` reads; sign-in required for mutations.

Feed posts/replies and reactions use RLS and per-user ownership. Saves and reports
are private. Moderation and layout switching require trusted `app_metadata.role`.
Uploads reuse the account-scoped `part-images` bucket. No service-role key is
included in browser code. Sample preview content is not published.

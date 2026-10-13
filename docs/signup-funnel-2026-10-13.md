# Admin signup and activity counts

Tracks monthly deduplicated browser steps and broad first-session traffic sources, starting October 13. Existing visitor totals remain intact. The admin panel separately aggregates actual new non-admin accounts, confirmation, sign-in, listing and message milestones. These are not joined into a conversion rate, and bot filtering is approximate.

Events contain a random browser ID, month, whitelisted event/source and timestamp. No IP, raw referrer, email, credential or message-content fields. First-party cookie lasts one year; source category uses sessionStorage. Tracking errors never block signup. Raw reads are denied to anon and authenticated; aggregate access checks the caller's actual admin app metadata in auth.users. Public write RPC is invoker with constrained grants and RLS. These anonymous estimates can still be spoofed.

Validation: production build and TypeScript pass; traffic-source classification checks pass. Database transaction tests validate anonymous insert, deduplication, admin aggregates, anonymous raw-read denial, regular-user aggregate denial and invalid-event rejection. Test rows rolled back. Database advisor found no new schema security warning; an existing leaked-password-protection warning remains separate from this feature.

Signup review: client signup passes the requested destination into its confirmation callback, callback validates the return path, and password sign-in returns to that destination. Full signup email delivery with a fresh account has not been tested; real user email confirmation and first-login totals will expose follow-through, while browser errors expose attempts. No test signup or real-user message was created.

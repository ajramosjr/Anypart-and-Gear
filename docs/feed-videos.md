# Feed videos

One MP4, WebM or MOV clip per community post, up to 60 seconds and 50 MiB. Client checks duration and size. API validates declared duration, ownership and stored object metadata; it does not transcode or inspect binary video duration. The browser must support the video's codec. Photos and text remain after expiry.

Feed clips use the separate public feed-videos bucket. Never apply this retention rule to listing-videos. Cache-Control is 0 on uploads. Public viewers may retain downloaded copies.

expire-feed-videos runs every minute and calls cleanup-feed-videos using a random Vault token. The Edge Function authenticates via service-role-only authorize_feed_cleanup, removes storage objects older than 12 hours through the Storage API, then clears expired post references. A failed run is retried next minute. The feed also hides expired clips. Delete files with the Storage API, never with SQL metadata deletion.

Verification: production build, composer simulated checks for >60 seconds and >50 MiB, upload payload and preview/removal; cleanup integration test with one aged test object and one fresh object confirmed only the aged object was deleted. Test objects were removed and test-only handler removed. Existing listing video unchanged. No real public test post was created. Signed-in publishing and real video playback remain a manual acceptance check.

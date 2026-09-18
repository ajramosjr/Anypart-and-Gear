import { createECDH, createHash } from "node:crypto";
import webpush, { PushSubscription } from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";

export function getVapidKeys() {
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return null;
  const privateKey = createHash("sha256").update("apg-web-push-v1").update(secret).digest();
  const ecdh = createECDH("prime256v1");
  ecdh.setPrivateKey(privateKey);
  return {
    privateKey: privateKey.toString("base64url"),
    publicKey: ecdh.getPublicKey(undefined, "uncompressed").toString("base64url"),
  };
}

export async function sendPushNotifications(
  admin: SupabaseClient,
  userId: string,
  payload: { title: string; body: string; url?: string; tag?: string },
) {
  const keys = getVapidKeys();
  if (!keys) return 0;
  const { data: subscriptions } = await admin
    .from("push_subscriptions")
    .select("id,endpoint,p256dh,auth")
    .eq("user_id", userId);
  if (!subscriptions?.length) return 0;

  const results = await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(
        { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } } as PushSubscription,
        JSON.stringify(payload),
        {
          vapidDetails: {
            subject: "mailto:notifications@any-partandgear.com",
            publicKey: keys.publicKey,
            privateKey: keys.privateKey,
          },
          TTL: 60 * 60,
          urgency: "high",
        },
      );
      return true;
    } catch (error) {
      const statusCode = (error as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await admin.from("push_subscriptions").delete().eq("id", subscription.id);
      } else {
        console.error("[push] delivery failed", { statusCode, subscriptionId: subscription.id });
      }
      return false;
    }
  }));
  return results.filter(Boolean).length;
}

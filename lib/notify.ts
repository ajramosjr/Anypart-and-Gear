export type NotificationKind = "message" | "transaction" | "review";

export async function requestEmailNotification(kind: NotificationKind, entityId: string) {
  try {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, entityId }),
    });
  } catch {
    // The marketplace action already succeeded. In-app, push and email delivery are best-effort.
  }
}

export type NotificationKind = "message" | "transaction" | "review";

export async function requestEmailNotification(kind: NotificationKind, entityId: string) {
  try {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, entityId }),
    });
  } catch {
    // The marketplace action has already succeeded. Email is best-effort.
  }
}

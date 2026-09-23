"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NotificationBell({ userId }: { userId: string }) {
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("read_at", null);
    setUnread(count || 0);
  }, [userId]);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh(), 0);
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => void refresh(),
      )
      .subscribe();
    return () => { window.clearTimeout(initialRefresh); void supabase.removeChannel(channel); };
  }, [refresh, userId]);

  return (
    <Link
      href="/notifications"
      className="relative inline-flex size-11 items-center justify-center rounded-lg text-slate-900 hover:bg-slate-100"
      aria-label={unread ? `${unread} unread notifications` : "Notifications"}
    >
      <Bell className="size-5" />
      {unread > 0 && (
        <span className="absolute right-0.5 top-0.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-black leading-none text-white">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}

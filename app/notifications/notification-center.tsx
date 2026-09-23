"use client";

import Link from "next/link";
import { Bell, CheckCheck, MessageCircle, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type NotificationItem = {
  id: string;
  notification_type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

function Icon({ type }: { type: string }) {
  if (type === "message" || type === "offer") return <MessageCircle />;
  if (type === "review") return <Star />;
  return <Bell />;
}

export default function NotificationCenter({ initial, userId }: { initial: NotificationItem[]; userId: string }) {
  const [items, setItems] = useState(initial);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const channel = supabase
      .channel(`notification-center:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => setItems((current) => [payload.new as NotificationItem, ...current.filter((item) => item.id !== payload.new.id)]),
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [supabase, userId]);

  async function markRead(id: string) {
    const readAt = new Date().toISOString();
    const { error } = await supabase.from("notifications").update({ read_at: readAt }).eq("id", id).eq("user_id", userId);
    if (!error) setItems((current) => current.map((item) => item.id === id ? { ...item, read_at: readAt } : item));
  }

  async function markAllRead() {
    const readAt = new Date().toISOString();
    const { error } = await supabase.from("notifications").update({ read_at: readAt }).eq("user_id", userId).is("read_at", null);
    if (!error) setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at || readAt })));
  }

  async function remove(id: string) {
    const { error } = await supabase.from("notifications").delete().eq("id", id).eq("user_id", userId);
    if (!error) setItems((current) => current.filter((item) => item.id !== id));
  }

  if (!items.length) return <div className="empty-state"><Bell className="mx-auto size-9 text-slate-400"/><h3>No notifications yet</h3><p>New marketplace activity will appear here.</p></div>;

  return (
    <section className="notification-center">
      {items.some((item) => !item.read_at) && <button className="button button-ghost-dark notification-mark-all" onClick={markAllRead}><CheckCheck size={17}/> Mark all read</button>}
      <div className="notification-list">
        {items.map((item) => (
          <article className={`notification-item${item.read_at ? "" : " unread"}`} key={item.id}>
            <span className="notification-icon"><Icon type={item.notification_type}/></span>
            <div className="notification-copy">
              {item.link ? <Link href={item.link} onClick={() => void markRead(item.id)}><strong>{item.title}</strong></Link> : <strong>{item.title}</strong>}
              {item.body && <p>{item.body}</p>}
              <time>{new Date(item.created_at).toLocaleString()}</time>
            </div>
            <div className="notification-actions">
              {!item.read_at && <button onClick={() => void markRead(item.id)} aria-label="Mark notification read"><CheckCheck/></button>}
              <button onClick={() => void remove(item.id)} aria-label="Delete notification"><Trash2/></button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

// Some email links fall back to the site URL with recovery tokens in the hash.
// Preserve that hash for Supabase to consume on the password form.
export default function PasswordRecoveryRedirect() {
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.get("type") === "recovery" && window.location.pathname !== "/reset-password") {
      window.location.replace(`/reset-password${window.location.hash}`);
      return;
    }
    if (!hasSupabaseConfig()) return;
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" && window.location.pathname !== "/reset-password") {
        window.location.replace("/reset-password");
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return null;
}

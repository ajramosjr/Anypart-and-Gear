const projectUrl = "https://emhdntbmihwvqpncyicl.supabase.co";
const projectPublishableKey = "sb_publishable_icBGuuTPWvovcXzE65CyDg_nwAUR22K";
const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const configuredKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Keep the URL and key paired. A stale Vercel environment variable from a
// different Supabase project otherwise makes browser auth fail at runtime.
const hasMatchingEnvironment = configuredUrl === projectUrl && Boolean(configuredKey);

export const supabaseUrl = hasMatchingEnvironment ? configuredUrl : projectUrl;
export const supabasePublishableKey = hasMatchingEnvironment
  ? configuredKey!
  : projectPublishableKey;

export function hasSupabaseConfig() {
  return Boolean(
    supabaseUrl &&
      supabasePublishableKey &&
      !supabaseUrl.includes("YOUR_PROJECT")
  );
}

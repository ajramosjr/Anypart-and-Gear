import ClassicHome from "./classic/page";
import HomeFeed from "@/components/feed/home-feed";
import { createClient } from "@/lib/supabase/server";
import { readFeed } from "@/lib/feed";
import type { FeedMember, FeedPage } from "@/lib/feed-types";
import { LegacyMarketplaceHashRedirect } from "./marketplace/legacy-hash-redirect";
import "./home-feed.css";
export const dynamic = "force-dynamic";
export default async function Home({searchParams}:{searchParams:Promise<{layout?:string}>}){
 const {layout}=await searchParams;
 const db=await createClient();
 const {data:settings,error:settingsError}=await db.from("apg_home_settings").select("layout").eq("id","home").maybeSingle();
 if(layout!=="feed"&&(settingsError||settings?.layout!=="feed"))return <ClassicHome/>;
 const {data:{user}}=await db.auth.getUser();
 let member:FeedMember=null;
 if(user){const {data:profile}=await db.from('profiles').select('full_name').eq('id',user.id).maybeSingle();member={id:user.id,name:profile?.full_name?.trim()||(typeof user.user_metadata?.full_name==='string'?user.user_metadata.full_name.trim():'')||'APG member',isAdmin:user.app_metadata?.role==='admin'};}
 let initial:FeedPage={items:[],hasMore:false};let initialError=false;
 try{initial=await readFeed(db,user?.id);}catch(error){initialError=true;console.error('Homepage feed unavailable',error instanceof Error?error.message:'Database error');}
 return <><LegacyMarketplaceHashRedirect/><HomeFeed initial={initial} member={member} initialError={initialError}/></>;
}

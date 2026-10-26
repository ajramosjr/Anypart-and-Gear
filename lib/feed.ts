import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/supabase/config";
import type { FeedItem, FeedPage } from "./feed-types";
export const feedImage = (value: unknown): value is string => typeof value === "string" && value.startsWith(`${supabaseUrl}/storage/v1/object/public/`);
export async function readFeed(db: SupabaseClient, userId?: string, before?: string, savedOnly = false, category?: string, search?: string): Promise<FeedPage> {
  let listingQuery = db.from("listings").select("id,user_id,seller_name,title,description,price,condition,category,location,image_url,image_urls,created_at").eq("status","active").order("created_at",{ascending:false}).limit(20);
  let postQuery = db.from("apg_feed_posts").select("id,user_id,title,body,category,image_urls,created_at,profiles(full_name,avatar_url)").eq("status","active").order("created_at",{ascending:false}).limit(20);
  if(category==='For sale')postQuery=postQuery.limit(0);
  else if(category&&['Projects','Questions','Updates'].includes(category)){listingQuery=listingQuery.limit(0);postQuery=postQuery.eq('category',category);}
  if(search){listingQuery=listingQuery.ilike('title',`%${search}%`);postQuery=postQuery.ilike('title',`%${search}%`);}
  if(before){listingQuery=listingQuery.lt("created_at",before);postQuery=postQuery.lt("created_at",before);}
  if(savedOnly){
    if(!userId)return {items:[],hasMore:false};
    const {data:saves,error}=await db.from("apg_feed_engagement").select("item_id,item_type").eq("user_id",userId).eq("action","save").order("created_at",{ascending:false}).limit(1000);
    if(error)throw error;
    listingQuery=listingQuery.in("id",(saves||[]).filter(x=>x.item_type==='listing').map(x=>x.item_id));
    postQuery=postQuery.in("id",(saves||[]).filter(x=>x.item_type==='post').map(x=>x.item_id));
  }
  const [listings,posts]=await Promise.all([listingQuery,postQuery]);
  if(listings.error)throw listings.error;if(posts.error)throw posts.error;
  const items: FeedItem[] = [
    ...(listings.data||[]).map(l=>({id:l.id,kind:"listing" as const,userId:l.user_id,author:l.seller_name||"APG member",avatar:null,title:l.title,body:l.description||"",category:"For sale" as const,images:(l.image_urls?.length?l.image_urls:[l.image_url]).filter(feedImage),createdAt:l.created_at,price:Number(l.price),location:l.location,condition:l.condition,listingCategory:l.category,likes:0,replies:0,liked:false,saved:false})),
    ...(posts.data||[]).map(p=>{const profile=(Array.isArray(p.profiles)?p.profiles[0]:p.profiles) as {full_name?:string;avatar_url?:string}|null;return {id:p.id,kind:"post" as const,userId:p.user_id,author:profile?.full_name||"APG member",avatar:feedImage(profile?.avatar_url)?profile!.avatar_url!:null,title:p.title,body:p.body,category:p.category,images:(p.image_urls||[]).filter(feedImage),createdAt:p.created_at,likes:0,replies:0,liked:false,saved:false};})
  ].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  const page=items.slice(0,20);if(!page.length)return {items:[],hasMore:false};
  const ids=page.map(i=>i.id);
  const [reactions,comments]=await Promise.all([
    db.from("apg_feed_engagement").select("item_id,item_type,action,user_id").in("item_id",ids).limit(10000),
    db.from("apg_feed_comments").select("item_id,item_type").in("item_id",ids).eq("status","active").limit(10000)
  ]);
  if(reactions.error)throw reactions.error;if(comments.error)throw comments.error;
  for(const item of page){const rows=(reactions.data||[]).filter(r=>r.item_id===item.id&&r.item_type===item.kind);item.likes=rows.filter(r=>r.action==='like').length;item.liked=rows.some(r=>r.action==='like'&&r.user_id===userId);item.saved=rows.some(r=>r.action==='save'&&r.user_id===userId);item.replies=(comments.data||[]).filter(r=>r.item_id===item.id&&r.item_type===item.kind).length;}
  return {items:page,hasMore:items.length>20||listings.data!.length===20||posts.data!.length===20};
}

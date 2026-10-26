import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseUrl } from "@/lib/supabase/config";
import { readFeed } from "@/lib/feed";
import { revalidatePath } from "next/cache";
import { z } from "zod";
export const dynamic = "force-dynamic";
const target = {itemType:z.enum(["listing","post"]),itemId:z.string().uuid()};
const schema=z.discriminatedUnion("op",[
 z.object({op:z.literal("post"),category:z.enum(["Projects","Questions","Updates"]),title:z.string().trim().min(1).max(150),body:z.string().trim().min(1).max(3000),images:z.array(z.string().url()).max(4)}),
 z.object({op:z.literal("comment"),...target,body:z.string().trim().min(1).max(1500)}),
 z.object({op:z.literal("engage"),...target,action:z.enum(["like","save"]),active:z.boolean()}),
 z.object({op:z.literal("report"),itemType:z.enum(["listing","post","comment"]),itemId:z.string().uuid(),reason:z.string().trim().min(1).max(500)}),
 z.object({op:z.literal("remove"),itemType:z.enum(["post","comment"]),itemId:z.string().uuid()}),
 z.object({op:z.literal("review"),reportId:z.string().uuid()}),
 z.object({op:z.literal("layout"),layout:z.enum(["feed","classic"])}),
 z.object({op:z.literal("restore"),itemType:z.enum(["post","comment"]),itemId:z.string().uuid()})
]);
const fail=(message:string,status=400)=>NextResponse.json({error:message},{status});
export async function GET(request:NextRequest){
 const db=await createClient();const {data:{user}}=await db.auth.getUser();
 const p=request.nextUrl.searchParams;
 try{
  if(p.get("comments")){
   const t=z.object(target).safeParse({itemType:p.get("type"),itemId:p.get("comments")});if(!t.success)return fail("Invalid conversation.");
   const offset=Number(p.get("offset")||0);if(!Number.isInteger(offset)||offset<0||offset>10000)return fail("Invalid reply page.");
   const {data,error}=await db.from("apg_feed_comments").select("id,user_id,body,created_at,profiles(full_name)").eq("item_type",t.data.itemType).eq("item_id",t.data.itemId).eq("status","active").order("created_at").range(offset,offset+49);
   if(error)throw error;
   return NextResponse.json({replies:(data||[]).map(c=>({id:c.id,userId:c.user_id,author:(Array.isArray(c.profiles)?c.profiles[0]:c.profiles)?.full_name||"APG member",body:c.body,createdAt:c.created_at})),hasMore:data?.length===50},{headers:{"Cache-Control":"private, no-store"}});
  }
  const before=p.get("before")||undefined;if(before&&!z.string().datetime({offset:true}).safeParse(before).success)return fail("Invalid feed page.");
  return NextResponse.json(await readFeed(db,user?.id,before,p.get("saved")==="true",p.get("category")||undefined,(p.get("q")||'').slice(0,100)),{headers:{"Cache-Control":"private, no-store"}});
 }catch(error){console.error("Feed read failed",error instanceof Error?error.message:"database error");return fail("The feed couldn’t load. Please try again.",503)}
}
export async function POST(request:NextRequest){
 // Cookie-authenticated writes only accept this site's own origin.
 const origin=request.headers.get("origin");if(!origin||origin!==request.nextUrl.origin)return fail("Please post from the APG website.",403);
 if(Number(request.headers.get("content-length")||0)>30000)return fail("Post is too large.",413);
 const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return fail("Check your post details and try again.");
 const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)return fail("Sign in to join the conversation.",401);
 const d=parsed.data;
 try{
  if(d.op==='post'||d.op==='comment'||d.op==='report'){
   const table=d.op==='post'?'apg_feed_posts':d.op==='comment'?'apg_feed_comments':'apg_feed_reports';
   const {count,error}=await db.from(table).select('id',{count:'exact',head:true}).eq('user_id',user.id).gte('created_at',new Date(Date.now()-3600000).toISOString());
   if(error)throw error;if((count||0)>=(d.op==='comment'?60:20))return fail('Please wait a little before posting again.',429);
  }
  if(d.op==="layout"){
   if(user.app_metadata?.role!=="admin")return fail("Administrator access required.",403);
   const {error}=await db.from("apg_home_settings").update({layout:d.layout}).eq("id","home");if(error)throw error;revalidatePath("/");
  }else if(d.op==="restore"){
   if(user.app_metadata?.role!=="admin")return fail("Administrator access required.",403);
   const {error}=await db.from(d.itemType==='post'?"apg_feed_posts":"apg_feed_comments").update({status:"active"}).eq("id",d.itemId);if(error)throw error;
  }else if(d.op==="post"){
   const prefix=`${supabaseUrl}/storage/v1/object/public/part-images/${user.id}/`;
   if(d.images.some(url=>!url.startsWith(prefix)))return fail("Choose photos uploaded to your account.");
   const {error}=await db.from("apg_feed_posts").insert({user_id:user.id,category:d.category,title:d.title,body:d.body,image_urls:d.images});if(error)throw error;
  }else if(d.op==="comment"){
   const {error}=await db.from("apg_feed_comments").insert({user_id:user.id,item_type:d.itemType,item_id:d.itemId,body:d.body});if(error)throw error;
  }else if(d.op==="engage"){
   if(d.active){const {error}=await db.from("apg_feed_engagement").insert({user_id:user.id,item_type:d.itemType,item_id:d.itemId,action:d.action});if(error&&error.code!=="23505")throw error;}
   else {const {error}=await db.from("apg_feed_engagement").delete().eq("user_id",user.id).eq("item_type",d.itemType).eq("item_id",d.itemId).eq("action",d.action);if(error)throw error;}
  }else if(d.op==="report"){
   const {error}=await db.from("apg_feed_reports").insert({user_id:user.id,item_type:d.itemType,item_id:d.itemId,reason:d.reason});if(error)throw error;
  }else if(d.op==="remove"){
   const {data,error}=await db.from(d.itemType==='post'?"apg_feed_posts":"apg_feed_comments").update({status:"removed"}).eq("id",d.itemId).select("id");if(error)throw error;if(!data?.length)return fail("You can only remove your own content.",403);
  }else if(d.op==="review"){
   if(user.app_metadata?.role!=="admin")return fail("Administrator access required.",403);
   const {error}=await db.from("apg_feed_reports").update({status:"reviewed"}).eq("id",d.reportId);if(error)throw error;
  }
  return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
 }catch(error){console.error("Feed write failed",error&&typeof error==='object'&&'code'in error?error.code:"database error");return fail("Your change couldn’t be saved. Check your connection, or wait a little and try again.",400)}
}

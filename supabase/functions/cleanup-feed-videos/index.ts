import { createClient } from "npm:@supabase/supabase-js@2.57.0";
Deno.serve(async (request: Request) => {
 if(request.method!=="POST") return new Response("Method not allowed",{status:405});
 const db=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
 const {data:allowed,error:authError}=await db.rpc("authorize_feed_cleanup",{token:request.headers.get("x-cleanup-token")||""});
 if(authError||!allowed)return new Response("Unauthorized",{status:401});
 let deleted=0;
 for(let batch=0;batch<10;batch++){
  const {data:paths,error}=await db.rpc("expired_feed_video_paths");
  if(error)return Response.json({error:"Could not find expired videos"},{status:500});
  if(!paths?.length)break;
  const names=paths.map((p:{name:string})=>p.name);
  const {error:removeError}=await db.storage.from("feed-videos").remove(names);
  if(removeError)return Response.json({error:"Video cleanup failed"},{status:500});
  deleted+=names.length;
 }
 // Retry clearing expired references even if a previous run stopped after storage deletion.
 const {error}=await db.from("apg_feed_posts").update({video_url:null,video_duration:null}).not("video_url","is",null).lte("created_at",new Date(Date.now()-12*60*60*1000).toISOString());
 if(error)return Response.json({error:"Could not clear expired video references",deleted},{status:500});
 return Response.json({deleted});
});
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { writeFeed } from "@/components/feed/feed-card";
export default function FeedAdminControl({op,itemId,itemType,layout}:{op:'remove'|'review'|'restore'|'layout';itemId?:string;itemType?:'post'|'comment';layout?:'feed'|'classic'}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');const router=useRouter();
 async function act(){setBusy(true);setMessage('');try{await writeFeed(op==='layout'?{op,layout}:op==='review'?{op,reportId:itemId}:{op,itemId,itemType});setMessage('Saved.');router.refresh();}catch(e){setMessage(e instanceof Error?e.message:'Please try again.');}finally{setBusy(false)}}
 return <div><button className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold" disabled={busy} onClick={()=>void act()}>{busy?'Saving…':op==='layout'?(layout==='classic'?'Restore classic homepage':'Use the new homepage feed'):op==='review'?'Mark reviewed':op==='restore'?'Restore content':'Hide content'}</button>{message&&<p className="mt-2 text-sm" role="status">{message}</p>}</div>;
}

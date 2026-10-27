"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FeedMember } from "@/lib/feed-types";
import FeedModal from "./modal";
import { ImagePlus, Video, X, Globe2, HelpCircle, Wrench, MessageCircle, ArrowUp } from "lucide-react";
export default function FeedComposer({member,category,onClose,onPosted}:{member:NonNullable<FeedMember>;category:string;onClose:()=>void;onPosted:()=>void}){
 const [type,setType]=useState(category);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [files,setFiles]=useState<File[]>([]);const [previews,setPreviews]=useState<string[]>([]);const [body,setBody]=useState('');const picker=useRef<HTMLInputElement>(null);
 useEffect(()=>{const urls=files.map(file=>URL.createObjectURL(file));setPreviews(urls);return()=>urls.forEach(url=>URL.revokeObjectURL(url));},[files]);
 const [clip,setClip]=useState<{file:File;duration:number}|null>(null),[clipUrl,setClipUrl]=useState(''),[checkingClip,setCheckingClip]=useState(false);const videoPicker=useRef<HTMLInputElement>(null);
 useEffect(()=>{if(!clip){setClipUrl('');return;}const url=URL.createObjectURL(clip.file);setClipUrl(url);return()=>URL.revokeObjectURL(url);},[clip]);
 async function chooseVideo(file?:File){if(!file)return;setError('');if(!['video/mp4','video/webm','video/quicktime'].includes(file.type)||file.size>50*1024*1024){setError('Choose an MP4, WebM, or MOV video under 50 MB.');return;}setCheckingClip(true);try{const duration=await new Promise<number>((resolve,reject)=>{const video=document.createElement('video'),url=URL.createObjectURL(file);const done=()=>{clearTimeout(timer);video.removeAttribute('src');video.load();URL.revokeObjectURL(url);};const timer=setTimeout(()=>{done();reject(Error('This video could not be read. Try exporting it as MP4.'));},15000);video.preload='metadata';video.onloadedmetadata=()=>{const seconds=video.duration;done();Number.isFinite(seconds)&&seconds>0?resolve(seconds):reject(Error('This video could not be read. Try MP4.'));};video.onerror=()=>{done();reject(Error('This video cannot play on this device. Try MP4.'));};video.src=url;});if(duration>60)throw Error('Trim your video to 60 seconds or less.');setClip({file,duration});}catch(e){setError(e instanceof Error?e.message:'Please try another video.');}finally{setCheckingClip(false);}}
 const prompt=type==='Questions'?'What do you need help with?':type==='Projects'?'What are you building or fixing?':'What’s happening in your garage?';
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError('');const form=new FormData(e.currentTarget);const body=String(form.get('body')||'').trim();const firstLine=body.split('\n')[0];const title=firstLine.length>150?firstLine.slice(0,147)+'…':firstLine;if(!body)return setError('Write a little something before posting.');if(files.length>4||files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>8*1024*1024))return setError('Choose up to four JPG, PNG, or WebP photos, each under 8 MB.');if(checkingClip)return;setBusy(true);const db=createClient(),paths:string[]=[],images:string[]=[];let videoPath:string|null=null,videoUrl:string|null=null;
 try{for(const file of files){const path=`${member.id}/feed/${crypto.randomUUID()}.${file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp'}`;const {error:uploadError}=await db.storage.from('part-images').upload(path,file,{upsert:false,contentType:file.type});if(uploadError)throw Error('A photo could not upload. Please try again.');paths.push(path);images.push(db.storage.from('part-images').getPublicUrl(path).data.publicUrl);}if(clip){videoPath=`${member.id}/feed/${crypto.randomUUID()}.${clip.file.type==='video/mp4'?'mp4':clip.file.type==='video/webm'?'webm':'mov'}`;const {error:uploadError}=await db.storage.from('feed-videos').upload(videoPath,clip.file,{upsert:false,contentType:clip.file.type,cacheControl:'0'});if(uploadError)throw Error('The video could not upload. Check the 50 MB limit and try again.');videoUrl=db.storage.from('feed-videos').getPublicUrl(videoPath).data.publicUrl;}const result=await fetch('/api/feed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({op:'post',category:type,title,body,images,video:clip&&videoUrl?{url:videoUrl,duration:clip.duration}:undefined})});const data=await result.json();if(!result.ok)throw Error(data.error||'Your post could not be saved.');onPosted();}
 catch(err){if(videoPath)await db.storage.from('feed-videos').remove([videoPath]);if(paths.length)await db.storage.from('part-images').remove(paths);setError(err instanceof Error?err.message:'Please try again.');}finally{setBusy(false);}}
 return <FeedModal title="Create a post" onClose={()=>{if(!busy)onClose();}}><form onSubmit={submit} className="pc-form">
 <div className="pc-author"><span className="lf-avatar">{member.name.split(' ').map(word=>word[0]).slice(0,2).join('')}</span><div><strong>{member.name}</strong><small><Globe2 size={12}/>Public post</small></div></div>
 <div className="pc-types" role="group" aria-label="Post type">{[{value:'Questions',label:'Question',icon:HelpCircle},{value:'Projects',label:'Project',icon:Wrench},{value:'Updates',label:'Update',icon:MessageCircle}].map(option=><button key={option.value} type="button" aria-pressed={type===option.value} disabled={busy} onClick={()=>setType(option.value)}><option.icon size={16}/>{option.label}</button>)}</div>
 <label className="sr-only" htmlFor="pc-body">{prompt}</label><textarea id="pc-body" name="body" value={body} onChange={e=>setBody(e.target.value)} maxLength={3000} rows={6} placeholder={prompt} required disabled={busy}/>
 {files.length>0&&<div className="pc-photos">{files.map((file,index)=><div key={index}>{previews[index]&&<img src={previews[index]} alt={file.name}/>}<button type="button" aria-label={`Remove photo ${index+1}`} disabled={busy} onClick={()=>setFiles(current=>current.filter((_,i)=>i!==index))}><X size={14}/></button></div>)}</div>}
 <input ref={picker} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={e=>{const next=[...files,...Array.from(e.target.files||[])];if(next.length>4||next.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>8*1024*1024))setError('Choose up to four JPG, PNG, or WebP photos, each under 8 MB.');else{setFiles(next);setError('');}e.target.value='';}} disabled={busy} aria-label="Choose post photos"/>
 <div className="pc-tools"><button type="button" onClick={()=>picker.current?.click()} disabled={busy||files.length>=4}><ImagePlus size={19}/>Add photos</button><span>{files.length}/4 photos · 8 MB each</span></div>
 <input ref={videoPicker} type="file" accept="video/mp4,video/webm,video/quicktime" hidden aria-label="Choose post video" disabled={busy||checkingClip} onChange={e=>{void chooseVideo(e.target.files?.[0]);e.target.value='';}}/>
 <div className="pc-tools"><button type="button" disabled={busy||checkingClip} onClick={()=>videoPicker.current?.click()}><Video size={19}/>{checkingClip?'Checking video…':clip?'Replace video':'Add video'}</button><span>1 video · 60 sec · 50 MB</span></div>
 {clip&&clipUrl&&<div><video controls playsInline preload="metadata" src={clipUrl} style={{width:'100%',maxHeight:280,borderRadius:12,background:'#10233c'}} aria-label="Video preview"/><button type="button" disabled={busy} onClick={()=>setClip(null)}>Remove video</button></div>}
 <p className="lf-muted" style={{fontSize:12,margin:0}}>Videos expire and are deleted after 12 hours. Your text and photos stay.</p>
 {error&&<p className="lf-error" role="alert">{error}</p>}
 <div className="pc-footer"><p>Have something to sell?<br/><a href="/sell">Create a listing →</a></p><button type="submit" disabled={busy||checkingClip||!body.trim()}>{busy?'Posting…':'Post'}<ArrowUp size={17}/></button></div>
 </form><style>{`
.pc-form{display:grid;gap:20px}
.pc-author{display:flex;align-items:center;gap:11px}
.pc-author .lf-avatar{width:43px;height:43px;font-size:14px}
.pc-author strong{font-size:15px}
.pc-author small{display:flex;align-items:center;gap:5px;margin-top:4px;font-size:12px;color:#536277}
.pc-types{display:flex;gap:8px}
.live-feed.live-feed.live-feed .pc-types button{display:flex;align-items:center;justify-content:center;flex:1;gap:6px;padding:10px 8px;border:1px solid #dfe5ed!important;border-radius:24px;background:#fff!important;color:#10233c!important;font-size:13px}
.live-feed.live-feed.live-feed .pc-types button[aria-pressed=true]{background:#10233c!important;border-color:#10233c!important;color:#fff!important}
.live-feed.live-feed.live-feed .pc-types button[aria-pressed=true] svg{color:#fff!important}
.pc-form textarea{display:block;resize:vertical;width:100%;min-height:190px;background:#f7f9fb!important;border:1px solid #e1e7ef!important;border-radius:16px;padding:17px;font:400 17px/1.65 Arial,Helvetica,sans-serif;color:#10233c;outline:none}
.pc-form textarea:focus{border-color:#10233c!important;box-shadow:0 0 0 2px #10233c15}
.pc-form textarea::placeholder{color:#607087!important}
.pc-photos{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}
.pc-photos>div{position:relative;aspect-ratio:1;overflow:hidden;border-radius:12px;background:#edf1f5}
.pc-photos img{width:100%;height:100%;object-fit:cover}
.live-feed.live-feed.live-feed .pc-photos button{position:absolute;top:4px;right:4px;border-radius:50%;width:25px;height:25px;display:grid;place-items:center;background:#fff!important;box-shadow:0 2px 6px #10233c30!important}
.pc-tools{display:flex;justify-content:space-between;align-items:center;gap:10px}
.live-feed.live-feed.live-feed .pc-tools button{display:inline-flex;align-items:center;gap:7px;color:#10233c!important;padding:8px 0;font-size:14px;font-weight:700}
.pc-tools>span{font-size:11px;color:#536277}
.pc-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid #e1e7ef;padding-top:18px}
.pc-footer p{font-size:12px;line-height:1.7;margin:0;color:#536277}
.pc-footer a{font-weight:700;color:#10233c}
.live-feed.live-feed.live-feed .pc-footer button{display:flex;align-items:center;gap:16px;background:#e6b944!important;color:#10233c!important;border:1px solid #d0a138!important;border-radius:12px;padding:12px 22px;font-size:15px;font-weight:750;min-height:46px}
.live-feed.live-feed.live-feed .pc-footer button:disabled{opacity:.5;cursor:default}
.lf-modal:has(.pc-form){border-radius:24px;max-width:540px;width:calc(100% - 24px);padding:24px}
.lf-modal:has(.pc-form) .lf-modal-heading{margin-bottom:22px}
.lf-modal:has(.pc-form) .lf-modal-heading h2{font-size:22px;letter-spacing:-.5px}
@media(max-width:450px){.lf-modal:has(.pc-form){padding:20px}.pc-tools>span{font-size:10px}.pc-types{gap:6px}}
`}</style></FeedModal>;
}

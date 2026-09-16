"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InstallPromptEvent extends Event { prompt:()=>Promise<void>; userChoice:Promise<{outcome:"accepted"|"dismissed"}>; }

export default function InstallApp(){
  const [prompt,setPrompt]=useState<InstallPromptEvent|null>(null); const [help,setHelp]=useState(false); const [installed,setInstalled]=useState(false);
  useEffect(()=>{
    if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
    const timer=window.setTimeout(()=>setInstalled(window.matchMedia("(display-mode: standalone)").matches),0);
    const ready=(event:Event)=>{event.preventDefault();setPrompt(event as InstallPromptEvent)};
    const done=()=>{setInstalled(true);setPrompt(null)};
    window.addEventListener("beforeinstallprompt",ready);window.addEventListener("appinstalled",done);
    return()=>{window.clearTimeout(timer);window.removeEventListener("beforeinstallprompt",ready);window.removeEventListener("appinstalled",done)};
  },[]);
  async function install(){if(prompt){await prompt.prompt();const result=await prompt.userChoice;if(result.outcome==="accepted")setPrompt(null);}else setHelp(true);}
  if(installed)return null;
  return <><Button variant="outline" onClick={install} className="install-app-button border-amber-400 bg-white font-bold text-[#0b2345]"><Download className="size-4"/><span className="sm:hidden">Install</span><span className="hidden sm:inline">Install app</span></Button><Dialog open={help} onOpenChange={setHelp}><DialogContent><DialogHeader><DialogTitle>Install Any Part & Gear</DialogTitle><DialogDescription>Add the marketplace to your phone for fast, full-screen access.</DialogDescription></DialogHeader><div className="grid gap-4 text-sm leading-6"><div className="rounded-lg bg-slate-100 p-4"><strong className="flex items-center gap-2"><Share className="size-4"/> iPhone or iPad</strong><p className="mt-1 text-slate-600">Tap the browser Share button, then choose <b>Add to Home Screen</b>.</p></div><div className="rounded-lg bg-slate-100 p-4"><strong className="flex items-center gap-2"><Download className="size-4"/> Android</strong><p className="mt-1 text-slate-600">Tap <b>Install app</b> when prompted. If no prompt appears, open the browser menu and choose <b>Install app</b> or <b>Add to Home screen</b>.</p></div></div></DialogContent></Dialog></>;
}

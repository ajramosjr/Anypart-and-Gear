"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export default function FeedModal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;if(!d)return;d.showModal();return()=>{d.close();};},[]);
 return <dialog className="lf-modal" ref={ref} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget){const b=e.currentTarget.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)onClose();}}}><div className="lf-modal-heading"><h2>{title}</h2><button onClick={onClose} aria-label="Close dialog"><X size={20}/></button></div>{children}</dialog>;
}

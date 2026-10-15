"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { PartOutItem } from "@/lib/part-out";
import styles from "./parts-list.module.css";

export default function PartsList({ parts }: { parts: PartOutItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState({ part: 0, image: 0 });
  const part = parts[selected.part];
  return <section aria-label="Subaru parts and prices">
    <h2 className="mb-4 text-2xl font-bold">Parts &amp; prices</h2>
    <div className={styles.list}>{parts.map((item, index) => <button type="button" key={item.name} className={styles.row} onClick={() => { setSelected({ part: index, image: 0 }); dialog.current?.showModal(); }} aria-label={`View ${item.name} photos, $${item.price.toLocaleString()}`}>
      <span className={styles.thumb}><Image src={item.images[0]} alt={item.name} fill sizes="(max-width: 640px) 96px, 140px" /></span>
      <span className={styles.copy}><strong>{item.name}</strong><b>${item.price.toLocaleString()}</b>{item.note && <span>{item.note}</span>}<small>{item.images.length > 1 ? `${item.images.length} photos · Click to enlarge` : "Click to enlarge"}</small></span>
    </button>)}</div>
    <dialog ref={dialog} className={styles.dialog} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} aria-label={`${part.name} photos`}>
      <div className={styles.dialogHeader}><strong>{part.name} · ${part.price.toLocaleString()}</strong><button type="button" onClick={() => dialog.current?.close()} autoFocus>Close</button></div>
      <div className={styles.full}><Image src={part.images[selected.image]} alt={`${part.name}, photo ${selected.image + 1}`} fill sizes="90vw" /></div>
      {part.images.length > 1 && <div className={styles.controls}><button type="button" onClick={() => setSelected(value => ({ ...value, image: (value.image + part.images.length - 1) % part.images.length }))}>Previous</button><span aria-live="polite">{selected.image + 1} / {part.images.length}</span><button type="button" onClick={() => setSelected(value => ({ ...value, image: (value.image + 1) % part.images.length }))}>Next</button></div>}
      {part.note && <p>{part.note}</p>}
    </dialog>
  </section>;
}

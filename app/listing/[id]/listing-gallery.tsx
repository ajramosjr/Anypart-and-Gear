"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./listing-gallery.module.css";

type ListingGalleryProps = {
  title: string;
  primaryImage: string;
  images?: string[];
  videoUrl?: string | null;
};

export default function ListingGallery({ title, primaryImage, images = [], videoUrl }: ListingGalleryProps) {
  const galleryImages = useMemo(
    () => Array.from(new Set([primaryImage, ...images].filter(Boolean))),
    [primaryImage, images],
  );
  const [selection, setSelection] = useState<{ type: "image" | "video"; src: string }>({ type: "image", src: primaryImage });

  return (
    <div>
      {selection.type === "video" ? (
        <div className={styles.videoFrame}>
          <video src={selection.src} controls playsInline preload="metadata" aria-label={`${title} listing video`}>
            Your browser does not support video playback.
          </video>
        </div>
      ) : (
        <div className="detail-image">
          <Image src={selection.src} alt={`${title} — selected view`} fill priority sizes="(max-width: 700px) 100vw, 60vw" />
        </div>
      )}

      {(galleryImages.length > 1 || videoUrl) && (
        <div className={styles.thumbnailRow} aria-label={`${title} photos and video`}>
          {galleryImages.map((src, index) => {
            const isSelected = selection.type === "image" && src === selection.src;
            return (
              <button className={`${styles.thumbnail}${isSelected ? ` ${styles.selected}` : ""}`} type="button" key={src} aria-label={`Show photo ${index + 1} of ${galleryImages.length}`} aria-pressed={isSelected} onClick={() => setSelection({ type: "image", src })}>
                <Image src={src} alt="" fill sizes="120px" />
              </button>
            );
          })}
          {videoUrl && (
            <button className={`${styles.thumbnail} ${styles.videoThumbnail}${selection.type === "video" ? ` ${styles.selected}` : ""}`} type="button" aria-label="Play listing video" aria-pressed={selection.type === "video"} onClick={() => setSelection({ type: "video", src: videoUrl })}>
              <Play aria-hidden="true" />
              <span>Video</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

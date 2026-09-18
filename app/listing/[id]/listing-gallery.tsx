"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./listing-gallery.module.css";

type ListingGalleryProps = {
  title: string;
  primaryImage: string;
  images?: string[];
};

export default function ListingGallery({ title, primaryImage, images = [] }: ListingGalleryProps) {
  const galleryImages = useMemo(
    () => Array.from(new Set([primaryImage, ...images].filter(Boolean))),
    [primaryImage, images],
  );
  const [selectedImage, setSelectedImage] = useState(primaryImage);

  return (
    <div>
      <div className="detail-image">
        <Image
          src={selectedImage}
          alt={`${title} — selected view`}
          fill
          priority
          sizes="(max-width: 700px) 100vw, 60vw"
        />
      </div>

      {galleryImages.length > 1 && (
        <div className={styles.thumbnailRow} aria-label={`${title} photos`}>
          {galleryImages.map((src, index) => {
            const isSelected = src === selectedImage;
            return (
              <button
                className={`${styles.thumbnail}${isSelected ? ` ${styles.selected}` : ""}`}
                type="button"
                key={src}
                aria-label={`Show photo ${index + 1} of ${galleryImages.length}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedImage(src)}
              >
                <Image src={src} alt="" fill sizes="120px" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

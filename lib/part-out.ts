export type PartOutItem = { name: string; price: number; note?: string; images: string[] };

// Curated photo mapping for the owner-approved Subaru listing only. Prices are
// read from the current seller description; changed or missing content falls back.
export function getSubaruParts(listing: { id: string | number; description: string; image_urls?: string[]; imageUrls?: string[] }): PartOutItem[] | null {
  if (String(listing.id) !== "310869c4-8bf1-4720-b2d6-6d6b5f50aea4") return null;
  const photos = listing.image_urls ?? listing.imageUrls ?? [];
  const definitions = [
    { name: "Headliner", pattern: /Headliner\s*[-:]\s*\$(\d+(?:\.\d{1,2})?)/i, files: ["ca8ff683-f9b4-4212-b66e-ea8a34b89178.jpeg"] },
    { name: "Rear quarter windows (non-tinted)", pattern: /Rear quarter\s*\(non tinted\)\s*\$(\d+(?:\.\d{1,2})?)/i, files: ["7559d5bb-1e26-4424-8afd-b013a3d8ed59.jpeg", "66dec36c-ce36-4a7f-84b2-258a57092567.jpeg"], note: "Contact seller to confirm whether the listed price is per window or for the pair." },
    { name: "Window trims", pattern: /Window Trims\s*:\s*\$(\d+(?:\.\d{1,2})?)/i, files: ["c9e11a33-052a-431d-8da1-592cb86134f3.jpeg"], note: "Confirm included pieces with seller." },
    { name: "Wiper motor", pattern: /Wiper motor\s*:\s*\$(\d+(?:\.\d{1,2})?)/i, files: ["a007a4d5-2758-426f-9384-e7ff97c1bb46.jpeg"] },
  ];
  const parts: PartOutItem[] = [];
  for (const definition of definitions) {
    const match = listing.description.match(definition.pattern);
    const images = definition.files.map(file => photos.find(url => url.endsWith('/' + file)));
    if (!match || images.some(url => !url)) return null;
    parts.push({ name: definition.name, price: Number(match[1]), note: definition.note, images: images as string[] });
  }
  return parts;
}

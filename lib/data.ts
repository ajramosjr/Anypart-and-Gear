export type Listing = {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  price: number;
  condition: "New" | "Like new" | "Good" | "Fair";
  category: string;
  location: string;
  seller_name: string;
  image_url: string;
  image_urls?: string[];
  trade: boolean;
  created_at: string;
};

export const categories = [
  { name: "Car Parts", icon: "🚗", description: "Engines, body, electrical & more" },
  { name: "Boat Parts", icon: "⚓", description: "Marine engines, props & accessories" },
  { name: "Motorcycles", icon: "🏍️", description: "Parts, riding gear & complete bikes" },
  { name: "Trucks", icon: "🛻", description: "Pickup, diesel & commercial parts" },
  { name: "Tools", icon: "🧰", description: "Hand, power & diagnostic tools" },
  { name: "Machinery", icon: "🚜", description: "Construction and shop equipment" },
  { name: "Workwear & Apparel", icon: "🥾", description: "Workwear, safety gear & apparel" },
  { name: "Vehicles for Sale", icon: "🔑", description: "Cars, boats, bikes & projects" },
];

export const sampleListings: Listing[] = [
  {
    id: "sample-1",
    title: "MerCruiser 3.0 Exhaust Manifold",
    description: "Clean freshwater-tested manifold. Fits many 3.0L applications; verify fitment before buying.",
    price: 225,
    condition: "Good",
    category: "Boat Parts",
    location: "Bay Shore, NY",
    seller_name: "Long Island Marine Parts",
    image_url: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1200&q=80",
    trade: true,
    created_at: "2026-09-12T12:00:00Z",
  },
  {
    id: "sample-2",
    title: "Small Block Chevy Aluminum Intake",
    description: "Dual-plane intake, cleaned and ready to install. No cracks or stripped threads.",
    price: 180,
    condition: "Good",
    category: "Car Parts",
    location: "Hicksville, NY",
    seller_name: "Mike's Garage",
    image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80",
    trade: false,
    created_at: "2026-09-11T12:00:00Z",
  },
  {
    id: "sample-3",
    title: "Heavy-Duty Rolling Tool Chest",
    description: "Nine-drawer steel chest with smooth slides and keys. Local pickup only.",
    price: 350,
    condition: "Like new",
    category: "Tools",
    location: "Queens, NY",
    seller_name: "Tony R.",
    image_url: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=80",
    trade: true,
    created_at: "2026-09-10T12:00:00Z",
  },
  {
    id: "sample-4",
    title: "All-Terrain Truck Wheels — Set of 4",
    description: "18-inch wheels with usable all-terrain tires. Lug pattern and measurements available.",
    price: 725,
    condition: "Good",
    category: "Trucks",
    location: "Newark, NJ",
    seller_name: "North Jersey 4x4",
    image_url: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80",
    trade: false,
    created_at: "2026-09-09T12:00:00Z",
  },
  {
    id: "sample-5",
    title: "Leather Riding Jacket",
    description: "Armored motorcycle jacket with removable liner. Men's large.",
    price: 120,
    condition: "Like new",
    category: "Workwear & Apparel",
    location: "Brooklyn, NY",
    seller_name: "Jay's Moto Gear",
    image_url: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=80",
    trade: true,
    created_at: "2026-09-08T12:00:00Z",
  },
  {
    id: "sample-6",
    title: "Project Motorcycle — Runs",
    description: "Solid running project with clean paperwork. Great winter build.",
    price: 2800,
    condition: "Fair",
    category: "Vehicles for Sale",
    location: "Patchogue, NY",
    seller_name: "Rico M.",
    image_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    trade: true,
    created_at: "2026-09-07T12:00:00Z",
  },
];

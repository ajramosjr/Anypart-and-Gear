export const categoryGuidance: Record<string, string> = {
  "Car Parts": "Car and SUV parts only",
  "Boat Parts": "Marine parts and accessories",
  "Boats for Sale": "Complete boats and watercraft only",
  "Motorcycles": "Complete motorcycles and motorcycle parts",
  "Trucks": "Pickup, diesel and commercial truck parts",
  "Trailers": "Complete trailers and trailer parts",
  "Tools": "Hand, power and diagnostic tools",
  "RC & Hobby": "RC vehicles, parts, drones and hobby gear",
  "Machinery": "Construction, farm and shop machinery",
  "Workwear & Apparel": "Clothing, boots and safety gear",
  "Vehicles for Sale": "Complete cars, trucks and other vehicles only",
};

const containsAny = (text: string, words: string[]) =>
  words.some((word) => text.includes(word));

export function suggestListingCategory(title: string, description: string, selectedCategory: string) {
  const text = `${title} ${description}`.toLowerCase();
  const partWords = ["part", "parts", "door", "doors", "bumper", "fender", "hood", "mirror", "headlight", "taillight", "alternator", "starter", "radiator", "intake", "manifold", "transmission", "engine", "motor", "wheel", "wheels", "tire", "tires", "axle", "seat", "seats", "carburetor", "brake", "caliper", "exhaust"];
  const completeWords = ["complete", "whole", "running", "runs", "drives", "clean title", "registered", "vehicle for sale", "boat for sale"];
  const carWords = ["car", "auto", "automotive", "suv", "sedan", "coupe", "jeep", "wrangler", "ford", "chevy", "chevrolet", "dodge", "chrysler", "toyota", "honda", "nissan", "subaru", "volkswagen", "bmw", "mercedes", "lexus", "acura", "hyundai", "kia", "mazda", "buick", "cadillac"];
  const truckWords = ["truck", "pickup", "diesel", "f-150", "f150", "silverado", "ram", "tacoma", "tundra", "commercial truck"];
  const boatWords = ["boat", "marine", "watercraft", "bayliner", "sea ray", "mercruiser", "outboard", "inboard", "propeller", "prop", "hull", "pontoon", "jetski", "jet ski"];
  const motorcycleWords = ["motorcycle", "motorbike", "harley", "yamaha", "kawasaki", "suzuki", "ducati", "sportster"];
  const trailerWords = ["trailer", "fifth wheel", "gooseneck"];
  const rcWords = ["rc car", "rc truck", "remote control", "drone", "hobby", "nitro rc"];
  const toolWords = ["tool", "tools", "wrench", "socket", "ratchet", "drill", "welder", "scanner", "diagnostic", "toolbox", "tool chest"];
  const workwearWords = ["jacket", "shirt", "pants", "boots", "gloves", "helmet", "vest", "coveralls", "workwear", "apparel", "safety glasses"];
  const machineryWords = ["excavator", "backhoe", "loader", "forklift", "lathe", "mill", "generator", "compressor", "tractor", "machinery"];

  const hasParts = containsAny(text, partWords);
  const hasComplete = containsAny(text, completeWords);

  let suggested: string | null = null;
  if (containsAny(text, rcWords)) suggested = "RC & Hobby";
  else if (containsAny(text, toolWords)) suggested = "Tools";
  else if (containsAny(text, workwearWords) && !hasParts) suggested = "Workwear & Apparel";
  else if (containsAny(text, machineryWords)) suggested = "Machinery";
  else if (containsAny(text, trailerWords)) suggested = "Trailers";
  else if (containsAny(text, motorcycleWords)) suggested = "Motorcycles";
  else if (containsAny(text, boatWords)) suggested = hasParts && !hasComplete ? "Boat Parts" : "Boats for Sale";
  else if (containsAny(text, truckWords)) suggested = hasComplete && !hasParts ? "Vehicles for Sale" : "Trucks";
  else if (containsAny(text, carWords)) suggested = hasComplete && !hasParts ? "Vehicles for Sale" : "Car Parts";

  return suggested && suggested !== selectedCategory ? suggested : null;
}

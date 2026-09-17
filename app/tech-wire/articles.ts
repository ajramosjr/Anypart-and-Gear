export type TechArticleSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type TechArticle = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  published: string;
  sections: TechArticleSection[];
};

export const techArticles: TechArticle[] = [
  {
    slug: "best-engine-upgrades-before-more-power",
    category: "Engine upgrades",
    title: "Upgrade the foundation before chasing horsepower",
    summary: "The smartest first modifications improve engine health, cooling and braking before adding boost or an aggressive tune.",
    readTime: "6 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "Start with a health check", body: "Extra power magnifies existing problems. Check compression, oil pressure, fluid condition, fault codes, fuel trims and cooling-system pressure before buying performance parts.", bullets: ["Repair leaks, misfires and overheating first.", "Confirm maintenance records and use the correct fluids.", "Inspect engine and transmission mounts, belts and hoses."] },
      { heading: "Build supporting systems", body: "A reliable upgrade plan treats the vehicle as a complete system. Tires and brakes help use power safely, while cooling and fuel delivery help the engine survive it.", bullets: ["Choose tires appropriate for the vehicle and conditions.", "Refresh worn brakes and suspension components.", "Verify the fuel system and radiator can support the intended power level."] },
      { heading: "Add power in measured steps", body: "Make one meaningful change at a time, document the baseline and test afterward. A reputable vehicle-specific tune can be valuable, but only when the hardware, fuel octane and emissions requirements match the calibration." },
    ],
  },
  {
    slug: "towing-upgrades-that-actually-matter",
    category: "Trucks & towing",
    title: "Towing upgrades that actually matter",
    summary: "Cooling, brakes, tires and weight control usually improve a tow vehicle more than loud exhaust or cosmetic add-ons.",
    readTime: "5 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "Stay inside the ratings", body: "No modification increases the manufacturer-assigned GVWR, payload, axle ratings or legal tow rating. Weigh the loaded tow vehicle and trailer, then compare the numbers with the door label and owner’s manual." },
      { heading: "Control heat and weight", body: "Transmission temperature, engine coolant temperature and proper tongue weight are critical under load.", bullets: ["Use the manufacturer-approved transmission cooling package.", "Service coolant, belts and hoses before heavy trips.", "Set up the hitch correctly and verify trailer brake operation.", "Use load-range and pressure specifications suitable for the actual load."] },
      { heading: "Stability comes first", body: "Quality shocks can improve control when the originals are worn, but helper springs and air bags do not create extra payload capacity. Correct loading and a properly matched trailer remain the foundation." },
    ],
  },
  {
    slug: "engine-swap-planning-checklist",
    category: "Build planning",
    title: "Engine-swap checklist: what the price tag leaves out",
    summary: "The engine is only one line on the bill. Plan the wiring, cooling, transmission, fuel system, exhaust and legal details first.",
    readTime: "7 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "Define the job", body: "Decide whether the build is for daily driving, towing, off-road use or competition. That answer controls the power target, gearing, cooling needs and budget." },
      { heading: "Price the complete system", body: "A realistic parts list prevents a half-finished project.", bullets: ["Engine, accessories, mounts and oil-pan clearance", "Transmission compatibility, clutch or converter and driveshaft", "Harness, computer, sensors, security integration and gauges", "Fuel pump, lines, regulator and injectors", "Radiator, fans, hoses and exhaust fabrication"] },
      { heading: "Check rules before cutting", body: "Registration, inspection, emissions and insurance requirements vary by location. Confirm them before buying parts or removing the original drivetrain. Structural, fuel and brake work should be inspected by a qualified professional." },
    ],
  },
  {
    slug: "cooling-system-upgrades-for-reliability",
    category: "Reliability",
    title: "Cooling upgrades: fix airflow before buying the biggest radiator",
    summary: "A larger radiator cannot overcome trapped air, a weak cap, poor fan control or missing ducting. Diagnose the full system first.",
    readTime: "5 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "Find the operating condition", body: "Overheating at idle often points toward fan operation or airflow. Overheating at highway speed may indicate coolant flow, combustion pressure, restricted fins or a system that cannot reject enough heat." },
      { heading: "Inspect the inexpensive pieces", body: "Verify the thermostat orientation and rating, radiator-cap pressure, coolant mixture, belt condition, fan shroud, air seals and condenser cleanliness.", bullets: ["Pressure-test the cooling system and cap.", "Bleed the system using the manufacturer procedure.", "Confirm fan direction and commanded fan speed.", "Never open a hot pressurized cooling system."] },
      { heading: "Upgrade for the real load", body: "A properly engineered radiator, oil cooler or transmission cooler may be appropriate for towing, racing or added power. Size and mount components for airflow, and avoid stacking coolers so tightly that they block one another." },
    ],
  },
  {
    slug: "turbo-vs-supercharger-street-build",
    category: "Forced induction",
    title: "Turbo or supercharger for a street build?",
    summary: "Both can make strong power. The better choice depends on packaging, response, heat management, tuning support and how the vehicle is used.",
    readTime: "6 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "How they feel", body: "A mechanically driven supercharger can provide immediate response and a predictable power curve. A turbocharger uses exhaust energy and can be very efficient, but response and heat depend heavily on sizing and installation." },
      { heading: "The hidden requirements", body: "Either system may require stronger fuel delivery, charge-air cooling, colder spark plugs, crankcase ventilation changes and professional calibration.", bullets: ["Set the power goal before selecting hardware.", "Confirm compression and leak-down results.", "Budget for gauges, dyno time and troubleshooting.", "Use fuel of the octane required by the tune."] },
      { heading: "APG take", body: "For a street vehicle, choose the complete, well-supported system that a trusted local tuner knows—not the kit advertising the largest peak number. Reliability and repeatable power are more useful than a single dyno pull." },
    ],
  },
  {
    slug: "used-engine-buying-checklist",
    category: "Buying guide",
    title: "Used-engine buying checklist",
    summary: "Verify identity, history and condition before handing over money for a used engine or drivetrain.",
    readTime: "4 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "Confirm what it is", body: "Match the casting, stamped code, VIN application and accessory layout—not just the seller’s description. Model-year changes can affect sensors, reluctor wheels, computers and emissions equipment." },
      { heading: "Ask for evidence", body: "Request the donor mileage, reason for removal, cold-start video and any compression or leak-down results.", bullets: ["Inspect oil and coolant for contamination.", "Turn the crankshaft by hand when practical.", "Check broken connectors, damaged threads and missing accessories.", "Get the warranty and return conditions in writing."] },
      { heading: "Protect the transaction", body: "Keep payment and shipping records, photograph identifying numbers and use a payment method with appropriate buyer protection. A low price is not a bargain if the engine is incorrect, incomplete or cannot be tested." },
    ],
  },
];

export function getTechArticle(slug: string) {
  return techArticles.find((article) => article.slug === slug);
}

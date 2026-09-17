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
  sources?: { label: string; url: string }[];
};

export const techArticles: TechArticle[] = [
  {
    slug: "milwaukee-m18-high-output-xc5-tool-watch",
    category: "New tool watch",
    title: "Milwaukee’s M18 High Output XC5 battery: more power without the XC6 size",
    summary: "Milwaukee announced a 5Ah pack upgrade aimed at harder applications while preserving compatibility with the existing M18 system.",
    readTime: "5 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "What is new", body: "Milwaukee says its new M18 RedLithium High Output XC5 uses tabless-cell technology, upgraded electronics and improved thermal management. The manufacturer claims 50% more power than its XC5.0 pack while retaining a 5Ah rating." },
      { heading: "The advantages", body: "A higher-output pack in a smaller format may help grinders, saws and other demanding tools without the weight of a larger pack.", bullets: ["Compatible with the existing M18 system", "Smaller and lighter than Milwaukee’s High Output XC6.0 according to the company", "Oil-, grease- and solvent-resistant version planned for shop environments"] },
      { heading: "The tradeoffs", body: "More output does not automatically mean more runtime, and the announced pricing is higher than many standard 5Ah packs. Buyers should compare real tool performance, charging needs and sale pricing before replacing healthy batteries." },
    ],
    sources: [{ label: "Milwaukee Tool: M18 system-wide battery upgrade", url: "https://www.milwaukeetool.com/news/press-releases/milwaukee-delivers-an-m18-system-wide-upgrade" }],
  },
  {
    slug: "milwaukee-packout-vaclink-vacuum-tool-watch",
    category: "New tool watch",
    title: "Cordless dust control gets smarter with Milwaukee VACLINK",
    summary: "Milwaukee’s upcoming PACKOUT-compatible 4-gallon wet/dry vacuum adds wireless tool-triggered dust control for cleaner work.",
    readTime: "4 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "Why it matters", body: "Wireless tool activation can start a vacuum when a compatible cutting or drilling tool runs. That reduces the temptation to skip dust collection during short jobs and keeps the vacuum accessible on a PACKOUT stack." },
      { heading: "The advantages", body: "The concept combines cordless cleanup, modular transport and automatic activation.", bullets: ["No separate walk to switch on the vacuum", "PACKOUT compatibility for mobile crews", "Wet/dry capability for broader cleanup use"] },
      { heading: "Questions before buying", body: "Confirm which tools and accessories support VACLINK, filter availability, hose compatibility, runtime with your batteries and whether the added electronics justify the price for your work." },
    ],
    sources: [{ label: "Milwaukee Pipeline: New products and upcoming releases", url: "https://www.milwaukeetool.com/pipeline" }],
  },
  {
    slug: "bosch-expert-18v-2026-new-tools",
    category: "New tool watch",
    title: "Bosch EXPERT 18V expands with new batteries, sanders and nailers",
    summary: "Bosch’s 2026 rollout adds a next-generation battery family and dozens of cordless and corded products across core trades.",
    readTime: "6 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "What Bosch announced", body: "Bosch announced a phased 2026 expansion covering 39 products and promoted its EXPERT 18V platform with next-generation battery technology. Current new-product listings include a 6-inch random-orbit sander and a brushless 30-degree framing nailer." },
      { heading: "The advantages", body: "Platform updates can give existing battery-system owners more specialized choices without starting over.", bullets: ["New high-output battery options for demanding tools", "More cordless choices in sanding and fastening", "AMPShare compatibility can broaden the shared battery ecosystem"] },
      { heading: "The tradeoffs", body: "A large launch can make model selection confusing. Compare bare-tool requirements, battery recommendations, dust-control accessories and kit contents carefully; an older model on sale may still be the better value for occasional use." },
    ],
    sources: [{ label: "Bosch Power Tools: 2026 product expansion", url: "https://pressroom.boschtools.com/press-releases" }, { label: "Bosch Power Tools: New products", url: "https://www.boschtools.com/us/en/new-products/" }],
  },
  {
    slug: "bosch-two-in-one-impact-driver-wrench-pros-cons",
    category: "New tool watch",
    title: "One tool, two drives: Bosch’s new impact driver/wrench idea",
    summary: "The GDX18V-285N combines a quarter-inch hex interface with a half-inch square drive, aiming to reduce tool changes.",
    readTime: "4 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "The appeal", body: "A combined bit and socket interface can move between screws and moderate fastening without carrying two separate tools. That is attractive for mobile repair, assembly and maintenance carts." },
      { heading: "The advantages", body: "Fewer tool swaps and less equipment can speed mixed fastening jobs.", bullets: ["Accepts common quarter-inch hex bits", "Provides a half-inch square drive for sockets", "Stays within Bosch’s 18V battery family"] },
      { heading: "The limitations", body: "A combination tool is not automatically a replacement for a dedicated high-torque impact wrench or a compact precision driver. Match the fastening torque, access and control requirements to the tool—not just the drive size." },
    ],
    sources: [{ label: "Bosch Power Tools: GDX18V-285N new-product listing", url: "https://www.boschtools.com/us/en/new-products/" }],
  },
  {
    slug: "2026-cordless-tool-platform-buying-guide",
    category: "Tool buying guide",
    title: "Before joining a cordless platform in 2026, count the tools—not just the volts",
    summary: "The battery ecosystem, repair network and tools you will buy next matter more than the biggest voltage printed on the box.",
    readTime: "6 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "Buy the system", body: "A cordless purchase creates a long-term relationship with batteries, chargers and compatible bare tools. List the five tools you need now and the five you may need later before choosing a platform." },
      { heading: "Compare what changes the job", body: "Voltage alone does not describe performance. Motor efficiency, battery output, thermal management and tool design all affect how the system works.", bullets: ["Check local service and warranty options", "Compare battery weight for overhead and tight-space work", "Price the batteries and chargers you actually need", "Look for specialty automotive, marine or trade tools in the same family"] },
      { heading: "APG take", body: "Professionals may benefit from two carefully chosen platforms, but casual users usually save money and space by staying with one. A new launch is worth switching only when it solves an important problem your current system cannot." },
    ],
    sources: [{ label: "Milwaukee Pipeline", url: "https://www.milwaukeetool.com/pipeline" }, { label: "Bosch 2026 catalog and product resources", url: "https://www.boschtools.com/us/en/news-knowledge/resources/catalogs/" }, { label: "Makita cordless systems", url: "https://www.makitatools.com/" }],
  },
  {
    slug: "electric-vehicle-pros-and-cons",
    category: "Future vehicles",
    title: "Electric vehicles: the real-world pros and cons",
    summary: "Quiet power and home charging are compelling, but range, charging access, repair planning and towing needs still matter.",
    readTime: "6 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "The advantages", body: "Battery-electric vehicles deliver immediate torque, quiet operation and no tailpipe emissions. Fewer routine engine-service items can simplify maintenance, and home charging can make daily driving convenient for owners with reliable parking and electrical access.", bullets: ["Strong low-speed response and smooth acceleration", "No oil changes or conventional exhaust system", "Regenerative braking can reduce friction-brake use", "Home charging can replace many fuel-station visits"] },
      { heading: "The tradeoffs", body: "Charging time, public-station reliability and cold-weather range should be part of the buying decision. Heavy towing and sustained high-speed travel can also reduce range significantly.", bullets: ["Apartment and street parking may complicate charging", "Collision and battery repairs may require specialized facilities", "Trip planning matters more where fast chargers are limited", "Battery condition is important when shopping used"] },
      { heading: "Who benefits most", body: "An EV can be an excellent fit for predictable daily mileage, overnight charging and a household that understands its longer-trip needs. Buyers who tow long distances or cannot charge reliably should compare alternatives carefully." },
    ],
    sources: [{ label: "U.S. Department of Energy: All-electric vehicle basics", url: "https://afdc.energy.gov/vehicles/electric-basics-ev" }],
  },
  {
    slug: "plug-in-hybrid-pros-and-cons",
    category: "Future vehicles",
    title: "Plug-in hybrids: useful bridge or too much complexity?",
    summary: "A PHEV can handle short trips on electricity and long trips on fuel, but it carries two power systems and only works best when charged regularly.",
    readTime: "5 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "Why the idea works", body: "A plug-in hybrid can cover many local trips on stored electricity while keeping an engine for longer travel. For drivers with home charging and occasional road trips, that flexibility can reduce fuel use without making public charging essential." },
      { heading: "Where buyers get disappointed", body: "The electric range is smaller than a full EV, and the vehicle still needs engine maintenance. Owners who rarely plug in may carry extra battery weight without receiving the main benefit.", bullets: ["Compare electric range with your actual daily commute", "Check cargo or passenger space affected by battery packaging", "Review both engine and high-voltage warranty coverage", "Do not assume every PHEV can fast-charge"] },
      { heading: "APG take", body: "A PHEV is strongest when the owner charges most nights and uses the engine as backup—not when it is treated like a conventional hybrid that never gets plugged in." },
    ],
    sources: [{ label: "U.S. Department of Energy: Plug-in hybrid basics", url: "https://afdc.energy.gov/vehicles/electric-basics-phev" }],
  },
  {
    slug: "driver-assistance-pros-and-cons",
    category: "Future vehicles",
    title: "Advanced driver assistance: helpful safety net, not a chauffeur",
    summary: "Automatic braking and lane support can help, but names and capabilities vary—and the human driver remains responsible.",
    readTime: "5 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "What can help", body: "Features such as forward-collision warning, automatic emergency braking, blind-spot warning and lane-departure warning can add useful information or intervention when conditions are within the system’s design." },
      { heading: "What can go wrong", body: "Cameras and radar can be affected by weather, dirt, road markings, glare or damage. Feature names may sound more capable than the system actually is.", bullets: ["Read the owner’s manual instead of relying on the marketing name", "Keep sensors and cameras clean", "Confirm calibration after windshield, alignment or collision work", "Stay ready to steer and brake at all times"] },
      { heading: "Buying used", body: "Verify that warning lights are off, all sensors are present and previous collision repairs included required calibration. A system that appears to operate may still be misaligned." },
    ],
    sources: [{ label: "NHTSA: Driver assistance technologies", url: "https://www.nhtsa.gov/vehicle-safety/driver-assistance-technologies" }],
  },
  {
    slug: "software-defined-vehicle-pros-and-cons",
    category: "Future vehicles",
    title: "Software-defined vehicles: better updates, bigger questions",
    summary: "Over-the-air improvements can fix and add features, but long-term support, privacy and subscription costs deserve attention.",
    readTime: "6 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "The promise", body: "Vehicles with updateable control systems may receive bug fixes, interface improvements and feature changes without a dealership visit. Better diagnostics can also help manufacturers identify problems across a fleet." },
      { heading: "The concerns", body: "A vehicle that depends heavily on software also depends on secure updates, manufacturer support and access to repair information.", bullets: ["Ask which features require a paid subscription", "Review privacy and connected-services settings", "Check how long maps, apps and security updates are supported", "Understand what happens when cellular service ends"] },
      { heading: "Repairability matters", body: "Owners should consider whether independent shops can access service procedures, scan data and replacement-component programming. Convenient technology should not turn a simple repair into an unnecessary replacement of an entire module." },
    ],
    sources: [{ label: "NHTSA: Vehicle cybersecurity", url: "https://www.nhtsa.gov/vehicle-safety/cybersecurity" }],
  },
  {
    slug: "next-generation-batteries-pros-and-cons",
    category: "Future vehicles",
    title: "Next-generation batteries: exciting, but wait for the specifications",
    summary: "Solid-state and other advanced batteries may improve range, charging or safety, but laboratory promise is not the same as mass-production proof.",
    readTime: "5 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "What could improve", body: "Advanced battery designs aim to store more energy, charge faster, use different materials or manage heat more effectively. Successful designs could reduce vehicle weight or improve usable range." },
      { heading: "What headlines leave out", body: "Cycle life, cold-weather operation, fast-charging durability, manufacturing yield and cost all matter. A prototype cell is not a production battery pack.", bullets: ["Look for pack-level specifications, not only cell claims", "Compare warranty terms and usable capacity", "Separate announced targets from vehicles customers can buy", "Consider repair and recycling plans"] },
      { heading: "APG take", body: "Do not delay a needed vehicle purchase solely for a battery breakthrough without a confirmed model, price and delivery date. Buy for today’s use and treat future claims as unproven until production data arrives." },
    ],
    sources: [{ label: "U.S. Department of Energy: Battery research", url: "https://www.energy.gov/eere/vehicles/batteries" }],
  },
  {
    slug: "hydrogen-vehicle-pros-and-cons",
    category: "Future vehicles",
    title: "Hydrogen vehicles: quick refueling, difficult infrastructure",
    summary: "Fuel-cell vehicles can offer fast refueling and electric drive, but station access and fuel availability determine whether ownership is practical.",
    readTime: "5 min read",
    published: "September 17, 2026",
    sections: [
      { heading: "Why hydrogen is interesting", body: "A fuel-cell vehicle generates electricity onboard and drives with an electric motor. Refueling can be faster than charging a large battery, and the vehicle produces water at the tailpipe." },
      { heading: "The major obstacle", body: "A vehicle is only useful when fuel is available where the owner lives and travels. Station coverage, fuel price and supply interruptions can outweigh the technical advantages.", bullets: ["Map working stations before considering a purchase", "Check whether the vehicle can travel outside its home region", "Understand fuel-card promotions and their expiration", "Compare service locations and resale demand"] },
      { heading: "Where it may fit", body: "Hydrogen may be more compelling in controlled fleets or routes with dedicated fueling. For private buyers, local infrastructure—not advertised range—should lead the decision." },
    ],
    sources: [{ label: "U.S. Department of Energy: Fuel-cell vehicle basics", url: "https://afdc.energy.gov/vehicles/fuel-cell" }],
  },
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

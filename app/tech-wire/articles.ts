export type TechArticleSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type TechArticle = {
  slug: string;
  imageUrl?: string;
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
    slug: "fuel-guide-gasoline-ethanol-diesel-marine-equipment",
    category: "Fuel guide",
    title: "Fuel choices are changing: what drivers, boaters and equipment owners should know",
    summary: "Regular, premium, ethanol blends, diesel, biodiesel and renewable diesel are not interchangeable. The safest choice begins with the engine manufacturer’s approved fuel specification.",
    readTime: "7 min read",
    published: "September 27, 2026",
    sections: [
      {
        heading: "The pump offers more choices—but the engine sets the rules",
        body: "Fuel is becoming more varied across cars, boats, trucks and work equipment. That creates opportunities for lower cost, domestic production and renewable content, but it also makes the label on the pump more important. Octane rating, ethanol percentage, cetane quality, biodiesel content and seasonal formulation affect different engines in different ways. Before choosing a fuel, check the owner’s manual, fuel-door label or manufacturer service information.",
      },
      {
        heading: "Regular versus premium gasoline",
        body: "A higher octane number describes resistance to engine knock; it does not automatically mean the fuel contains more energy or will clean every engine better. If premium is required, use it. If premium is only recommended, the vehicle may adjust to regular with some reduction in performance or efficiency. When the manual specifies regular, routinely paying for premium usually provides little benefit.",
        bullets: [
          "Required means the engine was designed to depend on that octane level",
          "Recommended means the engine may run on a lower grade with tradeoffs",
          "Do not choose fuel by price or nozzle color alone",
          "Persistent knocking or poor running needs diagnosis—not a random additive",
        ],
      },
      {
        heading: "E10, E15 and E85 are different fuels",
        body: "E10 contains up to 10% ethanol and is the most common gasoline blend in the United States. E15 contains 10.5% to 15% ethanol and is approved for many model-year 2001 and newer light-duty gasoline vehicles, but it is not approved for every engine or machine. E85 contains far more ethanol and belongs only in a flex-fuel vehicle. Ethanol has a higher octane rating than gasoline but less energy per gallon, so higher blends can change fuel economy.",
      },
      {
        heading: "Boats and small engines need extra attention",
        body: "A fuel accepted by the tow vehicle may be wrong for the boat, generator, mower or other nonroad equipment. E15 should not be used in boats. Marine fuel systems also face moisture, storage and corrosion concerns, so owners should follow the engine maker’s ethanol limit and storage procedure. Never assume that premium gasoline is ethanol-free; the pump label must say what blend is being sold.",
        bullets: [
          "Keep the boat’s fuel requirement separate from the tow vehicle’s",
          "Label portable cans for the exact machine they serve",
          "Buy a manageable amount before long storage periods",
          "Inspect hoses, filters, vents and tanks when fuel problems appear",
        ],
      },
      {
        heading: "Diesel, biodiesel and renewable diesel are not the same",
        body: "Biodiesel is commonly identified by blend levels such as B5 or B20 and has different chemical properties from petroleum diesel. Renewable diesel is produced from fats and oils but is processed differently and is chemically similar to petroleum diesel. Compatibility, cold-weather performance, warranty limits and required maintenance can depend on the blend, engine and emissions system. Diesel owners should confirm the approved specification instead of treating every green-labeled diesel product as interchangeable.",
      },
      {
        heading: "Fuel quality matters as much as fuel type",
        body: "Water, dirt, age and the wrong additive can create symptoms that resemble a mechanical failure. Buy from a busy, reputable station, keep caps and vents in good condition, and avoid storing fuel longer than the manufacturer recommends. If a machine runs poorly immediately after refueling, save the receipt and a fuel sample if it can be collected safely by a qualified technician.",
      },
      {
        heading: "APG take: read the label before grabbing the nozzle",
        body: "The future will include more fuel blends, renewable products and electrified powertrains. Owners do not need to memorize every chemistry lesson, but they do need to match the pump label to the equipment. The right fuel is the approved fuel that delivers the required performance, range and reliability for the job—not simply the highest octane or newest blend available.",
      },
    ],
    sources: [
      { label: "U.S. Department of Energy: Ethanol blends", url: "https://afdc.energy.gov/fuels/ethanol-blends" },
      { label: "U.S. Department of Energy: Fuel blends", url: "https://afdc.energy.gov/fuels/blends" },
      { label: "U.S. Department of Energy: Biodiesel basics", url: "https://afdc.energy.gov/fuels/biodiesel-basics" },
      { label: "U.S. Department of Energy: Renewable diesel", url: "https://afdc.energy.gov/fuels/renewable-diesel" },
      { label: "U.S. EPA: E15 fuel registration", url: "https://www.epa.gov/fuels-registration-reporting-and-compliance-help/e15-fuel-registration" },
    ],
  },
  {
    slug: "boaterhome-rv-boat-should-come-back",
    category: "Boat concept",
    title: "The Boaterhome should come back—and modern technology could make it better",
    summary: "The rare 1980s Boaterhome combined an RV-like road vehicle with a detachable cabin cruiser. A modern revival could turn one machine into the ultimate road-and-water escape.",
    readTime: "7 min read",
    published: "September 27, 2026",
    sections: [
      {
        heading: "An RV that left part of itself at the boat ramp",
        body: "The original Boaterhome joined the cab and forward chassis of a Ford Econoline to a specially shaped cabin-cruiser boat. On the road, the two sections met closely enough to resemble one long motorhome. At the launch ramp, the boat separated and floated away while the cab and supporting chassis remained on land. Reports say only about 21 examples were built, which helps explain why the strange but brilliant idea still attracts attention decades later.",
      },
      {
        heading: "Why the idea was awesome",
        body: "A normal boating vacation can require a tow vehicle, a trailer, a boat and separate lodging. The Boaterhome attempted to combine most of that equipment into one continuous living space. Travelers could drive, eat and sleep in an RV-like cabin, then launch the rear section and continue the trip on the water.",
        bullets: [
          "One adventure vehicle for highways, campgrounds, marinas and lakes",
          "A cabin cruiser that also served as the rear living space on land",
          "No separate conventional boat trailer behind a full-size motorhome",
          "A dramatic launch that would still stop traffic at any modern ramp",
        ],
      },
      {
        heading: "How a modern version could improve it",
        body: "Today’s technology could address several weaknesses of the old design without losing its personality. A heavy-duty hybrid chassis could provide strong low-speed torque and regenerative braking while preserving long-distance range. Cameras and proximity sensors could give the driver a clear view of the boat, ramp and dock. Electric bow thrusters could simplify close-quarters maneuvering after launch, while solar panels and a house battery could run lights, refrigeration and climate systems without idling the main engine.",
        bullets: [
          "Hybrid assistance for launch-ramp control and highway efficiency",
          "Four-wheel steering or a steerable rear axle for tighter maneuvering",
          "A 360-degree camera view with dedicated ramp and hitch guidance",
          "Solar house power with separate propulsion and living-system batteries",
          "Corrosion-resistant connections that automatically seal when the boat separates",
        ],
      },
      {
        heading: "The hardest problem would still be weight",
        body: "Water, fuel, batteries, appliances, passengers and boating equipment add weight quickly. A revival would need published ratings for every road configuration and careful control of axle, tire and combined weight limits. The boat would also need to meet applicable capacity, flotation, electrical and fuel-system requirements. Clever packaging cannot replace separate engineering for a safe road vehicle and a safe vessel.",
      },
      {
        heading: "Ownership would require two kinds of planning",
        body: "A modern Boaterhome could face different registration, insurance and licensing rules as a motor vehicle and a boat. Owners would need service support for the chassis, propulsion system, hull and separation hardware. Not every launch ramp or campsite would accommodate its length, and saltwater use would demand a serious rinsing and corrosion-control routine.",
        bullets: [
          "Confirm road dimensions, weight ratings and license requirements",
          "Confirm vessel registration and local operator requirements",
          "Choose ramps with enough length, depth and turning room",
          "Build a service network that understands both halves of the machine",
        ],
      },
      {
        heading: "APG take: bring it back as a limited-production flagship",
        body: "The Boaterhome would never replace an ordinary pickup and trailer, and it would not be cheap. That is not the point. A modern manufacturer could bring it back as a low-volume halo vehicle for families, marinas, rental fleets and adventure travelers who want the journey itself to be memorable. Keep the detachable boat, add modern safety and hybrid systems, and give buyers one spectacular machine that can turn a road trip into a boating trip at the bottom of a ramp.",
      },
    ],
    sources: [
      { label: "Practical Motorhome: A look at the Boaterhome", url: "https://www.practicalmotorhome.com/news/boaterhome-half-van-half-boat" },
      { label: "Motor1: Boaterhome half-van, half-boat history", url: "https://www.motor1.com/news/364548/boaterhome-half-van-half-boat/" },
      { label: "U.S. patent: Recreational boat/camper vehicle", url: "https://patents.google.com/patent/WO1991019624A1/en" },
      { label: "U.S. Coast Guard: Recreational boat regulations", url: "https://uscgboating.org/regulations/" },
      { label: "NHTSA: Trailer importation and certification FAQs", url: "https://www.nhtsa.gov/importing-vehicle/importation-and-certification-faqs-1" },
    ],
  },
  {
    slug: "changing-fuels-hybrids-auto-marine-work",
    category: "Fuel prices & powertrains",
    title: "Fuel is changing every field. Are hybrids the practical middle ground?",
    summary: "Cars, boats, trucks and work equipment are moving toward a mix of electricity, renewable fuels and more efficient engines. For many owners, a hybrid may offer the most usable bridge between them.",
    readTime: "7 min read",
    published: "September 27, 2026",
    sections: [
      {
        heading: "Transportation is not changing all at once",
        body: "The fuel transition will look different in every field. Passenger vehicles can often use home charging, while boats, long-haul trucks and remote equipment may need greater range, fast refueling and dependable energy far from a charger. Gasoline and diesel will remain part of the mix as electricity, renewable diesel, hydrogen, methanol and other alternatives develop. The right answer depends on the route, load and available infrastructure—not one headline technology.",
      },
      {
        heading: "Automotive: hybrids solve an immediate problem",
        body: "A conventional hybrid combines an engine with an electric motor and battery, then recovers energy through regenerative braking. It does not need to be plugged in. A plug-in hybrid adds a larger battery for shorter electric trips while retaining an engine for longer travel. That flexibility can make either type practical for drivers who want to reduce fuel use but cannot depend entirely on public charging.",
        bullets: [
          "Conventional hybrids work without home charging",
          "Regenerative braking is especially useful in stop-and-go driving",
          "Plug-in hybrids can cover many local trips on electricity when charged regularly",
          "An engine preserves familiar range and fast refueling for longer trips",
        ],
      },
      {
        heading: "Marine: the mission matters more than the trend",
        body: "Short-route ferries, harbor craft and smaller recreational boats may be good candidates for electric or hybrid operation because they return to known docks. Larger vessels and boats used far from shore still need energy density, range and reliable refueling. Hybrid systems can reduce engine idling and let an electric motor handle some low-speed operation, but weight, saltwater durability, charging access and purchase cost must be evaluated for the specific vessel.",
      },
      {
        heading: "Trucks, buses and work equipment need several answers",
        body: "Urban delivery trucks and buses benefit from regenerative braking and predictable routes. Long-haul trucks, farm machines, construction equipment and remote fleets face harder questions about payload, downtime and power availability. Those fields are likely to use a mix of efficient diesel engines, renewable diesel where approved, battery-electric systems, hybrids and possibly hydrogen rather than switching to one fuel at the same time.",
      },
      {
        heading: "Why hybrids may remain the better choice for many owners",
        body: "Hybrids can lower fuel consumption without requiring every trip to fit a charging network. They also preserve quick refueling and long operating range. That makes them a strong middle choice for mixed driving, towing, rural travel and fleets that cannot tolerate long charging stops. A plug-in hybrid is most effective when it is charged regularly; if it is rarely plugged in, much of its advantage disappears.",
        bullets: [
          "Compare real-world fuel economy under the load you actually carry",
          "Check towing, payload and electric-range limits before buying",
          "Price both engine maintenance and long-term battery coverage",
          "Confirm that local technicians can service the complete powertrain",
        ],
      },
      {
        heading: "The tradeoff: two systems instead of one",
        body: "A hybrid still has an engine, fuel system and exhaust equipment while adding a battery, motor and power electronics. That complexity is not automatically a deal-breaker, but buyers should consider warranty terms, repair access, battery condition on a used model and the cost difference from a conventional vehicle. A hybrid is not a zero-emission vehicle, and it is not the best answer when a full EV already covers the job easily.",
      },
      {
        heading: "APG take: match the powertrain to the work",
        body: "For many buyers, hybrids offer the most realistic balance available now: lower fuel use, familiar range and less dependence on new infrastructure. But there is no universal winner. Start with the daily route, worst-case load, towing needs, storage location, available charging or fueling and local service support. The best powertrain is the one that completes the real job reliably—not the one with the newest label.",
      },
    ],
    sources: [
      { label: "U.S. Department of Energy: Hybrid electric vehicle basics", url: "https://afdc.energy.gov/vehicles/electric-basics-hev" },
      { label: "U.S. Department of Energy: Plug-in hybrid basics", url: "https://afdc.energy.gov/vehicles/electric-basics-phev" },
      { label: "U.S. Department of Energy: Maritime innovation", url: "https://www.energy.gov/cmei/fuels/maritime-innovation" },
      { label: "U.S. Department of Energy: Road, rail, marine and aviation", url: "https://www.energy.gov/cmei/vehicles/road-rail-marine-and-aviation" },
      { label: "Alternative Fuels Data Center: Renewable diesel", url: "https://afdc.energy.gov/fuels/renewable-diesel" },
    ],
  },
  {
    slug: "used-boat-recall-and-hin-checklist",
    category: "Boat safety",
    title: "Buying a used boat? Check recalls and verify the HIN first",
    summary: "A clean-looking hull can still have an unresolved safety defect. Here is how to check the Coast Guard recall database and confirm the boat’s identity before buying.",
    readTime: "5 min read",
    published: "September 27, 2026",
    sections: [
      { heading: "Start with the hull identification number", body: "The hull identification number, or HIN, identifies the boat much like a VIN identifies a vehicle. Compare the HIN on the hull with the title or registration and look carefully for missing, altered or mismatched characters before money changes hands." },
      { heading: "Search for safety defects", body: "The U.S. Coast Guard maintains a searchable database of documented and alleged safety defects affecting recreational boats and associated equipment. Search by manufacturer, model and model year when possible, then ask the seller for documentation showing that any applicable recall work was completed.", bullets: ["Photograph the HIN and manufacturer plate", "Match the model and year to the paperwork", "Search the Coast Guard recall database", "Have unresolved defects inspected by a qualified marine technician"] },
      { heading: "A recall search is only one step", body: "A database check does not replace a sea trial or professional inspection. Transom damage, water intrusion, wiring problems, fuel leaks and neglected propulsion systems may not appear in a recall search." },
    ],
    sources: [{ label: "U.S. Coast Guard: Recalls and safety defects", url: "https://uscgboating.org/content/recalls_and_safety_defects.php" }, { label: "U.S. Coast Guard: Hull identification guidance", url: "https://uscgboating.org/regulations/State-Guidance/HIN/" }],
  },
  {
    slug: "e15-fuel-warning-for-boats",
    category: "Marine fuel",
    title: "E15 fuel warning: do not put 15% ethanol gasoline in a boat",
    summary: "The EPA permits E15 for certain highway vehicles, but not boats. Check the pump label carefully before filling portable tanks or a trailerable boat.",
    readTime: "4 min read",
    published: "September 27, 2026",
    sections: [
      { heading: "E15 is not approved for boats", body: "E15 contains 15% ethanol. The U.S. Environmental Protection Agency says it cannot be used in nonroad vehicles such as boats. A newer tow vehicle may accept E15 while the boat behind it does not, which makes pump selection especially important." },
      { heading: "Read the label before fueling", body: "Do not choose fuel by octane alone. Confirm the ethanol blend shown on the dispenser and follow the fuel specification in the engine owner’s manual.", bullets: ["Keep boat and tow-vehicle fuel requirements separate", "Check portable cans before filling", "Do not assume premium grade means ethanol-free", "If the wrong fuel was added, stop and contact a qualified marine service provider"] },
      { heading: "Storage still matters", body: "Fuel age, water contamination and the condition of hoses, filters and tanks can also cause running problems. Use the manufacturer’s storage procedure and inspect the entire fuel system rather than treating every symptom as an ethanol problem." },
    ],
    sources: [{ label: "U.S. EPA: E15 fuel registration and permitted uses", url: "https://www.epa.gov/fuels-registration-reporting-and-compliance-help/e15-fuel-registration" }],
  },
  {
    slug: "outboard-maintenance-parts-checklist",
    category: "Boat maintenance",
    title: "Outboard maintenance: order parts by the exact engine, not horsepower alone",
    summary: "Oil filters, gear lube, fuel filters, impellers and service intervals can vary within the same horsepower range. Build the maintenance list from the engine identification and manual.",
    readTime: "6 min read",
    published: "September 27, 2026",
    sections: [
      { heading: "Identify the engine first", body: "Before ordering a maintenance kit, record the manufacturer, model, serial number and year information from the engine. Two outboards with the same advertised horsepower can use different filters, seals, fluids or service parts." },
      { heading: "Use the manufacturer schedule", body: "Mercury advises owners to follow the inspection and maintenance schedule in the applicable operation and maintenance manual. Hour-based service and seasonal storage can overlap, so check both instead of relying on a generic yearly checklist.", bullets: ["Engine oil and filter where applicable", "Gearcase lubricant and drain-plug seals", "Fuel filters and water-separating filters", "Cooling-system inspection and water-pump service", "Propeller removal and inspection for fishing line or seal damage"] },
      { heading: "Confirm before opening packages", body: "Compare every part number and fluid specification with the manual or an authorized parts catalog. Keep receipts and packaging until the engine has been serviced and checked for leaks." },
    ],
    sources: [{ label: "Mercury Marine: Maintenance Made Easy", url: "https://www.mercurymarine.com/us/en/service-and-support/owners-resources/maintenance-made-easy" }, { label: "Mercury Marine: Outboard care resources", url: "https://www.mercurymarine.com/us/en/service-and-support/owners-resources/how-to/outboard-care" }],
  },
  {
    slug: "boat-engine-cutoff-switch-safety-check",
    category: "Boat safety",
    title: "The engine cut-off switch only helps when the operator uses it",
    summary: "A working lanyard or wireless engine cut-off device can stop propulsion if the operator is thrown away from the controls. Test it and connect it before getting underway.",
    readTime: "4 min read",
    published: "September 27, 2026",
    sections: [
      { heading: "Why the device matters", body: "The U.S. Coast Guard explains that an engine cut-off switch can shut down the engine when the operator is separated from the operating area. Stopping propulsion may reduce the risk from an uncontrolled boat and spinning propeller." },
      { heading: "Make it part of departure", body: "A lanyard left wrapped around the control does not protect the operator. Attach it as directed, or confirm that the approved wireless device is paired and active before leaving idle speed.", bullets: ["Inspect the clip, cord and switch for damage", "Test operation according to the manufacturer instructions", "Keep an appropriate replacement aboard", "Explain restart procedures to another capable passenger"] },
      { heading: "Check the rules for the boat", body: "Equipment and use requirements can depend on the vessel and how it is operated. Review current Coast Guard guidance and applicable state rules rather than relying on what a previous owner did." },
    ],
    sources: [{ label: "U.S. Coast Guard: Engine cut-off switches", url: "https://uscgboating.org/recreational-boaters/engine-cut-off-devices.php" }],
  },
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

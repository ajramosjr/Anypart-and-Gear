import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, ShieldCheck, Star, Store, Upload } from "lucide-react";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ApgLogo from "@/components/apg-logo";
import ContactShop from "./contact-shop";
import ReportDirectory from "./report-directory";

export const dynamic = "force-dynamic";
type Shop = { id: string; owner_id: string; name: string; specialty: string; location: string; postal_code: string };
type Post = { id: string; shop_id: string; category: string; caption: string; image_url: string; price: number | null };
const categories = ["All", "Auto", "Marine", "Motorcycle", "Tools", "Equipment", "RC & Hobby", "Other"];

const directoryGroups = ["Mechanic Shops", "All Parts Suppliers", "Parts Suppliers", "Auto Parts Suppliers", "Truck & Diesel Parts Suppliers", "Marine Parts Suppliers", "Equipment Parts Suppliers", "RC & Hobby Parts Suppliers", "Machine & Fabrication Shops", "A/C & Cooling Shops", "Hydraulic & Hose Shops", "Transmission Shops", "Marine Shops", "Motorcycle Shops", "Motorcycle Parts Suppliers", "Collision & Body Shops", "Hobby Shops", "Salvage & Recycling"];
const directoryBusinesses = [
  {
    "name": "Joseph's Service & Collision",
    "address": "3458 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Auto diagnostics, maintenance, mechanical repairs and collision service.",
    "website": "https://www.josephsservice.com/",
    "phone": "516-679-8944",
    "directoryGroup": "Mechanic Shops",
    "county": "Nassau",
    "sourceUrl": "https://www.josephsservice.com/",
    "checkedOn": "2026-10-09",
    "town": "Seaford",
    "postal_code": "11783",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Sunrise Tire & Auto Repair — Seaford",
    "address": "4066 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Tires, wheel alignment, brakes, diagnostics and general auto maintenance.",
    "website": "https://www.sunrisetire.net/Find-Us/Mode/3/4066-Merrick-Rd-Seaford-NY-11783/details",
    "phone": "516-785-6015",
    "directoryGroup": "Mechanic Shops",
    "county": "Nassau",
    "sourceUrl": "https://www.sunrisetire.net/Find-Us/Mode/3/4066-Merrick-Rd-Seaford-NY-11783/details",
    "checkedOn": "2026-10-09",
    "town": "Seaford",
    "postal_code": "11783",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Toyota of Massapequa — Parts & Service",
    "address": "3660 Sunrise Highway, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Toyota parts department and vehicle maintenance and repair services.",
    "website": "https://www.toyotaofmassapequany.com/parts-department",
    "phone": "516-981-4100",
    "directoryGroup": "Auto Parts Suppliers",
    "county": "Nassau",
    "sourceUrl": "https://www.toyotaofmassapequany.com/parts-department",
    "checkedOn": "2026-10-09",
    "town": "Seaford",
    "postal_code": "11783",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Final Touch Auto Collision — Seaford",
    "address": "3586 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Collision, body, frame and mechanical repair services.",
    "website": "https://www.finaltouchli.com/contact/",
    "phone": "516-221-7611",
    "directoryGroup": "Collision & Body Shops",
    "county": "Nassau",
    "sourceUrl": "https://www.finaltouchli.com/contact/",
    "checkedOn": "2026-10-09",
    "town": "Seaford",
    "postal_code": "11783",
    "directoryTypes": [
      "Collision & Body Shops"
    ]
  },
  {
    "name": "Masters Auto Collision — Seaford",
    "address": "3530 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Auto body and collision repairs, painting and towing services.",
    "website": "https://www.masterscollision.com/services/",
    "phone": "516-826-2763",
    "directoryGroup": "Collision & Body Shops",
    "county": "Nassau",
    "sourceUrl": "https://www.masterscollision.com/services/",
    "checkedOn": "2026-10-09",
    "town": "Seaford",
    "postal_code": "11783",
    "directoryTypes": [
      "Collision & Body Shops"
    ]
  },
  {
    "name": "Jiffy Lube — Seaford",
    "address": "3848 Merrick Road, Seaford, NY 11783",
    "category": "Auto",
    "detail": "Oil changes and vehicle preventive maintenance. Contact the location for available services.",
    "website": "https://www.jiffylube.com/locations/ny/seaford/815",
    "phone": "516-783-4324",
    "directoryGroup": "Mechanic Shops",
    "county": "Nassau",
    "sourceUrl": "https://www.jiffylube.com/locations/ny/seaford/815",
    "checkedOn": "2026-10-09",
    "town": "Seaford",
    "postal_code": "11783",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Blue Marlin Boats",
    "address": "4076 Merrick Road, Seaford, NY 11783",
    "category": "Marine",
    "detail": "Boat parts and accessories, maintenance and repair services.",
    "website": "https://www.bluemarlinboats.net/we-offer-great-variety-of-boats-dealership--parts",
    "phone": "516-679-2121",
    "directoryGroup": "Marine Shops",
    "county": "Nassau",
    "sourceUrl": "https://www.bluemarlinboats.net/we-offer-great-variety-of-boats-dealership--parts",
    "checkedOn": "2026-10-09",
    "town": "Seaford",
    "postal_code": "11783",
    "directoryTypes": [
      "Marine Shops",
      "Marine Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Jetmore Jetski",
    "address": "3726 Ocean Avenue, Seaford, NY 11783",
    "category": "Marine",
    "detail": "Jet ski and jet boat repairs, mobile service, winterization and storage.",
    "website": "https://jetmorejetski.com/",
    "phone": "516-765-1861",
    "directoryGroup": "Marine Shops",
    "county": "Nassau",
    "sourceUrl": "https://jetmorejetski.com/",
    "checkedOn": "2026-10-09",
    "town": "Seaford",
    "postal_code": "11783",
    "directoryTypes": [
      "Marine Shops"
    ]
  },
  {
    "name": "Matt's Marina",
    "address": "2740 Peconic Avenue, Seaford, NY 11783",
    "category": "Marine",
    "detail": "Marina storage, dockage, maintenance, repairs and repowers.",
    "website": "https://mattsmarinali.com/",
    "phone": "516-324-6819",
    "directoryGroup": "Marine Shops",
    "county": "Nassau",
    "sourceUrl": "https://mattsmarinali.com/",
    "checkedOn": "2026-10-09",
    "town": "Seaford",
    "postal_code": "11783",
    "directoryTypes": [
      "Marine Shops"
    ]
  },
  {
    "name": "Nassau Hobby Center",
    "address": "13 W Merrick Road, Freeport, NY 11520",
    "detail": "RC parts, power and control accessories, drones, helicopters, planes, cars, trucks and boats.",
    "website": "https://nassauhobby.com/",
    "phone": "516-378-9594",
    "category": "RC & Hobby",
    "directoryGroup": "Hobby Shops",
    "county": "Nassau",
    "sourceUrl": "https://nassauhobby.com/",
    "checkedOn": "2026-10-09",
    "town": "Freeport",
    "postal_code": "11520",
    "directoryTypes": [
      "Hobby Shops",
      "RC & Hobby Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Willis Hobbies",
    "address": "300 Willis Avenue, Mineola, NY 11501",
    "detail": "RC and model hobby products, parts and accessories.",
    "website": "https://willishobbies.com/",
    "phone": "516-746-3944",
    "category": "RC & Hobby",
    "directoryGroup": "Hobby Shops",
    "county": "Nassau",
    "sourceUrl": "https://willishobbies.com/",
    "checkedOn": "2026-10-09",
    "town": "Mineola",
    "postal_code": "11501",
    "directoryTypes": [
      "Hobby Shops",
      "RC & Hobby Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Moreland Hose — Hempstead",
    "address": "135 Adams Ave, Hempstead, NY 11550",
    "category": "Equipment",
    "directoryGroup": "Hydraulic & Hose Shops",
    "detail": "Hydraulic, industrial, marine and automotive hose assemblies and fittings.",
    "website": "https://morelandhose.com/contact/",
    "phone": "516-844-0294",
    "county": "Nassau",
    "sourceUrl": "https://morelandhose.com/contact/",
    "checkedOn": "2026-10-09",
    "town": "Hempstead",
    "postal_code": "11550",
    "directoryTypes": [
      "Hydraulic & Hose Shops"
    ]
  },
  {
    "name": "Moreland Hose — Oakdale",
    "address": "4118 Sunrise Hwy, Oakdale, NY 11769",
    "category": "Equipment",
    "directoryGroup": "Hydraulic & Hose Shops",
    "detail": "Custom hydraulic and industrial hoses, fittings and on-site fabrication.",
    "website": "https://morelandhose.com/contact/",
    "phone": "631-349-2973",
    "county": "Suffolk",
    "sourceUrl": "https://morelandhose.com/contact/",
    "checkedOn": "2026-10-09",
    "town": "Oakdale",
    "postal_code": "11769",
    "directoryTypes": [
      "Hydraulic & Hose Shops"
    ]
  },
  {
    "name": "Long Island Hose Company",
    "address": "3 Rockwood Ave, Massapequa, NY 11758",
    "category": "Equipment",
    "directoryGroup": "Hydraulic & Hose Shops",
    "detail": "Hydraulic, auto, truck and marine hoses, fittings and custom assemblies.",
    "website": "https://longislandhose.com/",
    "phone": "516-855-0155",
    "county": "Nassau",
    "sourceUrl": "https://longislandhose.com/",
    "checkedOn": "2026-10-09",
    "town": "Massapequa",
    "postal_code": "11758",
    "directoryTypes": [
      "Hydraulic & Hose Shops"
    ]
  },
  {
    "name": "Buxton Machining & Fabricating",
    "address": "289 Knickerbocker Ave, Bohemia, NY 11716",
    "category": "Equipment",
    "directoryGroup": "Machine & Fabrication Shops",
    "detail": "CNC and manual machining, welding, metal fabrication and prototype parts.",
    "website": "https://buxtonmachine.com/",
    "phone": "631-218-2791",
    "county": "Suffolk",
    "sourceUrl": "https://buxtonmachine.com/",
    "checkedOn": "2026-10-09",
    "town": "Bohemia",
    "postal_code": "11716",
    "directoryTypes": [
      "Machine & Fabrication Shops"
    ]
  },
  {
    "name": "Pronto Manufacturing",
    "address": "50 Remington Blvd, Ronkonkoma, NY 11779",
    "category": "Equipment",
    "directoryGroup": "Machine & Fabrication Shops",
    "detail": "CNC milling and turning, tool and die work and metal stamping.",
    "website": "https://www.prontomfg.com/contact-us",
    "phone": "631-981-8920",
    "county": "Suffolk",
    "sourceUrl": "https://www.prontomfg.com/contact-us",
    "checkedOn": "2026-10-09",
    "town": "Ronkonkoma",
    "postal_code": "11779",
    "directoryTypes": [
      "Machine & Fabrication Shops"
    ]
  },
  {
    "name": "Hunter Metal Industries",
    "address": "14 Hewlett Ave, East Patchogue, NY 11772",
    "category": "Equipment",
    "directoryGroup": "Machine & Fabrication Shops",
    "detail": "Metal cutting, forming, welding, coating and component fabrication.",
    "website": "https://huntermetalindustries.com/",
    "phone": "631-475-5900",
    "county": "Suffolk",
    "sourceUrl": "https://huntermetalindustries.com/",
    "checkedOn": "2026-10-09",
    "town": "East Patchogue",
    "postal_code": "11772",
    "directoryTypes": [
      "Machine & Fabrication Shops"
    ]
  },
  {
    "name": "Mid Island Steel",
    "address": "295 Middle Island Rd, Medford, NY 11763",
    "category": "Equipment",
    "directoryGroup": "Machine & Fabrication Shops",
    "detail": "Steel supply, custom metal fabrication, sheet metal and welding.",
    "website": "https://midislandsteel.com/contact/",
    "phone": "631-696-0066",
    "county": "Suffolk",
    "sourceUrl": "https://midislandsteel.com/contact/",
    "checkedOn": "2026-10-09",
    "town": "Medford",
    "postal_code": "11763",
    "directoryTypes": [
      "Machine & Fabrication Shops"
    ]
  },
  {
    "name": "Midhampton Welding",
    "address": "20 Enterprise Zone Drive, Unit D, Riverhead, NY 11901",
    "category": "Equipment",
    "directoryGroup": "Machine & Fabrication Shops",
    "detail": "Custom welding, metal fabrication and equipment and trailer repairs. Call ahead.",
    "website": "https://www.midhampton.com/",
    "phone": "631-375-3422",
    "county": "Suffolk",
    "sourceUrl": "https://www.midhampton.com/",
    "checkedOn": "2026-10-09",
    "town": "Riverhead",
    "postal_code": "11901",
    "directoryTypes": [
      "Machine & Fabrication Shops"
    ]
  },
  {
    "name": "All Island Marine",
    "address": "480 Reina Road, Oceanside, NY 11572",
    "category": "Marine",
    "directoryGroup": "Marine Shops",
    "detail": "Marine engine parts, repairs, repowers, boat maintenance and storage.",
    "website": "https://allisland.com/contact-us/",
    "phone": "516-764-3300",
    "county": "Nassau",
    "sourceUrl": "https://allisland.com/contact-us/",
    "checkedOn": "2026-10-09",
    "town": "Oceanside",
    "postal_code": "11572",
    "directoryTypes": [
      "Marine Shops",
      "Marine Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Peconic Marine",
    "address": "46770 County Rd 48, Southold, NY 11971",
    "category": "Marine",
    "directoryGroup": "Marine Shops",
    "detail": "Boat parts, maintenance, service and storage.",
    "website": "https://peconicmarine.com/contact/",
    "phone": "631-640-8833",
    "county": "Suffolk",
    "sourceUrl": "https://peconicmarine.com/contact/",
    "checkedOn": "2026-10-09",
    "town": "Southold",
    "postal_code": "11971",
    "directoryTypes": [
      "Marine Shops",
      "Marine Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Port of Egypt Marine",
    "address": "62300 Main Rd, Southold, NY 11971",
    "category": "Marine",
    "directoryGroup": "Marine Shops",
    "detail": "Boat service, marine parts and supplies, dockage and storage.",
    "website": "https://www.poemarine.com/hours",
    "phone": "631-765-2445",
    "county": "Suffolk",
    "sourceUrl": "https://www.poemarine.com/hours",
    "checkedOn": "2026-10-09",
    "town": "Southold",
    "postal_code": "11971",
    "directoryTypes": [
      "Marine Shops",
      "Marine Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Long Island Heavy Equipment Parts",
    "address": "1581 Route 112, Unit B, Port Jefferson Station, NY 11776",
    "category": "Equipment",
    "directoryGroup": "Equipment Parts Suppliers",
    "detail": "Replacement parts for heavy equipment and construction machinery.",
    "website": "https://www.liheavyequipmentparts.com/contact-us",
    "phone": "631-468-8851",
    "county": "Suffolk",
    "sourceUrl": "https://www.liheavyequipmentparts.com/contact-us",
    "checkedOn": "2026-10-09",
    "town": "Port Jefferson Station",
    "postal_code": "11776",
    "directoryTypes": [
      "Parts Suppliers",
      "Equipment Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Arch Auto Parts — Elmont",
    "address": "1239 Hempstead Tpke, Elmont, NY 11003",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts and supplies. Contact the store for stock.",
    "website": "https://archautoparts.com/locations/",
    "phone": "516-354-3888",
    "county": "Nassau",
    "sourceUrl": "https://archautoparts.com/locations/",
    "checkedOn": "2026-10-09",
    "town": "Elmont",
    "postal_code": "11003",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Arch Auto Parts — Inwood",
    "address": "165 Sheridan Blvd, Inwood, NY 11096",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts and supplies. Contact the store for stock.",
    "website": "https://archautoparts.com/locations/",
    "phone": "516-239-8998",
    "county": "Nassau",
    "sourceUrl": "https://archautoparts.com/locations/",
    "checkedOn": "2026-10-09",
    "town": "Inwood",
    "postal_code": "11096",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Arch Auto Parts — Mineola",
    "address": "290 Willis Ave, Mineola, NY 11501",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts and supplies. Contact the store for stock.",
    "website": "https://archautoparts.com/locations/",
    "phone": "516-625-0940",
    "county": "Nassau",
    "sourceUrl": "https://archautoparts.com/locations/",
    "checkedOn": "2026-10-09",
    "town": "Mineola",
    "postal_code": "11501",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Arch Auto Parts — Plainview",
    "address": "125 Newtown Rd, Plainview, NY 11803",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts and supplies. Contact the store for stock.",
    "website": "https://archautoparts.com/locations/",
    "phone": "516-631-0100",
    "county": "Nassau",
    "sourceUrl": "https://archautoparts.com/locations/",
    "checkedOn": "2026-10-09",
    "town": "Plainview",
    "postal_code": "11803",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Tinker Auto Parts — Brentwood (200 Suffolk Ave)",
    "address": "200 Suffolk Ave, Brentwood, NY 11717",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive parts, tools and equipment for retail and wholesale customers.",
    "website": "https://www.tinkerautoparts.net/",
    "phone": "631-273-1771",
    "county": "Suffolk",
    "sourceUrl": "https://www.tinkerautoparts.net/",
    "checkedOn": "2026-10-09",
    "town": "Brentwood",
    "postal_code": "11717",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Tinker Auto Parts — Brentwood (1091 Suffolk Ave)",
    "address": "1091 Suffolk Ave, Brentwood, NY 11717",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive parts, tools and equipment for retail and wholesale customers.",
    "website": "https://www.tinkerautoparts.net/",
    "phone": "631-952-0980",
    "county": "Suffolk",
    "sourceUrl": "https://www.tinkerautoparts.net/",
    "checkedOn": "2026-10-09",
    "town": "Brentwood",
    "postal_code": "11717",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Tinker Auto Parts — Bay Shore (199 5th Ave)",
    "address": "199 5th Ave, Bay Shore, NY 11706",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive parts, tools and equipment for retail and wholesale customers.",
    "website": "https://www.tinkerautoparts.net/",
    "phone": "631-665-0700",
    "county": "Suffolk",
    "sourceUrl": "https://www.tinkerautoparts.net/",
    "checkedOn": "2026-10-09",
    "town": "Bay Shore",
    "postal_code": "11706",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Tinker Auto Parts — Bohemia (1650 Locust Ave)",
    "address": "1650 Locust Ave, Bohemia, NY 11716",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive parts, tools and equipment for retail and wholesale customers.",
    "website": "https://www.tinkerautoparts.net/",
    "phone": "631-567-1991",
    "county": "Suffolk",
    "sourceUrl": "https://www.tinkerautoparts.net/",
    "checkedOn": "2026-10-09",
    "town": "Bohemia",
    "postal_code": "11716",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Holbrook MTA Auto Service",
    "address": "397 Union Ave, Suite A, Holbrook, NY 11741",
    "category": "Auto",
    "directoryGroup": "A/C & Cooling Shops",
    "detail": "Automotive air conditioning, heating and cooling repairs; general auto service.",
    "website": "https://www.holbrookmta.com/AC-repair-Holbrook.html",
    "phone": "631-585-6656",
    "county": "Suffolk",
    "sourceUrl": "https://www.holbrookmta.com/AC-repair-Holbrook.html",
    "checkedOn": "2026-10-09",
    "town": "Holbrook",
    "postal_code": "11741",
    "directoryTypes": [
      "A/C & Cooling Shops"
    ]
  },
  {
    "name": "East Coast Transmissions",
    "address": "1015A North Wellwood Avenue, North Lindenhurst, NY 11757",
    "category": "Auto",
    "directoryGroup": "Transmission Shops",
    "detail": "Transmission service and general auto and truck repairs.",
    "website": "https://transmissionslongisland.com/",
    "phone": "631-841-0895",
    "county": "Suffolk",
    "sourceUrl": "https://transmissionslongisland.com/",
    "checkedOn": "2026-10-09",
    "town": "North Lindenhurst",
    "postal_code": "11757",
    "directoryTypes": [
      "Transmission Shops"
    ]
  },
  {
    "name": "Sunrise Transmission",
    "address": "2877 Sunrise Highway, Islip Terrace, NY 11752",
    "category": "Auto",
    "directoryGroup": "Transmission Shops",
    "detail": "Transmission repairs, axles, transfer cases and torque converters.",
    "website": "https://www.sunrisetransmissionny.com/",
    "phone": "631-277-4433",
    "county": "Suffolk",
    "sourceUrl": "https://www.sunrisetransmissionny.com/",
    "checkedOn": "2026-10-09",
    "town": "Islip Terrace",
    "postal_code": "11752",
    "directoryTypes": [
      "Transmission Shops"
    ]
  },
  {
    "name": "Sunny's Transmissions",
    "address": "3375 Lawson Blvd, Oceanside, NY 11572",
    "category": "Auto",
    "directoryGroup": "Transmission Shops",
    "detail": "Automotive transmission repairs and rebuilds.",
    "website": "https://www.sunnystransmission.com/",
    "phone": "516-239-2600",
    "county": "Nassau",
    "sourceUrl": "https://www.sunnystransmission.com/",
    "checkedOn": "2026-10-09",
    "town": "Oceanside",
    "postal_code": "11572",
    "directoryTypes": [
      "Transmission Shops"
    ]
  },
  {
    "name": "Star Transmissions",
    "address": "994 Fulton St, Farmingdale, NY 11735",
    "category": "Auto",
    "directoryGroup": "Transmission Shops",
    "detail": "Transmission diagnosis, repairs and rebuilds.",
    "website": "https://startransmissions.com/",
    "phone": "516-962-0619",
    "county": "Nassau",
    "sourceUrl": "https://startransmissions.com/",
    "checkedOn": "2026-10-09",
    "town": "Farmingdale",
    "postal_code": "11735",
    "directoryTypes": [
      "Transmission Shops"
    ]
  },
  {
    "name": "F & J Transmissions",
    "address": "188-3 Frowein Rd, East Moriches, NY 11940",
    "category": "Auto",
    "directoryGroup": "Transmission Shops",
    "detail": "Transmission and general auto repairs.",
    "website": "https://www.fjautomotivecenter.com/contact",
    "phone": "631-874-3417",
    "county": "Suffolk",
    "sourceUrl": "https://www.fjautomotivecenter.com/contact",
    "checkedOn": "2026-10-09",
    "town": "East Moriches",
    "postal_code": "11940",
    "directoryTypes": [
      "Transmission Shops"
    ]
  },
  {
    "name": "Long Island Motorcycle Connect",
    "address": "1290 Flanders Road, Suite B, Flanders, NY 11901",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Motorcycle repair, performance work, parts and apparel.",
    "website": "https://www.longislandmotorcycleconnect.com/contact",
    "phone": "631-508-0518",
    "county": "Suffolk",
    "sourceUrl": "https://www.longislandmotorcycleconnect.com/contact",
    "checkedOn": "2026-10-09",
    "town": "Flanders",
    "postal_code": "11901",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Triumph & Royal Enfield Nassau County",
    "address": "853 Sunrise Highway, Bellmore, NY 11710",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Motorcycle parts, accessories, maintenance, repairs and customization.",
    "website": "https://triumphnassaucounty.com/service-and-maintenance",
    "phone": "516-409-1010",
    "county": "Nassau",
    "sourceUrl": "https://triumphnassaucounty.com/service-and-maintenance",
    "checkedOn": "2026-10-09",
    "town": "Bellmore",
    "postal_code": "11710",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Long Island Kawasaki Yamaha",
    "address": "67 N Broadway, Hicksville, NY 11801",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Motorcycle, ATV and personal watercraft parts and service.",
    "website": "https://www.likawasaki.com/",
    "phone": "516-935-6969",
    "county": "Nassau",
    "sourceUrl": "https://www.likawasaki.com/",
    "checkedOn": "2026-10-09",
    "town": "Hicksville",
    "postal_code": "11801",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Bay Shore Hobbies & Toys",
    "address": "2056 Sunrise Hwy, Bay Shore, NY 11706",
    "category": "RC & Hobby",
    "directoryGroup": "Hobby Shops",
    "detail": "RC vehicles, parts, model kits and hobby supplies.",
    "website": "https://bayshorehobbiesandtoys.com/",
    "phone": "631-968-8547",
    "county": "Suffolk",
    "sourceUrl": "https://bayshorehobbiesandtoys.com/",
    "checkedOn": "2026-10-09",
    "town": "Bay Shore",
    "postal_code": "11706",
    "directoryTypes": [
      "Hobby Shops",
      "RC & Hobby Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Acme Radiator",
    "address": "49 Carleton Avenue, Islip Terrace, NY 11752",
    "category": "Auto",
    "directoryGroup": "A/C & Cooling Shops",
    "detail": "Vehicle air conditioning, heating, radiator and cooling system repairs.",
    "website": "https://www.acmeradiator.shop/local-home",
    "phone": "631-581-9199",
    "county": "Suffolk",
    "sourceUrl": "https://www.acmeradiator.shop/local-home",
    "checkedOn": "2026-10-09",
    "town": "Islip Terrace",
    "postal_code": "11752",
    "directoryTypes": [
      "A/C & Cooling Shops"
    ]
  },
  {
    "name": "Alpha Manufacturing Corporation",
    "address": "152 Verdi Street, Farmingdale, NY 11735",
    "category": "Equipment",
    "directoryGroup": "Machine & Fabrication Shops",
    "detail": "CNC machining and precision components for industrial applications.",
    "website": "https://alphamfgcorp.com/contact-us",
    "phone": "631-249-3700",
    "county": "Suffolk",
    "sourceUrl": "https://alphamfgcorp.com/contact-us",
    "checkedOn": "2026-10-09",
    "town": "Farmingdale",
    "postal_code": "11735",
    "directoryTypes": [
      "Machine & Fabrication Shops"
    ]
  },
  {
    "name": "RS Precision",
    "address": "295 Adams Blvd, Farmingdale, NY 11735",
    "category": "Equipment",
    "directoryGroup": "Machine & Fabrication Shops",
    "detail": "Precision CNC machining and manufacturing.",
    "website": "https://www.rsprecision.com/contact/",
    "phone": "631-249-2600",
    "county": "Suffolk",
    "sourceUrl": "https://www.rsprecision.com/contact/",
    "checkedOn": "2026-10-09",
    "town": "Farmingdale",
    "postal_code": "11735",
    "directoryTypes": [
      "Machine & Fabrication Shops"
    ]
  },
  {
    "name": "JL Machining & Tooling",
    "address": "17 Field Street, Unit C, West Babylon, NY 11704",
    "category": "Equipment",
    "directoryGroup": "Machine & Fabrication Shops",
    "detail": "CNC milling, precision parts and prototype machining. By appointment.",
    "website": "https://jlmachining.co/",
    "phone": "516-266-6215",
    "county": "Suffolk",
    "sourceUrl": "https://jlmachining.co/",
    "checkedOn": "2026-10-09",
    "town": "West Babylon",
    "postal_code": "11704",
    "directoryTypes": [
      "Machine & Fabrication Shops"
    ]
  },
  {
    "name": "Southold Marine Center",
    "address": "49900 Route 25, Southold, NY 11971",
    "category": "Marine",
    "directoryGroup": "Marine Shops",
    "detail": "Marine services and supplies. Contact the business for available services.",
    "website": "https://www.southoldmarine.com/contact",
    "phone": "631-765-3131",
    "county": "Suffolk",
    "sourceUrl": "https://www.southoldmarine.com/contact",
    "checkedOn": "2026-10-09",
    "town": "Southold",
    "postal_code": "11971",
    "directoryTypes": [
      "Marine Shops"
    ]
  },
  {
    "name": "Bay Auto Parts & Recycling",
    "address": "360 Atlantic Ave, Bellport, NY 11713",
    "category": "Auto",
    "directoryGroup": "Salvage & Recycling",
    "detail": "Used automotive replacement parts and vehicle recycling.",
    "website": "https://www.bayautony.com/contact.html",
    "phone": "631-286-4500",
    "county": "Suffolk",
    "sourceUrl": "https://www.bayautony.com/contact.html",
    "checkedOn": "2026-10-09",
    "town": "Bellport",
    "postal_code": "11713",
    "directoryTypes": [
      "Salvage & Recycling",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Sunrise Tire & Auto Repair — Massapequa Park",
    "address": "4900 Sunrise Hwy, Massapequa Park, NY 11762",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Tires, wheels, diagnostics and general automotive repairs.",
    "website": "https://www.sunrisetire.net/Find-Us",
    "phone": "516-798-1400",
    "county": "Nassau",
    "sourceUrl": "https://www.sunrisetire.net/Find-Us",
    "checkedOn": "2026-10-09",
    "town": "Massapequa Park",
    "postal_code": "11762",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Nassau Shores Auto Repair",
    "address": "5200 Merrick Road, Massapequa, NY 11758",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repairs, tires and preventive maintenance.",
    "website": "https://www.sunrisetire.net/Find-Us",
    "phone": "516-799-8525",
    "county": "Nassau",
    "sourceUrl": "https://www.sunrisetire.net/Find-Us",
    "checkedOn": "2026-10-09",
    "town": "Massapequa",
    "postal_code": "11758",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "K&K Automotive",
    "address": "353 Long Beach Road, South Hempstead, NY 11550",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repairs, tires, diagnostics, air conditioning and maintenance.",
    "website": "https://www.kkautomotiveinc.com/locations",
    "phone": "516-483-7168",
    "county": "Nassau",
    "sourceUrl": "https://www.kkautomotiveinc.com/locations",
    "checkedOn": "2026-10-09",
    "town": "South Hempstead",
    "postal_code": "11550",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "K&K Auto & Tire",
    "address": "300 Hempstead Avenue, West Hempstead, NY 11552",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repairs, tires, diagnostics, air conditioning and maintenance.",
    "website": "https://www.kkautomotiveinc.com/locations",
    "phone": "516-538-5500",
    "county": "Nassau",
    "sourceUrl": "https://www.kkautomotiveinc.com/locations",
    "checkedOn": "2026-10-09",
    "town": "West Hempstead",
    "postal_code": "11552",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "K&K Auto & Tire Center",
    "address": "176 Hendrickson Avenue, Lynbrook, NY 11563",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repairs, tires, diagnostics, air conditioning and maintenance.",
    "website": "https://www.kkautomotiveinc.com/locations",
    "phone": "516-599-4700",
    "county": "Nassau",
    "sourceUrl": "https://www.kkautomotiveinc.com/locations",
    "checkedOn": "2026-10-09",
    "town": "Lynbrook",
    "postal_code": "11563",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "T&V Automotive Concepts",
    "address": "198 North Long Beach Road, Rockville Centre, NY 11570",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repairs, tires, diagnostics, air conditioning and maintenance.",
    "website": "https://www.kkautomotiveinc.com/locations",
    "phone": "516-763-1111",
    "county": "Nassau",
    "sourceUrl": "https://www.kkautomotiveinc.com/locations",
    "checkedOn": "2026-10-09",
    "town": "Rockville Centre",
    "postal_code": "11570",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "A & R Auto Repair",
    "address": "376 E Main St, Smithtown, NY 11787",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Auto diagnostics, brakes, inspections, air conditioning and maintenance.",
    "website": "https://www.arautocare.com/",
    "phone": "631-499-1994",
    "county": "Suffolk",
    "sourceUrl": "https://www.arautocare.com/",
    "checkedOn": "2026-10-09",
    "town": "Smithtown",
    "postal_code": "11787",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "TLC Auto & Truck Repair Center",
    "address": "230 NY-109, Farmingdale, NY 11735",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Car, truck, diesel and fleet repairs and maintenance.",
    "website": "https://tlcautotruck.com/",
    "phone": "631-753-2211",
    "county": "Suffolk",
    "sourceUrl": "https://tlcautotruck.com/",
    "checkedOn": "2026-10-09",
    "town": "Farmingdale",
    "postal_code": "11735",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Advance Auto Parts — Patchogue (282 Medford Ave)",
    "address": "282 Medford Ave, Patchogue, NY 11772",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries, accessories and maintenance supplies.",
    "website": "https://stores.advanceautoparts.com/ny/patchogue/282-medford-ave",
    "phone": "631-576-4243",
    "county": "Suffolk",
    "sourceUrl": "https://stores.advanceautoparts.com/ny/patchogue/282-medford-ave",
    "checkedOn": "2026-10-09",
    "town": "Patchogue",
    "postal_code": "11772",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Advance Auto Parts — Patchogue (252 E Main St)",
    "address": "252 E Main St, Patchogue, NY 11772",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries, accessories and maintenance supplies.",
    "website": "https://stores.advanceautoparts.com/ny/patchogue/252-e-main-st",
    "phone": "631-687-3490",
    "county": "Suffolk",
    "sourceUrl": "https://stores.advanceautoparts.com/ny/patchogue/252-e-main-st",
    "checkedOn": "2026-10-09",
    "town": "Patchogue",
    "postal_code": "11772",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Advance Auto Parts — Glen Cove (64 Forest Ave)",
    "address": "64 Forest Ave, Glen Cove, NY 11542",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries, accessories and maintenance supplies.",
    "website": "https://stores.advanceautoparts.com/ny/glen-cove/64-forest-ave",
    "phone": "516-686-9935",
    "county": "Nassau",
    "sourceUrl": "https://stores.advanceautoparts.com/ny/glen-cove/64-forest-ave",
    "checkedOn": "2026-10-09",
    "town": "Glen Cove",
    "postal_code": "11542",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Advance Auto Parts — Huntington Station (161 W Hills Rd)",
    "address": "161 W Hills Rd, Huntington Station, NY 11746",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries, accessories and maintenance supplies.",
    "website": "https://stores.advanceautoparts.com/ny/huntington-station/161-w-hills-rd",
    "phone": "631-479-3757",
    "county": "Suffolk",
    "sourceUrl": "https://stores.advanceautoparts.com/ny/huntington-station/161-w-hills-rd",
    "checkedOn": "2026-10-09",
    "town": "Huntington Station",
    "postal_code": "11746",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Advance Auto Parts — Huntington Station (619 E Jericho Tpke)",
    "address": "619 E Jericho Tpke, Huntington Station, NY 11746",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries, accessories and maintenance supplies.",
    "website": "https://stores.advanceautoparts.com/ny/huntington-station/619-e-jericho-tpke",
    "phone": "631-421-3151",
    "county": "Suffolk",
    "sourceUrl": "https://stores.advanceautoparts.com/ny/huntington-station/619-e-jericho-tpke",
    "checkedOn": "2026-10-09",
    "town": "Huntington Station",
    "postal_code": "11746",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Advance Auto Parts — Port Jefferson Station (5170 Nesconset Hwy)",
    "address": "5170 Nesconset Hwy, Port Jefferson Station, NY 11776",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries, accessories and maintenance supplies.",
    "website": "https://stores.advanceautoparts.com/ny/port-jefferson-station/5170-nesconset-hwy",
    "phone": "631-791-4036",
    "county": "Suffolk",
    "sourceUrl": "https://stores.advanceautoparts.com/ny/port-jefferson-station/5170-nesconset-hwy",
    "checkedOn": "2026-10-09",
    "town": "Port Jefferson Station",
    "postal_code": "11776",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Dietrich's Auto Repair",
    "address": "25 County Rd 39, Southampton, NY 11968",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repair and maintenance services.",
    "website": "https://www.dietrichsauto.com/contact",
    "phone": "631-204-0200",
    "county": "Suffolk",
    "sourceUrl": "https://www.dietrichsauto.com/contact",
    "checkedOn": "2026-10-09",
    "town": "Southampton",
    "postal_code": "11968",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Joe's Garage",
    "address": "1426 N Sea Rd, Southampton, NY 11968",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Auto repair, diagnostics, brakes and preventive maintenance.",
    "website": "https://www.joesgarageinc.net/",
    "phone": "631-283-2098",
    "county": "Suffolk",
    "sourceUrl": "https://www.joesgarageinc.net/",
    "checkedOn": "2026-10-09",
    "town": "Southampton",
    "postal_code": "11968",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "R&K Precision Autoworks",
    "address": "3241 Sound Avenue, Riverhead, NY 11901",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repairs, brakes, inspections and maintenance.",
    "website": "https://www.rkprecisionauto.com/contact/",
    "phone": "631-727-2223",
    "county": "Suffolk",
    "sourceUrl": "https://www.rkprecisionauto.com/contact/",
    "checkedOn": "2026-10-09",
    "town": "Riverhead",
    "postal_code": "11901",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Bock Auto",
    "address": "541 Montauk Highway, Amagansett, NY 11930",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repairs and maintenance services.",
    "website": "https://bockauto.com/",
    "phone": "631-267-5631",
    "county": "Suffolk",
    "sourceUrl": "https://bockauto.com/",
    "checkedOn": "2026-10-09",
    "town": "Amagansett",
    "postal_code": "11930",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Main Street Equipment",
    "address": "1794 W Main St, Riverhead, NY 11901",
    "category": "Equipment",
    "directoryGroup": "Hydraulic & Hose Shops",
    "detail": "Hydraulic cylinder repair, rod fabrication and custom hydraulic hoses.",
    "website": "https://www.mainstreetequipment.net/",
    "phone": "631-727-5027",
    "county": "Suffolk",
    "sourceUrl": "https://www.mainstreetequipment.net/",
    "checkedOn": "2026-10-09",
    "town": "Riverhead",
    "postal_code": "11901",
    "directoryTypes": [
      "Hydraulic & Hose Shops"
    ]
  },
  {
    "name": "Midway Auto Repair",
    "address": "551 Mastic Rd, Mastic Beach, NY 11951",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "General auto repairs, inspections, engine service and preventive maintenance.",
    "website": "https://morichesmidway.com/",
    "phone": "631-909-8111",
    "county": "Suffolk",
    "sourceUrl": "https://morichesmidway.com/",
    "checkedOn": "2026-10-09",
    "town": "Mastic Beach",
    "postal_code": "11951",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "C & C Automotive Repair of the Hamptons",
    "address": "172 W Montauk Hwy, Hampton Bays, NY 11946",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repairs, diagnostics, brakes and maintenance.",
    "website": "https://www.cncautohamptonbays.net/",
    "phone": "631-728-9018",
    "county": "Suffolk",
    "sourceUrl": "https://www.cncautohamptonbays.net/",
    "checkedOn": "2026-10-09",
    "town": "Hampton Bays",
    "postal_code": "11946",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Tire Country",
    "address": "1174 E Main St, Riverhead, NY 11901",
    "category": "Auto",
    "directoryGroup": "Mechanic Shops",
    "detail": "Automotive repairs, tires, brakes and maintenance.",
    "website": "https://www.tire-country.com/",
    "phone": "631-369-2600",
    "county": "Suffolk",
    "sourceUrl": "https://www.tire-country.com/",
    "checkedOn": "2026-10-09",
    "town": "Riverhead",
    "postal_code": "11901",
    "directoryTypes": [
      "Mechanic Shops"
    ]
  },
  {
    "name": "Hydraulic Repair & Hose",
    "address": "5 44th St, Islip, NY 11751",
    "category": "Equipment",
    "directoryGroup": "Hydraulic & Hose Shops",
    "detail": "Hydraulic parts, hose and cylinder repairs, machining and welding.",
    "website": "https://hydraulicrepairandhose.com/",
    "phone": "631-942-6479",
    "county": "Suffolk",
    "sourceUrl": "https://hydraulicrepairandhose.com/",
    "checkedOn": "2026-10-09",
    "town": "Islip",
    "postal_code": "11751",
    "directoryTypes": [
      "Hydraulic & Hose Shops"
    ]
  },
  {
    "name": "Crossbay Motorsports",
    "address": "1660 Sunrise Hwy, Bay Shore, NY 11706",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Motorcycle parts, accessories and powersports service.",
    "website": "https://www.crossbaymotorsports.com/Parts/Parts-Department",
    "phone": "631-206-6851",
    "county": "Suffolk",
    "sourceUrl": "https://www.crossbaymotorsports.com/Parts/Parts-Department",
    "checkedOn": "2026-10-09",
    "town": "Bay Shore",
    "postal_code": "11706",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Suffolk County Harley-Davidson",
    "address": "4020 Sunrise Hwy, Oakdale, NY 11769",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Harley-Davidson motorcycles, genuine parts and accessories.",
    "website": "https://hdsuffolk.com/parts",
    "phone": "631-244-9000",
    "county": "Suffolk",
    "sourceUrl": "https://hdsuffolk.com/parts",
    "checkedOn": "2026-10-09",
    "town": "Oakdale",
    "postal_code": "11769",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Formula One Motorsports",
    "address": "4030 Sunrise Hwy, Oakdale, NY 11769",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Motorcycle and powersports sales, parts, accessories and service.",
    "website": "https://www.formulaonemotorsports.com/",
    "phone": "631-244-7447",
    "county": "Suffolk",
    "sourceUrl": "https://www.formulaonemotorsports.com/",
    "checkedOn": "2026-10-09",
    "town": "Oakdale",
    "postal_code": "11769",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "CPM Motorsports",
    "address": "125 Middle Country Road, Coram, NY 11727",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Motorcycle repairs, parts, accessories and dyno tuning.",
    "website": "https://cpmmotorsportsinc.com/",
    "phone": "631-580-1301",
    "county": "Suffolk",
    "sourceUrl": "https://cpmmotorsportsinc.com/",
    "checkedOn": "2026-10-09",
    "town": "Coram",
    "postal_code": "11727",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Habberstad Powersports",
    "address": "390 E. Jericho Turnpike, Huntington Station, NY 11746",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Motorcycle and powersports parts, maintenance and repairs.",
    "website": "https://www.habberstadpowersports.com/service-repair-atvs-utvs-motorcycles-dealership--service",
    "phone": "631-427-4400",
    "county": "Suffolk",
    "sourceUrl": "https://www.habberstadpowersports.com/service-repair-atvs-utvs-motorcycles-dealership--service",
    "checkedOn": "2026-10-09",
    "town": "Huntington Station",
    "postal_code": "11746",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Island Powersports",
    "address": "4116 Sunrise Hwy, Massapequa, NY 11758",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Motorcycle, ATV and UTV parts, accessories and service.",
    "website": "https://www.islandpowersports.com/parts-atvs-utvs-motorcycles-dealership--parts",
    "phone": "516-795-4400",
    "county": "Nassau",
    "sourceUrl": "https://www.islandpowersports.com/parts-atvs-utvs-motorcycles-dealership--parts",
    "checkedOn": "2026-10-09",
    "town": "Massapequa",
    "postal_code": "11758",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Champion Honda",
    "address": "544 W Old Country Road, Hicksville, NY 11801",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Honda motorcycles, powersports parts and service.",
    "website": "https://www.champion-honda.com/",
    "phone": "516-433-6700",
    "county": "Nassau",
    "sourceUrl": "https://www.champion-honda.com/",
    "checkedOn": "2026-10-09",
    "town": "Hicksville",
    "postal_code": "11801",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Harley-Davidson of Nassau County",
    "address": "2428 Sunrise Hwy, Bellmore, NY 11710",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Harley-Davidson motorcycles, genuine parts, accessories and service.",
    "website": "https://nassaucountyharleydavidson.com/genuine-parts",
    "phone": "516-409-9200",
    "county": "Nassau",
    "sourceUrl": "https://nassaucountyharleydavidson.com/genuine-parts",
    "checkedOn": "2026-10-09",
    "town": "Bellmore",
    "postal_code": "11710",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Mineolamoto / Indian Motorcycle of Mineola",
    "address": "336 Jericho Turnpike, Mineola, NY 11501",
    "category": "Motorcycle",
    "directoryGroup": "Motorcycle Shops",
    "detail": "Motorcycle sales, service, parts and accessories.",
    "website": "https://www.indianmotorcycleofmineola.com/Dealer-Info/Map-Hours",
    "phone": "516-248-5555",
    "county": "Nassau",
    "sourceUrl": "https://www.indianmotorcycleofmineola.com/Dealer-Info/Map-Hours",
    "checkedOn": "2026-10-09",
    "town": "Mineola",
    "postal_code": "11501",
    "directoryTypes": [
      "Motorcycle Shops",
      "Motorcycle Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "NAPA Auto Parts — Port Washington",
    "address": "352 Port Washington Blvd, Port Washington, NY 11050",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive parts, hydraulic hoses and snow plow parts.",
    "website": "https://portnapa.com/contact/",
    "phone": "516-767-8100",
    "county": "Nassau",
    "sourceUrl": "https://portnapa.com/contact/",
    "checkedOn": "2026-10-09",
    "town": "Port Washington",
    "postal_code": "11050",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "NAPA Auto Parts — Franklin Square",
    "address": "261 Franklin Ave, Franklin Square, NY 11010",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries and maintenance supplies.",
    "website": "https://www.napaonline.com/en/ny/franklin-square/store/805304",
    "phone": "516-437-8281",
    "county": "Nassau",
    "sourceUrl": "https://www.napaonline.com/en/ny/franklin-square/store/805304",
    "checkedOn": "2026-10-09",
    "town": "Franklin Square",
    "postal_code": "11010",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "NAPA Quick Auto Parts — Hicksville",
    "address": "2 Bloomingdale Road, Hicksville, NY 11801",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries and maintenance supplies.",
    "website": "https://www.napaonline.com/en/ny/hicksville/store/32551",
    "phone": "516-938-4900",
    "county": "Nassau",
    "sourceUrl": "https://www.napaonline.com/en/ny/hicksville/store/32551",
    "checkedOn": "2026-10-09",
    "town": "Hicksville",
    "postal_code": "11801",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "NAPA Auto Parts — Ronkonkoma",
    "address": "206 Portion Road, Ronkonkoma, NY 11779",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries and maintenance supplies.",
    "website": "https://www.napaonline.com/en/ny/ronkonkoma/store/805755",
    "phone": "631-676-4300",
    "county": "Suffolk",
    "sourceUrl": "https://www.napaonline.com/en/ny/ronkonkoma/store/805755",
    "checkedOn": "2026-10-09",
    "town": "Ronkonkoma",
    "postal_code": "11779",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "NAPA Auto Parts — Massapequa",
    "address": "40 Brooklyn Ave, Massapequa, NY 11758",
    "category": "Auto",
    "directoryGroup": "Auto Parts Suppliers",
    "detail": "Automotive replacement parts, batteries and maintenance supplies.",
    "website": "https://www.napaonline.com/en/ny/massapequa/store/805752",
    "phone": "516-420-9060",
    "county": "Nassau",
    "sourceUrl": "https://www.napaonline.com/en/ny/massapequa/store/805752",
    "checkedOn": "2026-10-09",
    "town": "Massapequa",
    "postal_code": "11758",
    "directoryTypes": [
      "Parts Suppliers",
      "Auto Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Island Hobby Nut",
    "address": "1141 Jericho Turnpike, Suite 4, Commack, NY 11725",
    "category": "RC & Hobby",
    "directoryGroup": "Hobby Shops",
    "detail": "RC cars, trucks, boats and planes, replacement parts, upgrades and accessories.",
    "website": "https://islandhobbynut.com/",
    "phone": "646-560-0909",
    "county": "Suffolk",
    "sourceUrl": "https://www.northgateshops.com/stores/island-hobby-nut/",
    "checkedOn": "2026-10-09",
    "town": "Commack",
    "postal_code": "11725",
    "directoryTypes": [
      "Hobby Shops",
      "RC & Hobby Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "FleetPride — Medford (formerly Long Island Truck Parts)",
    "address": "3070 Route 112, Medford, NY 11763",
    "category": "Auto",
    "directoryGroup": "Truck & Diesel Parts Suppliers",
    "detail": "Parts supplier: medium- and heavy-duty truck and trailer replacement parts. Former Long Island Truck Parts location.",
    "website": "https://branches.fleetpride.com/ny/medford/truckparts-mdf.html",
    "phone": "631-736-3434",
    "county": "Suffolk",
    "sourceUrl": "https://branches.fleetpride.com/ny/medford/truckparts-mdf.html",
    "checkedOn": "2026-10-09",
    "town": "Medford",
    "postal_code": "11763",
    "directoryTypes": [
      "Truck & Diesel Parts Suppliers",
      "Auto Parts Suppliers",
      "Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "FleetPride — New Hyde Park (formerly Long Island Truck Parts)",
    "address": "23 Denton Ave, New Hyde Park, NY 11040",
    "category": "Auto",
    "directoryGroup": "Truck & Diesel Parts Suppliers",
    "detail": "Parts supplier: medium- and heavy-duty truck and trailer replacement parts. Former Long Island Truck Parts location.",
    "website": "https://branches.fleetpride.com/ny/newhydepark/truckparts-nhp.html",
    "phone": "516-519-8855",
    "county": "Nassau",
    "sourceUrl": "https://branches.fleetpride.com/ny/newhydepark/truckparts-nhp.html",
    "checkedOn": "2026-10-09",
    "town": "New Hyde Park",
    "postal_code": "11040",
    "directoryTypes": [
      "Truck & Diesel Parts Suppliers",
      "Auto Parts Suppliers",
      "Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "FleetPride — Riverhead (formerly Long Island Truck Parts)",
    "address": "121 Main Road, Riverhead, NY 11901",
    "category": "Auto",
    "directoryGroup": "Truck & Diesel Parts Suppliers",
    "detail": "Parts supplier: medium- and heavy-duty truck and trailer replacement parts. Former Long Island Truck Parts location.",
    "website": "https://branches.fleetpride.com/ny/riverhead/truckparts-riv.html",
    "phone": "631-369-5600",
    "county": "Suffolk",
    "sourceUrl": "https://branches.fleetpride.com/ny/riverhead/truckparts-riv.html",
    "checkedOn": "2026-10-09",
    "town": "Riverhead",
    "postal_code": "11901",
    "directoryTypes": [
      "Truck & Diesel Parts Suppliers",
      "Auto Parts Suppliers",
      "Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "FleetPride — West Babylon (formerly Long Island Truck Parts)",
    "address": "565 Sunrise Hwy, West Babylon, NY 11704",
    "category": "Auto",
    "directoryGroup": "Truck & Diesel Parts Suppliers",
    "detail": "Parts supplier: medium- and heavy-duty truck and trailer replacement parts. Former Long Island Truck Parts location.",
    "website": "https://branches.fleetpride.com/ny/westbabylon/truckparts-wba.html",
    "phone": "631-422-7060",
    "county": "Suffolk",
    "sourceUrl": "https://branches.fleetpride.com/ny/westbabylon/truckparts-wba.html",
    "checkedOn": "2026-10-09",
    "town": "West Babylon",
    "postal_code": "11704",
    "directoryTypes": [
      "Truck & Diesel Parts Suppliers",
      "Auto Parts Suppliers",
      "Parts Suppliers",
      "All Parts Suppliers"
    ]
  },
  {
    "name": "Mako Marine — Cummins Authorized Dealer",
    "address": "117 Hudson Avenue, Freeport, NY 11520",
    "category": "Marine",
    "directoryGroup": "Marine Shops",
    "detail": "Parts and service: Cummins and Volvo marine diesel engines, replacement parts, maintenance, repairs and repowers. Cummins authorized dealer.",
    "website": "https://makomarina.com/cummins-parts/",
    "phone": "516-378-7331",
    "county": "Nassau",
    "sourceUrl": "https://makomarina.com/",
    "checkedOn": "2026-10-09",
    "town": "Freeport",
    "postal_code": "11520",
    "directoryTypes": [
      "Marine Shops",
      "Marine Parts Suppliers",
      "All Parts Suppliers"
    ]
  }
];

export default async function ShopsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; location?: string; county?: string; type?: string }> }) {
  const [{ q = "", category = "All", location = "", county = "All", type = "All" }, user] = await Promise.all([searchParams, getUser()]);
  const supabase = await createClient();
  const [{ data: shopData }, { data: postData }] = await Promise.all([
    supabase.from("shops").select("id,owner_id,name,specialty,location,postal_code").eq("is_active", true),
    supabase.from("business_posts").select("id,shop_id,category,caption,image_url,price").order("created_at", { ascending: false }).limit(120),
  ]);
  const shops = (shopData || []) as Shop[];
  const posts = (postData || []) as Post[];
  const shopById = new Map(shops.map((shop) => [shop.id, shop]));
  const { data: reviewData } = shops.length
    ? await supabase.from("reviews").select("reviewee_id,rating").in("reviewee_id", shops.map((shop) => shop.owner_id))
    : { data: [] };
  const ratings = new Map<string, { count: number; sum: number }>();
  for (const review of reviewData || []) {
    const current = ratings.get(review.reviewee_id) || { count: 0, sum: 0 };
    ratings.set(review.reviewee_id, { count: current.count + 1, sum: current.sum + review.rating });
  }
  const term = q.trim().toLowerCase();
  const town = location.trim().toLowerCase();
  const selected = categories.includes(category) ? category : "All";
  const selectedCounty = ["Nassau", "Suffolk"].includes(county) ? county : "All";
  const selectedType = directoryGroups.includes(type) ? type : "All";
  const localResults = directoryBusinesses.filter((business) =>
    (selected === "All" || selected === business.category)
    && (selectedCounty === "All" || business.county === selectedCounty)
    && (selectedType === "All" || business.directoryTypes.includes(selectedType))
    && (!term || `${business.name} ${business.detail} ${business.directoryTypes.join(" ")} ${business.address}`.toLowerCase().includes(term))
    && (!town || business.town.toLowerCase().includes(town) || business.postal_code === town)
  ).sort((a, b) => a.town.localeCompare(b.town) || a.name.localeCompare(b.name));
  const towns = [...new Set(localResults.map((business) => business.town))];
  const locationChoices = [...new Set(directoryBusinesses.map((business) => `${business.town} (${business.postal_code})`))].sort();
  const filteredShops = shops.filter((shop) => (!term || `${shop.name} ${shop.specialty}`.toLowerCase().includes(term)) && (!town || `${shop.location} ${shop.postal_code}`.toLowerCase().includes(town)) && (selected === "All" || shop.specialty.toLowerCase().includes(selected.toLowerCase())));
  const queryLink = (overrides: Record<string, string>) => `/shops?${new URLSearchParams({ q, location, category: selected, county: selectedCounty, type: selectedType, ...overrides })}#long-island-directory`;
  const shown = posts.filter((post) => {
    const shop = shopById.get(post.shop_id);
    return shop && (selected === "All" || post.category === selected)
      && (!term || `${post.caption} ${shop.name} ${shop.specialty}`.toLowerCase().includes(term))
      && (!town || `${shop.location} ${shop.postal_code}`.toLowerCase().includes(town));
  });

  return <main className="min-h-screen bg-[#eef1f4] text-[#071a35]">
    <header className="simple-header"><div className="shell nav-wrap"><ApgLogo priority /><nav className="account-nav"><Link href="/marketplace">Marketplace</Link><Link aria-current="page" href="/shops">Parts &amp; Repair Directory</Link><Link href="/messages">Messages</Link></nav></div></header>
    <section className="bg-white"><div className="shell py-10 sm:py-14"><span className="kicker">Long Island parts and repair services</span><h1 className="mt-2 text-4xl font-black sm:text-5xl">Parts &amp; Repair Directory</h1><p className="mt-2 text-slate-600">Find parts suppliers, mechanic shops, machine shops, transmission specialists, hose &amp; hydraulic shops, salvage yards, and more.</p>
      <nav aria-label="Parts categories" className="mt-5 flex flex-wrap gap-2">{[{ label: "All Parts", type: "All Parts Suppliers" }, { label: "Auto Parts", type: "Auto Parts Suppliers" }, { label: "Truck & Diesel Parts", type: "Truck & Diesel Parts Suppliers" }, { label: "Marine Parts", type: "Marine Parts Suppliers" }, { label: "Motorcycle Parts", type: "Motorcycle Parts Suppliers" }, { label: "Equipment Parts", type: "Equipment Parts Suppliers" }, { label: "RC & Hobby Parts", type: "RC & Hobby Parts Suppliers" }].map((item) => <Link key={item.type} href={queryLink({ type: item.type, category: "All" })} aria-current={selectedType === item.type ? "page" : undefined} style={{ color: "#071a35" }} className={`rounded-full border px-4 py-2 text-sm font-bold ${selectedType === item.type ? "border-amber-500 bg-amber-400" : "border-slate-300 bg-white hover:border-amber-500"}`}>{item.label}</Link>)}</nav>
      <form action="/shops#long-island-directory" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"><input type="hidden" name="category" value={selected}/><label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3"><Search className="size-5 text-slate-500"/><input className="h-12 w-full outline-none" name="q" defaultValue={q} placeholder="Search suppliers, shops, parts or services" aria-label="Search businesses, parts and services" /></label><label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3"><MapPin className="size-5 text-slate-500"/><input className="h-12 w-full outline-none sm:w-36" name="location" defaultValue={location} placeholder="Town or ZIP" aria-label="Town or ZIP" list="directory-locations" /></label><datalist id="directory-locations">{locationChoices.map((value) => <option key={value} value={value.replace(/ \(.*$/, "")}>{value}</option>)}</datalist><select name="county" defaultValue={selectedCounty} aria-label="County" className="h-12 rounded-xl border border-slate-300 bg-white px-3"><option value="All">All counties</option><option>Nassau</option><option>Suffolk</option></select><select name="type" defaultValue={selectedType} aria-label="Business type" className="h-12 rounded-xl border border-slate-300 bg-white px-3"><option value="All">All shop types</option>{directoryGroups.map((group) => <option key={group}>{group}</option>)}</select><button className="button">Search</button></form>
      <nav aria-label="Parts and repair categories" className="mt-5 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <Link key={item} href={queryLink({ category: item })} aria-current={selected === item ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${selected === item ? "border-amber-500 bg-amber-400 text-[#071a35]" : "border-slate-300 bg-white text-slate-700"}`}>{item}</Link>)}</nav>
    </div></section>
    <div className="shell py-9">      <section id="long-island-directory" className="mt-10 scroll-mt-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-black">Long Island Parts &amp; Repair Businesses</h2>
        <p className="mt-2 text-slate-600">Browse Nassau and Suffolk businesses by town or ZIP, county and shop type. Independent listings are unclaimed and do not imply an APG partnership. Contact each business for current services and stock.</p>
        <p className="mt-2 text-sm text-slate-600">Coverage is growing; this is not a complete list of every Long Island business.</p>
        <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><strong>About these links:</strong> Business details checked refers to the listed business and its public contact information. Website links open an external site in a new tab. APG does not control those sites or guarantee website security, products or services.</p><div className="mt-5 flex flex-wrap items-center gap-3"><strong>{localResults.length} {localResults.length === 1 ? "business" : "businesses"} · {towns.length} {towns.length === 1 ? "town" : "towns"}</strong>{(q || location || selected !== "All" || selectedCounty !== "All" || selectedType !== "All") && <Link href="/shops#long-island-directory" className="text-sm font-bold underline">Clear filters</Link>}</div>
        <nav aria-label="Browse directory by town" className="mt-4 flex flex-wrap gap-2">{towns.map((name) => <a key={name} href={`#town-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold">{name}</a>)}</nav>
        {towns.length ? towns.map((name) => {
          const businesses = localResults.filter((business) => business.town === name);
          return <section key={name} id={`town-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="mt-8 scroll-mt-6"><h3 className="text-xl font-black">{name} <span className="text-sm font-semibold text-slate-500">{businesses[0].county} County · {[...new Set(businesses.map((business) => business.postal_code))].join(", ")}</span></h3>
          {(selectedType === "All" ? directoryGroups : [selectedType]).map((group) => { const grouped = businesses.filter((business) => selectedType === "All" ? business.directoryGroup === group : business.directoryTypes.includes(group)); return grouped.length ? <div key={group} className="mt-5"><h4 className="font-black text-slate-700">{group}</h4><div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{grouped.map((business) => <article key={`${business.name}-${business.address}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Unclaimed listing · {business.category}</span><h5 className="mt-2 text-lg font-black">{business.name}</h5><p className="mt-2 text-sm text-slate-600">{business.detail}</p><p className="mt-3 text-sm text-slate-600">{business.address}</p><p className="mt-3 text-xs text-slate-500">Business details checked {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${business.checkedOn}T00:00:00Z`))}</p>{business.phone && <a href={`tel:${business.phone.replace(/[^0-9+]/g, "")}`} className="mt-2 inline-block text-sm font-bold underline">{business.phone}</a>}<p className="mt-2 break-all text-xs text-slate-600">{new URL(business.website).hostname.replace(/^www\./, "")}</p><div className="mt-4 flex flex-wrap gap-3"><a href={business.website} target="_blank" rel="noopener noreferrer" className="button button-small">Visit business website ↗</a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold underline">Directions</a></div><ReportDirectory name={business.name} address={business.address} website={business.website} currentUserId={user?.id} /></article>)}</div></div> : null; })}</section>;
        }) : <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-black">No directory businesses match these filters yet</h3><p className="mt-2 text-slate-600">Try another town, ZIP or shop type. Coverage is growing.</p><Link href="/shops#long-island-directory" className="mt-3 inline-block font-bold underline">Browse all directory businesses</Link></div>}
        <p className="mt-6 text-sm text-slate-600">Business owner? <Link href="/support" className="font-bold underline">Request a correction or removal</Link>, or <Link href="/shops/register" className="font-bold underline">create your APG business profile</Link>.</p>
      </section>
<div className="mb-5 mt-12 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold text-slate-600">{shown.length} {shown.length === 1 ? "post" : "posts"} from local businesses</p><Link className="button button-small" href={user ? "/shops/post" : "/login?next=/shops/post"}>Post for your business</Link></div>
      {shown.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shown.map((post) => {
        const shop = shopById.get(post.shop_id)!;
        const rating = ratings.get(shop.owner_id);
        return <article key={post.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#071a35] text-amber-400"><Store className="size-5"/></span><div className="min-w-0"><Link className="font-black hover:underline" href={`/shops/${shop.id}`}>{shop.name}</Link><p className="truncate text-xs text-slate-500">{shop.location}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-600">{rating ? <><Star className="size-3.5 fill-amber-400 text-amber-500"/><strong>{(rating.sum / rating.count).toFixed(1)}</strong> ({rating.count} {rating.count === 1 ? "review" : "reviews"})</> : "New — no reviews yet"}</p></div></div>
          <div className="relative aspect-[4/3] bg-slate-100"><Image src={post.image_url} alt={`Post by ${shop.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover"/></div>
          <div className="p-4"><span className="text-xs font-bold uppercase tracking-wide text-amber-700">{post.category}</span><p className="mt-1 line-clamp-3 min-h-12 font-semibold">{post.caption}</p>{post.price !== null && <p className="mt-2 font-black">${Number(post.price).toLocaleString()}</p>}<div className="mt-4"><ContactShop shopId={shop.id} ownerId={shop.owner_id} currentUserId={user?.id} nextPath="/shops" prompt={`I'm asking about your APG post: ${post.caption.slice(0, 120)}`} label="Ask shop"/></div><Link className="mt-3 inline-block text-sm font-bold underline" href={`/shops/${shop.id}`}>View APG Shop</Link></div>
        </article>;
      })}</div> : <div className="empty-state"><Store className="mx-auto mb-3"/><h2>No business posts yet</h2><p>{q || location || selected !== "All" ? "No posts match this search yet. Try another area or category; APG is still growing." : "APG is a new marketplace. Businesses can add their profiles and posts here as they join."}</p><Link className="button mt-5" href={user ? "/shops/post" : "/login?next=/shops/post"}>Share a business post</Link></div>}
      <section className="mt-12 border-t border-slate-200 pt-8"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><span className="kicker">Parts &amp; Repair Directory</span><h2 className="page-title">Find parts &amp; repair services</h2><p className="text-slate-600">Businesses can be found here even if they have not posted a photo.</p></div><Link className="button" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link></div>
        {filteredShops.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredShops.map((shop) => <Link key={shop.id} href={`/shops/${shop.id}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400"><strong className="text-lg">{shop.name}</strong><p className="text-sm text-slate-600">{shop.specialty} · {shop.location}</p></Link>)}</div> : <p className="rounded-xl bg-white p-6 text-slate-600">No registered business profiles match this search yet. Browse the independent listings above or try another town or category. Own a shop, parts store, marina, or industrial business? Join APG for free, showcase what you offer, and connect with new customers. <Link className="font-semibold text-[#071a35] underline" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link>.</p>}
      </section>


    </div>
    <section id="for-businesses" className="bg-[#0b2345] text-white"><div className="shell grid gap-8 py-12 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-sm font-black uppercase tracking-widest text-amber-400">For businesses</p><h2 className="mt-2 text-3xl font-black">Promote your business on APG.</h2><p className="mt-4 max-w-2xl text-slate-300">Create a free profile to show your specialty, services, hours and website. Buyers can contact your shop directly. Posting individual items or inventory is optional.</p><div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300"><span className="flex items-center gap-2"><Store className="size-4 text-amber-400"/> Business profile</span><span className="flex items-center gap-2"><Upload className="size-4 text-amber-400"/> Optional inventory</span><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-amber-400"/> Direct buyer contact</span></div></div><Link className="button whitespace-nowrap" href={user ? "/shops/register" : "/login?next=/shops/register"}>Add your business</Link></div></section>
  </main>;
}

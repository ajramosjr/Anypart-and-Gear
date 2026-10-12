"use client";

import { useState } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";

type Provider = { id: string; name: string; trades: string[]; towns: string[]; description: string; url: string; online: boolean; permissionGranted?: boolean };
// Each provider has a stable ID; a resource link does not imply permission or partnership.
const providers: Provider[] = [
  { id: "boatus", name: "BoatUS Foundation", trades: ["Boating"], towns: [], online: true, permissionGranted: true, description: "Online boating safety and skills training, with free and paid course options.", url: "https://boatus.org/free-courses/" },
  { id: "on-the-road-again", name: "On the Road Again Motorcycle School", trades: ["Motorcycle"], towns: ["Garden City", "Selden", "Bayside"], online: false, permissionGranted: true, description: "Motorcycle training and rider education. Check the school’s website for schedules, pricing, registration, and current training locations.", url: "https://lrn2ride.com/courses/" },
  { id: "big-apple-motorcycle-school", name: "Big Apple Motorcycle School", trades: ["Motorcycle"], towns: ["East Islip", "Suffolk County"], online: false, description: "Beginner and experienced rider training. MSF riding courses take place at Heckscher State Park, Field 7, East Islip. The Hicksville mailing office is not the riding range. Call 516-639-9977 for course dates and requirements.", url: "https://bigapplemotorcycleschool.com/training-locations/" },
  { id: "motorcycle-safety-school", name: "Motorcycle Safety School (MSS)", trades: ["Motorcycle"], towns: ["Brooklyn", "Bronx", "Staten Island"], online: false, description: "MSF rider courses and motorcycle lessons with riding locations at Kingsborough Community College, Lehman College and College of Staten Island. Confirm the course and riding campus when registering; the Williamsburg office is separate.", url: "https://ridemss.com/directions/" },
  { id: "waterfront-center", name: "The WaterFront Center", trades: ["Boating"], towns: ["Oyster Bay", "Nassau County"], online: false, description: "On-water sailing instruction and private sailing lessons at 1 West End Avenue, Oyster Bay. Listed by US Sailing as a Basic Keelboat training school. Confirm seasonal course availability directly. Call 516-922-7245.", url: "https://www.thewaterfrontcenter.org/sailing-programs" },
  { id: "nautical-school", name: "The Nautical School of Maritime Licensing", trades: ["Boating"], towns: ["Lindenhurst", "Freeport", "Oyster Bay", "Riverhead", "Manhattan", "Nassau County", "Suffolk County"], online: false, description: "In-person captain-license and maritime classroom courses. Headquarters: 178 West Hoffman Avenue, Lindenhurst. Confirm your course location and current Coast Guard course approval when booking. Classroom study is separate from on-water boat-handling lessons. Call 631-226-7300.", url: "https://nauticalschool.com/schedule/" },
  { id: "nassau-cdl", name: "Nassau Community College / Ancora", trades: ["CDL & Trucking"], towns: ["Garden City", "Nassau County"], online: false, description: "Class A CDL training combining classroom learning and on-road instruction in Garden City. Contact cwd@ncc.edu for current classes and enrollment requirements.", url: "https://continuinged.ncc.edu/nassau/course/course.aspx?C=18&pc=8&sc=0" },
  { id: "commercial-driver-training", name: "Commercial Driver Training", trades: ["CDL & Trucking"], towns: ["West Babylon", "Suffolk County"], online: false, description: "Tractor-trailer and bus training at 600 Patton Avenue, West Babylon, with manual and automatic instruction. Call 631-249-1330 for current programs.", url: "https://www.cdtschool.com/" },
  { id: "driving-academy-long-island", name: "Driving Academy — Long Island", trades: ["CDL & Trucking"], towns: ["Hauppauge", "Suffolk County"], online: false, description: "Class A CDL training at 135 Engineers Road, Hauppauge. Call 631-407-7055 to confirm vehicle options, lesson locations and current availability.", url: "https://www.cdldrivingacademy.com/school/long-island-ny/" },
  { id: "ferrari-cdl", name: "Ferrari Driving School", trades: ["CDL & Trucking"], towns: ["Queens", "Astoria", "Brooklyn"], online: false, description: "Class A, Class B and bus training with Queens and Brooklyn locations. Contact the school to confirm the branch, practice location and program for your license class.", url: "https://www.ferraridrivingschool.com/commercial-drivers-license-training/" },
  { id: "queens-trucking-school", name: "Queens Trucking School", trades: ["CDL & Trucking"], towns: ["Queens", "Astoria"], online: false, description: "Tractor-trailer, box truck and school bus training. Office: 31-08 Broadway, Suite 203, Astoria. Call 718-626-6260 to confirm the training location and course options.", url: "https://www.queenstruckingschoolinc.com/" },
  { id: "red-hook-on-the-road", name: "Red Hook on the Road — BWI", trades: ["CDL & Trucking"], towns: ["Brooklyn"], online: false, description: "Class B commercial driving program with classroom and behind-the-wheel training, free for eligible participants. Contact office: 621 Degraw Street, Brooklyn. Call 718-237-4846 for eligibility and current training details.", url: "https://bwiny.org/red-hook-on-the-road/overview/" },
  { id: "bronx-driving-school", name: "Bronx Driving School", trades: ["CDL & Trucking"], towns: ["Bronx"], online: false, description: "Class B and bus CDL lessons and road-test preparation. Office: 1213 Castle Hill Avenue, Bronx. Call 718-409-1632 to confirm your license class and lesson package.", url: "https://www.bronxdriving.com/program/cdl-training" },
  { id: "cdl-auto-club", name: "CDL Auto Club", trades: ["CDL & Trucking"], towns: ["Staten Island"], online: false, description: "Hands-on Class A tractor-trailer, Class B truck and bus training at 4176 Victory Boulevard, Staten Island. Call 718-300-1440 or 718-605-1711 for current programs.", url: "https://cdlautoclub.com/" },
];
const trades = ["Welding", "Automotive", "Light Diesel", "CDL & Trucking", "Marine Technician", "Boating", "Motorcycle", "Workplace Safety", "Fabrication & Machining", "Equipment Maintenance"];
const towns = [...new Set(providers.flatMap(provider => provider.towns))].sort();

export default function TrainingDirectory() {
  const [town, setTown] = useState("");
  const [trade, setTrade] = useState("");
  const [search, setSearch] = useState("");
  const matches = providers.filter(provider =>
    (!town || (town === "online" ? provider.online : provider.towns.includes(town))) &&
    (!trade || provider.trades.includes(trade)) &&
    `${provider.name} ${provider.trades.join(" ")} ${provider.towns.join(" ")} ${provider.description}`.toLowerCase().includes(search.trim().toLowerCase())
  );
  return <div className="mt-8">
    <div id="cdl-training" className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
      <h3 className="text-xl font-black text-[#071a35]">CDL Training</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">Explore eight hands-on training schools and programs in Nassau, Suffolk, Queens, Brooklyn, the Bronx and Staten Island. Confirm pricing, eligibility and the exact training location directly with each provider.</p>
      <button type="button" onClick={() => { setTown(""); setTrade("CDL & Trucking"); setSearch(""); }} className="mt-3 rounded-md bg-amber-400 px-5 py-3 font-bold text-[#071a35] hover:bg-amber-300">Show CDL training</button>
    </div>
    <div className="mb-5 flex flex-wrap gap-3" aria-label="Training categories">
      <button type="button" onClick={() => { setTown(""); setTrade("Motorcycle"); setSearch(""); }} className="rounded-md bg-amber-400 px-5 py-3 font-bold text-[#071a35] hover:bg-amber-300">Show motorcycle training</button>
      <button type="button" onClick={() => { setTown(""); setTrade("Boating"); setSearch(""); }} className="rounded-md bg-amber-400 px-5 py-3 font-bold text-[#071a35] hover:bg-amber-300">Show boating schools &amp; courses</button>
    </div>
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3">
      <label className="text-sm font-bold">Search providers<input value={search} onChange={event => setSearch(event.target.value)} placeholder="School, program, or trade" className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal text-slate-950" /></label>
      <label className="text-sm font-bold">Town or learning format<select value={town} onChange={event => setTown(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal text-slate-950"><option value="">All towns and online</option>{towns.map(value => <option key={value}>{value}</option>)}<option value="online">Online courses</option></select></label>
      <label className="text-sm font-bold">Trade or subject<select value={trade} onChange={event => setTrade(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal text-slate-950"><option value="">All trades and subjects</option>{trades.map(value => <option key={value}>{value}</option>)}</select></label>
    </div>
    <div className="my-5 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-slate-600">{matches.length} {matches.length === 1 ? "provider" : "providers"} found</p>{(town || trade || search) && <button onClick={() => { setTown(""); setTrade(""); setSearch(""); }} className="text-sm font-bold text-[#071a35] underline">Clear filters</button>}</div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {matches.map(provider => <article id={provider.id} key={provider.id} className="flex scroll-mt-24 flex-col rounded-2xl border border-amber-300 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><GraduationCap className="size-8 text-amber-700" /><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{provider.permissionGranted ? "Listed with permission" : "Independent resource"}</span></div>
        <p className="mt-5 text-xs font-black uppercase tracking-wide text-amber-700">{provider.trades.join(" · ")}</p>
        <h3 className="mt-2 text-2xl font-black text-[#071a35]">{provider.name}</h3>
        <p className="mt-3 text-sm font-bold text-slate-700">{provider.online ? "Online" : provider.towns.join(" · ")}</p>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{provider.description}</p>
        <a href={provider.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 font-black text-[#071a35] hover:bg-amber-300" aria-label={`View courses at ${provider.name}`}>View courses <ArrowUpRight className="size-4" /></a>
      </article>)}
    </div>
    {matches.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><h3 className="text-xl font-bold">No providers listed for these filters yet</h3><p className="mt-3 text-slate-600">Try another town or trade, or clear the filters.</p></div>}
  </div>;
}

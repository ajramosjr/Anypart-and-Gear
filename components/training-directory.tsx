"use client";

import { useState } from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";

type Provider = { id: string; name: string; trades: string[]; towns: string[]; description: string; url: string; online: boolean };
// Add each permitted provider independently; towns and trades are not unique keys.
const providers: Provider[] = [
  { id: "boatus", name: "BoatUS Foundation", trades: ["Boating"], towns: [], online: true, description: "Online boating safety and skills training, with free and paid course options.", url: "https://boatus.org/free-courses/" },
  { id: "on-the-road-again", name: "On the Road Again Motorcycle School", trades: ["Motorcycle"], towns: ["Garden City", "Selden", "Bayside"], online: false, description: "Motorcycle training and rider education. Check the school’s website for schedules, pricing, registration, and current training locations.", url: "https://lrn2ride.com/courses/" },
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
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3">
      <label className="text-sm font-bold">Search providers<input value={search} onChange={event => setSearch(event.target.value)} placeholder="School, program, or trade" className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal text-slate-950" /></label>
      <label className="text-sm font-bold">Town or learning format<select value={town} onChange={event => setTown(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal text-slate-950"><option value="">All towns and online</option>{towns.map(value => <option key={value}>{value}</option>)}<option value="online">Online courses</option></select></label>
      <label className="text-sm font-bold">Trade or subject<select value={trade} onChange={event => setTrade(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal text-slate-950"><option value="">All trades and subjects</option>{trades.map(value => <option key={value}>{value}</option>)}</select></label>
    </div>
    <div className="my-5 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-slate-600">{matches.length} {matches.length === 1 ? "provider" : "providers"} found</p>{(town || trade || search) && <button onClick={() => { setTown(""); setTrade(""); setSearch(""); }} className="text-sm font-bold text-[#071a35] underline">Clear filters</button>}</div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {matches.map(provider => <article id={provider.id} key={provider.id} className="flex scroll-mt-24 flex-col rounded-2xl border border-amber-300 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><GraduationCap className="size-8 text-amber-700" /><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">Listed with permission</span></div>
        <p className="mt-5 text-xs font-black uppercase tracking-wide text-amber-700">{provider.trades.join(" · ")}</p>
        <h3 className="mt-2 text-2xl font-black text-[#071a35]">{provider.name}</h3>
        <p className="mt-3 text-sm font-bold text-slate-700">{provider.online ? "Online" : provider.towns.join(" · ")}</p>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{provider.description}</p>
        <a href={provider.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 font-black text-[#071a35] hover:bg-amber-300" aria-label={`View courses at ${provider.name}`}>View courses <ArrowUpRight className="size-4" /></a>
      </article>)}
    </div>
    {matches.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><h3 className="text-xl font-bold">No providers listed for these filters yet</h3><p className="mt-3 text-slate-600">Try another town or trade, or clear the filters. More schools and training providers will be added as permission is received.</p></div>}
  </div>;
}

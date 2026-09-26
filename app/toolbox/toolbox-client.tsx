"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ApgLogo from "@/components/apg-logo";
import {
  AlertTriangle, ArrowLeftRight, BatteryCharging, Bolt, BookOpen,
  Car, CheckSquare, CircleGauge, Droplets, FileDown, Gauge, Printer,
  Search, ShipWheel, Sparkles, Truck, Wrench, Zap,
} from "lucide-react";

const tapRows = [
  ["#6-32 UNC", "#36", "0.1065 in"], ["#8-32 UNC", "#29", "0.1360 in"],
  ["#10-24 UNC", "#25", "0.1495 in"], ["1/4-20 UNC", "#7", "0.2010 in"],
  ["5/16-18 UNC", "F", "0.2570 in"], ["3/8-16 UNC", "5/16", "0.3125 in"],
  ["1/2-13 UNC", "27/64", "0.4219 in"], ["M5 × 0.8", "4.2 mm", "0.1654 in"],
  ["M6 × 1.0", "5.0 mm", "0.1969 in"], ["M8 × 1.25", "6.8 mm", "0.2677 in"],
  ["M10 × 1.5", "8.5 mm", "0.3346 in"], ["M12 × 1.75", "10.2 mm", "0.4016 in"],
];

const tools = [
  ["tire", "Tire Size Calculator", "Compare diameter, speedometer reading and ground clearance.", CircleGauge],
  ["gears", "Gear Ratio & RPM", "Estimate engine RPM using speed, tire diameter and gearing.", Gauge],
  ["bolts", "SAE & Metric Bolt Guide", "Common markings, grades and strength classes.", Bolt],
  ["wire", "Wire Gauge Chart", "A practical 12-volt wire reference.", Zap],
  ["dtc", "DTC Code Lookup", "Understand the system identified by a generic OBD-II code.", Car],
  ["fluids", "Fluid Type & Capacity", "A safe checklist for finding vehicle-specific information.", Droplets],
  ["towing", "Trailer & Towing Calculator", "Check payload and estimated loaded trailer weight.", Truck],
  ["marine", "Marine Propeller & RPM Guide", "Estimate propeller slip and compare setups.", ShipWheel],
  ["electrical", "Fuse & Relay Guide", "Common fuse colors, relay terminals and electrical basics.", BatteryCharging],
  ["inspection", "Printable Vehicle Inspection", "A pre-trip and routine maintenance checklist.", CheckSquare],
] as const;

const tireDiameterInches = (tire: { width: number; ratio: number; rim: number }) =>
  tire.rim + (2 * tire.width * (tire.ratio / 100)) / 25.4;

function Printable({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return <section id={id} className={`tool-section ${className}`} data-tool-section>{children}</section>;
}

function printSection(id?: string) {
  const cleanup = () => {
    document.body.classList.remove("toolbox-printing");
    document.querySelectorAll(".print-target").forEach((node) => node.classList.remove("print-target"));
    window.removeEventListener("afterprint", cleanup);
  };
  if (id) {
    document.body.classList.add("toolbox-printing");
    document.getElementById(id)?.classList.add("print-target");
  }
  window.addEventListener("afterprint", cleanup);
  window.setTimeout(() => window.print(), 80);
}

function PrintButton({ target, label = "Print" }: { target?: string; label?: string }) {
  return <button type="button" className="tool-print no-print" onClick={() => printSection(target)}><Printer size={17} />{label}</button>;
}

function SectionHeading({ icon: Icon, title, target }: { icon: typeof Wrench; title: string; target: string }) {
  return <div className="tool-heading"><span><Icon aria-hidden="true" /><strong>{title}</strong></span><PrintButton target={target} /></div>;
}

export default function ToolboxClient() {
  const [query, setQuery] = useState("");
  const [convertValue, setConvertValue] = useState("0.5");
  const [convertDirection, setConvertDirection] = useState<"in-mm" | "mm-in">("in-mm");
  const [oldTire, setOldTire] = useState({ width: 225, ratio: 60, rim: 17 });
  const [newTire, setNewTire] = useState({ width: 245, ratio: 70, rim: 17 });
  const [speed, setSpeed] = useState(60);
  const [gear, setGear] = useState(3.73);
  const [trans, setTrans] = useState(0.75);
  const [tireDiameter, setTireDiameter] = useState(31.6);
  const [trailerDry, setTrailerDry] = useState(3500);
  const [cargo, setCargo] = useState(800);
  const [towRating, setTowRating] = useState(6000);
  const [propPitch, setPropPitch] = useState(19);
  const [propRpm, setPropRpm] = useState(4800);
  const [propRatio, setPropRatio] = useState(1.81);
  const [propSpeed, setPropSpeed] = useState(43);
  const [dtc, setDtc] = useState("P0300");

  const converted = Number(convertValue || 0) * (convertDirection === "in-mm" ? 25.4 : 1 / 25.4);
  const tireResult = useMemo(() => {
    const oldD = tireDiameterInches(oldTire), newD = tireDiameterInches(newTire), percent = ((newD - oldD) / oldD) * 100;
    return { oldD, newD, percent, actual: speed * (newD / oldD), clearance: (newD - oldD) / 2 };
  }, [oldTire, newTire, speed]);
  const rpm = (speed * gear * trans * 336) / Math.max(tireDiameter, 1);
  const loadedTrailer = trailerDry + cargo;
  const propTheoretical = propRpm > 0 && propRatio > 0 ? (propRpm * propPitch) / (propRatio * 1056) : 0;
  const propSlip = propTheoretical ? ((propTheoretical - propSpeed) / propTheoretical) * 100 : 0;

  const filteredTools = tools.filter(([title, , description]) => `${title} ${description}`.toLowerCase().includes(query.toLowerCase()));
  const dtcText = (() => {
    const code = dtc.trim().toUpperCase();
    if (!/^[PBCU][0-3][0-9A-F]{3}$/.test(code)) return "Enter a five-character code such as P0300.";
    const systems: Record<string, string> = { P: "Powertrain", B: "Body", C: "Chassis", U: "Network communication" };
    const origin = code[1] === "0" ? "generic SAE code" : "manufacturer-specific or enhanced code";
    const examples: Record<string, string> = { P0300: "Random or multiple-cylinder misfire detected.", P0420: "Catalyst system efficiency below threshold, Bank 1.", P0171: "Fuel system too lean, Bank 1.", P0442: "Small evaporative-emissions leak detected.", P0128: "Coolant temperature below thermostat regulating temperature." };
    return examples[code] || `${systems[code[0]]} system · ${origin}. Use vehicle-specific service information for the exact definition and diagnostic procedure.`;
  })();

  return <>
    <section className="toolbox-hero no-print">
      <div className="shell toolbox-hero-grid">
        <div><span className="toolbox-kicker"><Sparkles size={16}/> Free workshop resources</span><h1>APG <em>Toolbox</em></h1><p>Practical charts, calculators and references for mechanics, builders and DIYers.</p>
          <label className="tool-search"><Search/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="What do you need help with?" aria-label="Search APG Toolbox"/></label>
        </div>
        <div className="toolbox-trust"><span><Wrench/> Real tools</span><span><BookOpen/> Clear references</span><span><FileDown/> Printer friendly</span></div>
      </div>
    </section>

    <div className="shell toolbox-content">
      <div className="toolbox-actions no-print"><p><strong>All tools are free.</strong> No account is required.</p><PrintButton label="Print complete toolbox" /></div>

      {query && <section className="tool-results no-print"><h2>Matching tools</h2><div className="mini-tool-grid">{filteredTools.map(([id,title,description,Icon])=><a href={`#${id}`} key={id}><Icon/><span><strong>{title}</strong><small>{description}</small></span></a>)}</div>{!filteredTools.length&&<p>No matching tool yet. Try “tire,” “wire,” “trailer” or “bolt.”</p>}</section>}

      <div className="primary-tools">
        <Printable id="drill-tap"><SectionHeading icon={Wrench} title="Drill & Tap Chart" target="drill-tap"/><p className="tool-note">Common 75% thread drill sizes. Confirm the tap type and material before drilling.</p><div className="table-wrap"><table><thead><tr><th>Thread</th><th>Tap drill</th><th>Decimal</th></tr></thead><tbody>{tapRows.map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></Printable>

        <Printable id="converter"><SectionHeading icon={ArrowLeftRight} title="SAE–Metric Converter" target="converter"/><div className="converter-panel"><label>Value<input inputMode="decimal" value={convertValue} onChange={(e)=>setConvertValue(e.target.value)}/></label><button type="button" onClick={()=>setConvertDirection(convertDirection === "in-mm" ? "mm-in" : "in-mm")} aria-label="Swap conversion direction"><ArrowLeftRight/> Swap</button><div className="conversion-result"><small>{convertDirection === "in-mm" ? "Millimeters" : "Inches"}</small><strong>{Number.isFinite(converted) ? converted.toFixed(convertDirection === "in-mm" ? 2 : 4) : "0"} {convertDirection === "in-mm" ? "mm" : "in"}</strong></div></div><p className="formula">{convertDirection === "in-mm" ? "inches × 25.4 = millimeters" : "millimeters ÷ 25.4 = inches"}</p></Printable>

        <Printable id="bolts"><SectionHeading icon={Bolt} title="Torque & Fastener Guide" target="bolts"/><p className="tool-note">Fastener grade is not a torque specification. Lubrication, coatings, joint design and service requirements change torque.</p><div className="fastener-grid"><article><b>SAE Grade 5</b><span>3 radial lines</span><small>Medium-strength automotive use</small></article><article><b>SAE Grade 8</b><span>6 radial lines</span><small>High-strength applications</small></article><article><b>Metric 8.8</b><span>8.8 head mark</span><small>Common medium-strength metric fastener</small></article><article><b>Metric 10.9</b><span>10.9 head mark</span><small>High-strength metric fastener</small></article></div><div className="verify-callout"><AlertTriangle/>Use the vehicle/equipment service manual for the final torque value.</div></Printable>

        <Printable id="electrical"><SectionHeading icon={BatteryCharging} title="Electrical Reference" target="electrical"/><div className="electrical-grid"><article><b>Terminal 30</b><span>Battery power</span></article><article><b>Terminal 85</b><span>Relay coil ground/control</span></article><article><b>Terminal 86</b><span>Relay coil power/control</span></article><article><b>Terminal 87</b><span>Normally open output</span></article><article><b>Terminal 87a</b><span>Normally closed output</span></article><article><b>Voltage drop</b><span>Test a loaded circuit, not just continuity</span></article></div><div className="verify-callout"><Zap/>Disconnect power where required and follow the manufacturer wiring diagram.</div></Printable>
      </div>

      <section className="more-tools no-print"><div className="more-tools-title"><div><span className="kicker">Quick access</span><h2>More workshop tools</h2></div></div><div className="mini-tool-grid">{tools.map(([id,title,description,Icon])=><a href={`#${id}`} key={id}><Icon/><span><strong>{title}</strong><small>{description}</small></span></a>)}</div></section>

      <Printable id="tire" className="wide-tool"><SectionHeading icon={CircleGauge} title="Tire Size Calculator" target="tire"/><div className="calc-grid"><div className="calc-inputs"><h3>Current tire</h3><TireInputs tire={oldTire} setTire={setOldTire}/><h3>New tire</h3><TireInputs tire={newTire} setTire={setNewTire}/><label>Indicated speed (mph)<input type="number" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/></label></div><div className="result-card"><span>Diameter change</span><strong>{tireResult.percent >= 0 ? "+" : ""}{tireResult.percent.toFixed(1)}%</strong><span>Actual speed at {speed} mph indicated</span><strong>{tireResult.actual.toFixed(1)} mph</strong><span>Ground-clearance change</span><strong>{tireResult.clearance >= 0 ? "+" : ""}{tireResult.clearance.toFixed(2)} in</strong><small>{tireResult.oldD.toFixed(2)} in → {tireResult.newD.toFixed(2)} in diameter</small></div></div></Printable>

      <div className="secondary-tools">
        <Printable id="gears"><SectionHeading icon={Gauge} title="Gear Ratio & RPM" target="gears"/><div className="field-stack"><NumberField label="Speed (mph)" value={speed} setValue={setSpeed}/><NumberField label="Axle ratio" value={gear} setValue={setGear} step="0.01"/><NumberField label="Transmission ratio" value={trans} setValue={setTrans} step="0.01"/><NumberField label="Tire diameter (in)" value={tireDiameter} setValue={setTireDiameter} step="0.1"/></div><div className="result-strip"><span>Estimated engine RPM</span><strong>{Math.round(rpm).toLocaleString()}</strong></div><p className="tool-note">Estimate assumes no converter or clutch slip.</p></Printable>

        <Printable id="wire"><SectionHeading icon={Zap} title="12-Volt Wire Gauge Chart" target="wire"/><div className="table-wrap"><table><thead><tr><th>Current</th><th>Short run*</th><th>Longer run*</th></tr></thead><tbody><tr><td>5 A</td><td>18 AWG</td><td>16 AWG</td></tr><tr><td>10 A</td><td>16 AWG</td><td>14 AWG</td></tr><tr><td>20 A</td><td>12 AWG</td><td>10 AWG</td></tr><tr><td>30 A</td><td>10 AWG</td><td>8 AWG</td></tr><tr><td>40 A</td><td>8 AWG</td><td>6 AWG</td></tr></tbody></table></div><p className="tool-note">*General copper-wire starting point. Length, bundling, temperature and allowable voltage drop matter. Fuse the circuit for the wire and device.</p></Printable>

        <Printable id="dtc"><SectionHeading icon={Car} title="DTC Code Lookup" target="dtc"/><label className="single-input">OBD-II code<input value={dtc} maxLength={5} onChange={e=>setDtc(e.target.value.toUpperCase())}/></label><div className="lookup-result"><strong>{dtc || "Code"}</strong><p>{dtcText}</p></div><p className="tool-note">A code identifies a monitored fault—not automatically the failed part. Diagnose before replacing components.</p></Printable>

        <Printable id="towing"><SectionHeading icon={Truck} title="Trailer & Towing Calculator" target="towing"/><div className="field-stack"><NumberField label="Trailer dry weight (lb)" value={trailerDry} setValue={setTrailerDry}/><NumberField label="Cargo, fluids & options (lb)" value={cargo} setValue={setCargo}/><NumberField label="Vehicle tow rating (lb)" value={towRating} setValue={setTowRating}/></div><div className={`result-strip ${loadedTrailer > towRating ? "danger" : ""}`}><span>Estimated loaded trailer</span><strong>{loadedTrailer.toLocaleString()} lb</strong><small>{towRating-loadedTrailer >= 0 ? `${(towRating-loadedTrailer).toLocaleString()} lb below entered rating` : `${Math.abs(towRating-loadedTrailer).toLocaleString()} lb over entered rating`}</small></div><p className="tool-note">Also verify payload, tongue weight, hitch, axle, tire and combined-weight ratings.</p></Printable>

        <Printable id="marine"><SectionHeading icon={ShipWheel} title="Marine Propeller & RPM Guide" target="marine"/><div className="field-stack"><NumberField label="Propeller pitch (in)" value={propPitch} setValue={setPropPitch}/><NumberField label="Engine RPM" value={propRpm} setValue={setPropRpm}/><NumberField label="Gear ratio" value={propRatio} setValue={setPropRatio} step="0.01"/><NumberField label="GPS speed (mph)" value={propSpeed} setValue={setPropSpeed}/></div><div className="result-strip"><span>Estimated propeller slip</span><strong>{propSlip.toFixed(1)}%</strong></div><p className="tool-note">Use the engine maker’s recommended wide-open-throttle RPM range. Never select a propeller by this estimate alone.</p></Printable>

        <Printable id="fluids"><SectionHeading icon={Droplets} title="Fluid Type & Capacity Checklist" target="fluids"/><CheckList items={["Confirm year, make, model and engine","Identify transmission/drive unit","Check owner or factory service manual","Match required specification—not color alone","Measure drained quantity when appropriate","Fill, run, inspect and recheck at specified temperature"]}/></Printable>

        <Printable id="inspection"><SectionHeading icon={CheckSquare} title="Vehicle Inspection Checklist" target="inspection"/><CheckList interactive items={["Engine oil level and leaks","Coolant level and visible leaks","Brake fluid and pedal feel","Tire pressure, tread and damage","Exterior lights and signals","Wipers and washer fluid","Battery terminals and hold-down","Belts and accessible hoses","Steering and suspension concerns","Unusual warning lights, noises or smells","Emergency equipment and documentation","Record mileage and next service due"]}/></Printable>
      </div>

      <Printable id="bolts-reference" className="reference-pair"><div><SectionHeading icon={Bolt} title="SAE & Metric Bolt Guide" target="bolts-reference"/><div className="table-wrap"><table><thead><tr><th>Marking</th><th>System</th><th>General identification</th></tr></thead><tbody><tr><td>No radial lines</td><td>SAE</td><td>Grade 2</td></tr><tr><td>3 radial lines</td><td>SAE</td><td>Grade 5</td></tr><tr><td>6 radial lines</td><td>SAE</td><td>Grade 8</td></tr><tr><td>8.8</td><td>Metric</td><td>Property class 8.8</td></tr><tr><td>10.9</td><td>Metric</td><td>Property class 10.9</td></tr><tr><td>12.9</td><td>Metric</td><td>Property class 12.9</td></tr></tbody></table></div></div></Printable>

      <div className="toolbox-warning"><AlertTriangle/><div><strong>Use these tools as a starting point.</strong><span>Always verify specifications, capacities, fitment and procedures with the vehicle or equipment manufacturer before beginning work.</span></div></div>
    </div>

    <footer className="toolbox-footer no-print"><div className="shell"><ApgLogo/><p>Parts, people and practical workshop resources.</p><div><Link href="/">Marketplace</Link><Link href="/shops">Local shops</Link><Link href="/tech-wire">APG Tech Wire</Link><Link href="/safety">Safety</Link></div></div></footer>
  </>;
}

function TireInputs({ tire, setTire }: { tire: {width:number;ratio:number;rim:number}; setTire: React.Dispatch<React.SetStateAction<{width:number;ratio:number;rim:number}>> }) {
  return <div className="tire-inputs"><label>Width<input type="number" value={tire.width} onChange={e=>setTire({...tire,width:Number(e.target.value)})}/></label><span>/</span><label>Ratio<input type="number" value={tire.ratio} onChange={e=>setTire({...tire,ratio:Number(e.target.value)})}/></label><span>R</span><label>Wheel<input type="number" value={tire.rim} onChange={e=>setTire({...tire,rim:Number(e.target.value)})}/></label></div>;
}

function NumberField({ label, value, setValue, step = "1" }: { label:string; value:number; setValue:(n:number)=>void; step?:string }) {
  return <label>{label}<input type="number" step={step} value={value} onChange={e=>setValue(Number(e.target.value))}/></label>;
}

function CheckList({ items, interactive=false }: { items:string[]; interactive?:boolean }) {
  return <ul className="print-checklist">{items.map(item=><li key={item}>{interactive ? <input type="checkbox" aria-label={item}/> : <span className="empty-check"/>}<span>{item}</span></li>)}</ul>;
}

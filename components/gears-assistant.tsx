"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  CircleHelp,
  Search,
  Send,
  Mic,
  Languages,
  FileSpreadsheet,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import styles from "./gears-assistant.module.css";

const actions = [
  { href: "/#listings", label: "Find parts & gear", icon: Search },
  { href: "/sell", label: "Post an item", icon: Tag },
  { href: "/shops", label: "Explore shops", icon: Store },
  { href: "/toolbox", label: "Open APG Toolbox", icon: Wrench },
  { href: "/account", label: "Account help", icon: CircleHelp },
  { href: "/safety", label: "Marketplace safety", icon: ShieldCheck },
] as const;

type Message = { id: number; role: "gears" | "user"; text: string };
type ListingStep = "item" | "category" | "condition" | "price" | "location" | "description" | null;
type Language = "en" | "es";

const scamTerms = /gift card|wire transfer|verification code|security code|crypto|bitcoin|zelle.*deposit|venmo.*friends|cash app.*deposit|pay.*outside|text me|whatsapp/i;

const pageHelp: Record<string, string> = {
  "/": "You’re on the marketplace. I can build a search, explain categories, or help you start a listing.",
  "/sell": "You’re posting an item. I can prepare the details, check the quality, and fill this form.",
  "/sell/bulk": "You’re on bulk upload. I can inspect a CSV before you upload it.",
  "/shops": "You’re browsing business shops. I can explain business profiles or help locate a specialty.",
  "/shops/register": "You’re setting up a business. I can help write the specialty, description, services, and hours.",
  "/messages": "You’re in APG Messages. I can suggest a reply and check it for scam warning signs.",
  "/toolbox": "You’re in the Toolbox. Tell me the job and I’ll point you to the right chart or calculator.",
  "/account": "You’re in your seller dashboard. I can explain listings, notifications, and account options.",
  "/safety": "You’re viewing marketplace safety. Ask about pickup, shipping, payments, or suspicious messages.",
};

const photoGuides: Record<string, string> = {
  marine: "Marine photos: full part, casting or serial number, hose and electrical connections, mounting points, corrosion, and every damaged area.",
  vehicle: "Vehicle-part photos: full part, OEM label or part number, connectors, mounting points, measurements, wear, and damage.",
  trailer: "Trailer photos: all sides, VIN/data plate, coupler, axle, hubs, wiring plug, tires, deck, and rust or damage.",
  tool: "Tool photos: full tool, model label, battery or power connection, included accessories, working display, and wear.",
  default: "Take clear photos of the full item, label or part number, connectors, mounting points, measurements, included pieces, wear, and damage.",
};

const listingPrompts: Record<Exclude<ListingStep, null>, string> = {
  item: "What are you selling? Include the brand and part name if you know them.",
  category: "Which category fits it best—car parts, boat parts, trailers, tools, machinery, motorcycles, RC & hobby, workwear, vehicles, or other?",
  condition: "What condition is it in—new, like new, good, fair, or for parts?",
  price: "What price would you like to ask? You can also say negotiable or trade.",
  location: "What city and state is the item located in?",
  description: "Finally, tell me any model numbers, fitment details, defects, or important information a buyer should know.",
};

const listingPromptsEs: Record<Exclude<ListingStep, null>, string> = {
  item: "¿Qué está vendiendo? Incluya la marca y el nombre de la pieza si los conoce.",
  category: "¿Qué categoría corresponde mejor: piezas de automóvil, piezas de barco, remolques, herramientas, maquinaria, motocicletas, RC, ropa de trabajo o vehículos?",
  condition: "¿En qué condición está: nuevo, como nuevo, bueno, regular o para piezas?",
  price: "¿Qué precio desea pedir? También puede indicar negociable o intercambio.",
  location: "¿En qué ciudad y estado se encuentra el artículo?",
  description: "Finalmente, indique números de modelo, compatibilidad, defectos o información importante para el comprador.",
};

const listingSteps: Exclude<ListingStep, null>[] = [
  "item",
  "category",
  "condition",
  "price",
  "location",
  "description",
];

function normalizeCategory(answer: string) {
  const value = answer.toLowerCase();
  if (value.includes("boat") && /sale|complete|watercraft/.test(value)) return "Boats for Sale";
  if (value.includes("boat") || value.includes("marine")) return "Boat Parts";
  if (value.includes("motorcycle") || value.includes("bike")) return "Motorcycles";
  if (value.includes("trailer")) return "Trailers";
  if (value.includes("tool")) return "Tools";
  if (value.includes("machin") || value.includes("equipment")) return "Machinery";
  if (value.includes("rc") || value.includes("hobby") || value.includes("drone")) return "RC & Hobby";
  if (value.includes("workwear") || value.includes("apparel") || value.includes("clothing")) return "Workwear & Apparel";
  if (value.includes("vehicle") || value.includes("car for sale") || value.includes("truck for sale")) return "Vehicles for Sale";
  if (value.includes("truck") || value.includes("diesel")) return "Trucks";
  return "Car Parts";
}

function normalizeCondition(answer: string) {
  const value = answer.toLowerCase();
  if (value.includes("like new")) return "Like new";
  if (value.includes("new")) return "New";
  if (value.includes("fair") || value.includes("parts") || value.includes("repair")) return "Fair";
  return "Good";
}

function listingQuality(draft: Record<string, string>) {
  const suggestions: string[] = [];
  if ((draft.item || "").length < 12) suggestions.push("add a brand, model, or part number to the title");
  if ((draft.description || "").length < 40) suggestions.push("add more fitment details, measurements, known issues, or pickup information");
  if (!/\d/.test(draft.item || "") && !/\d/.test(draft.description || "")) suggestions.push("include a year, size, model, or part number when available");
  return suggestions;
}

export function GearsAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [input, setInput] = useState("");
  const [listingStep, setListingStep] = useState<ListingStep>(null);
  const [listingDraft, setListingDraft] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<Language>("en");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "gears", text: "Hi, I’m Gears. Ask me how to use APG, find something, or create a strong listing." },
  ]);
  const nextMessageId = useRef(2);
  const conversationEnd = useRef<HTMLDivElement>(null);
  const csvInput = useRef<HTMLInputElement>(null);

  const hiddenOnNews = pathname.startsWith("/tech-wire");

  useEffect(() => {
    const alreadyIntroduced = window.sessionStorage.getItem("apg-gears-introduced");
    if (alreadyIntroduced) {
      return;
    }

    const showTimer = window.setTimeout(() => setShowIntro(true), 900);
    const hideTimer = window.setTimeout(() => setShowIntro(false), 6500);
    window.sessionStorage.setItem("apg-gears-introduced", "true");

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("apg-gears-state-v1");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { messages?: Message[]; listingStep?: ListingStep; listingDraft?: Record<string, string>; language?: Language };
      if (parsed.messages?.length) {
        setMessages(parsed.messages.slice(-30));
        nextMessageId.current = Math.max(...parsed.messages.map((message) => message.id)) + 1;
      }
      if (parsed.listingStep) setListingStep(parsed.listingStep);
      if (parsed.listingDraft) setListingDraft(parsed.listingDraft);
      if (parsed.language) setLanguage(parsed.language);
    } catch {
      window.localStorage.removeItem("apg-gears-state-v1");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("apg-gears-state-v1", JSON.stringify({ messages: messages.slice(-30), listingStep, listingDraft, language }));
  }, [messages, listingStep, listingDraft, language]);

  useEffect(() => {
    conversationEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function toggleAssistant() {
    setOpen((current) => !current);
    setShowIntro(false);
  }

  function addMessage(role: Message["role"], text: string) {
    setMessages((current) => [...current, { id: nextMessageId.current++, role, text }]);
  }

  function startListingHelp() {
    setListingDraft({});
    setListingStep("item");
    addMessage("gears", language === "es" ? listingPromptsEs.item : listingPrompts.item);
  }

  function pageGuidance() {
    const fallback = pathname.startsWith("/listing/")
      ? "You’re viewing a listing. I can suggest seller questions, fitment checks, and safe transaction steps."
      : pathname.startsWith("/shops/")
        ? "You’re viewing a business marketplace. I can help you review its inventory or prepare a message."
        : "I can explain this page and help you choose the next step.";
    addMessage("gears", pageHelp[pathname] || fallback);
  }

  function startVoice() {
    type Recognition = { lang: string; interimResults: boolean; onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void; onend: () => void; onerror: () => void; start: () => void };
    type RecognitionConstructor = new () => Recognition;
    const speechWindow = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    const RecognitionApi = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!RecognitionApi) {
      addMessage("gears", "Voice entry is not supported by this browser. You can still type your answer.");
      return;
    }
    const recognition = new RecognitionApi();
    recognition.lang = language === "es" ? "es-US" : "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => setInput(event.results[0]?.[0]?.transcript || "");
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); addMessage("gears", "I couldn’t hear that clearly. Please try again or type your answer."); };
    setListening(true);
    recognition.start();
  }

  function checkCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      const headers = (lines[0] || "").toLowerCase().split(",").map((value) => value.trim());
      const required = ["title", "description", "price", "condition", "category", "location"];
      const issues: string[] = [];
      const missing = required.filter((header) => !headers.includes(header));
      if (missing.length) issues.push(`missing columns: ${missing.join(", ")}`);
      if (lines.length < 2) issues.push("no inventory rows");
      if (lines.length - 1 > 100) issues.push("more than 100 inventory rows");
      const duplicateRows = lines.slice(1).length - new Set(lines.slice(1)).size;
      if (duplicateRows) issues.push(`${duplicateRows} exact duplicate ${duplicateRows === 1 ? "row" : "rows"}`);
      addMessage("gears", issues.length ? `CSV check found: ${issues.join("; ")}. Correct these before uploading.` : `CSV structure looks ready: ${lines.length - 1} inventory rows and all required columns are present. APG will perform detailed validation during upload.`);
    };
    reader.readAsText(file);
  }

  function answerGeneralQuestion(question: string) {
    const normalized = question.toLowerCase();

    if (language === "es") {
      if (/vender|publicar|anuncio/.test(normalized)) { startListingHelp(); return; }
      if (/buscar|comprar|necesito|pieza/.test(normalized)) { addMessage("gears", "Puedo ayudarle a buscar piezas en el mercado. Escriba la marca, modelo, año o número de pieza que necesita."); return; }
      if (/negocio|tienda|inventario|csv/.test(normalized)) { addMessage("gears", "La cuenta comercial gratuita permite crear una tienda y cargar inventario por CSV. Complete el nombre, especialidad, ubicación, horario, página pública, servicios y descripción."); return; }
      if (/seguro|estafa|pago/.test(normalized)) { addMessage("gears", "Use un lugar público seguro, revise el artículo antes de pagar, use pagos protegidos y nunca comparta contraseñas ni códigos de verificación."); return; }
      if (/herramienta|taladro|rosca|medida/.test(normalized)) { addMessage("gears", "APG Toolbox incluye tablas de taladro y rosca, guía de cinta métrica, conversiones, cálculos y referencias imprimibles."); return; }
      addMessage("gears", "Puedo ayudarle a crear un anuncio, buscar piezas, configurar una tienda, revisar un CSV, usar Toolbox o verificar la seguridad. ¿Qué desea hacer?");
      return;
    }

    if (scamTerms.test(question)) {
      addMessage("gears", "⚠️ Scam warning: this message contains a risky payment or contact phrase. Do not share verification codes or passwords, avoid gift cards and unprotected transfers, and keep records inside APG Messages.");
      return;
    }

    if (/sell|post|list|listing/.test(normalized)) {
      startListingHelp();
    } else if (/fit|fitment|year|make|model|engine|trim|part number/.test(normalized)) {
      addMessage("gears", "Fitment checklist: record the year, make, model, engine, trim, drivetrain, OEM/part number, measurements, connector count, and mounting points. Add: ‘Buyer must verify compatibility before purchase.’");
    } else if (/photo|picture|image/.test(normalized)) {
      const guide = /boat|marine|prop|outboard/.test(normalized) ? photoGuides.marine : /trailer/.test(normalized) ? photoGuides.trailer : /tool|drill|saw/.test(normalized) ? photoGuides.tool : /car|truck|vehicle|engine|part/.test(normalized) ? photoGuides.vehicle : photoGuides.default;
      addMessage("gears", guide);
    } else if (/find|search|buy|part/.test(normalized)) {
      const searchText = question.replace(/^(find|search for|search|buy|i need|looking for)\s*/i, "").trim();
      if (pathname === "/" && searchText) {
        window.dispatchEvent(new CustomEvent("apg:search", { detail: { query: searchText } }));
        addMessage("gears", `I searched APG for “${searchText}” and moved you to the results.`);
      } else {
        addMessage("gears", `I can build that search on the marketplace. Open Find parts & gear below${searchText ? ` and search for “${searchText}.”` : "."}`);
      }
    } else if (/business|shop|inventory|bulk/.test(normalized)) {
      addMessage("gears", "Free business setup: enter the public business name, specialty, location and ZIP, hours, website/social page, services, and a clear description. After approval, listings appear under the business marketplace. For inventory, download APG’s CSV template and use my CSV checker before uploading.");
    } else if (/reply|message|contact|offer|available/.test(normalized)) {
      addMessage("gears", "Message templates:\n• Is this still available?\n• Can you confirm the part number and condition?\n• What year, make, model, and engine did it come from?\n• Would you consider $___?\n• Where would you prefer to meet safely?\nNever include passwords, verification codes, or sensitive payment information.");
    } else if (/account|sign in|login|password|email/.test(normalized)) {
      addMessage("gears", "For account access, open Account help below. If your password is rejected, use Forgot password and check your spam folder for the reset email.");
    } else if (/safe|scam|payment|shipping/.test(normalized)) {
      addMessage("gears", "Meet in a safe public place when possible, inspect items before paying, use protected payment methods, and never send verification codes or gift cards.");
    } else if (/tool|chart|drill|tap|measure/.test(normalized)) {
      addMessage("gears", "Toolbox guide: use Drill & Tap for thread preparation, Tape Measure for fractional readings, converters for measurement changes, tire tools for size comparisons, torque references for tightening guidance, and printable charts for the workshop. Always verify manufacturer specifications.");
    } else {
      addMessage("gears", "I can help you create a listing, find parts, set up a business shop, use the Toolbox, access your account, or review marketplace safety. What would you like to do?");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answer = input.trim();
    if (!answer) return;

    addMessage("user", answer);
    setInput("");

    if (!listingStep) {
      answerGeneralQuestion(answer);
      return;
    }

    const updatedDraft = { ...listingDraft, [listingStep]: answer };
    setListingDraft(updatedDraft);
    const currentIndex = listingSteps.indexOf(listingStep);
    const nextStep = listingSteps[currentIndex + 1];

    if (nextStep) {
      setListingStep(nextStep);
      addMessage("gears", language === "es" ? listingPromptsEs[nextStep] : listingPrompts[nextStep]);
      return;
    }

    setListingStep(null);
    const qualitySuggestions = listingQuality(updatedDraft);
    const category = normalizeCategory(updatedDraft.category);
    const condition = normalizeCondition(updatedDraft.condition);
    const numericPrice = updatedDraft.price.match(/\d+(?:\.\d{1,2})?/)?.[0] || "0";

    if (pathname === "/sell") {
      window.dispatchEvent(new CustomEvent("apg:fill-listing", {
        detail: {
          title: updatedDraft.item,
          category,
          condition,
          price: numericPrice,
          location: updatedDraft.location,
          description: updatedDraft.description,
        },
      }));
    }

    const qualityText = qualitySuggestions.length
      ? `Quality check: ${qualitySuggestions.join("; ")}.`
      : "Quality check: your written details are strong. Add clear photos before publishing.";
    addMessage(
      "gears",
      `Your listing plan is ready:\n\nTitle: ${updatedDraft.item}\nCategory: ${category}\nCondition: ${condition}\nPrice: ${updatedDraft.price}\nLocation: ${updatedDraft.location}\nDescription: ${updatedDraft.description}\n\n${qualityText}\n\nAdd photos of the full item, model or part number, connectors, mounting points, and any wear. ${pathname === "/sell" ? "I filled the Sell form for you. Close me to review it, add photos, and publish when ready." : "Open Post an item below when you’re ready."}`,
    );
  }

  if (hiddenOnNews) return null;

  return (
    <aside className={styles.root} aria-label="Gears website assistant">
      {open ? (
        <section className={styles.panel} aria-labelledby="gears-title">
          <div className={styles.header}>
            <div className={styles.avatar} aria-hidden="true">
              <Image
                className={styles.avatarImage}
                src="/gears-head.png"
                width={1240}
                height={1240}
                sizes="64px"
                alt=""
              />
            </div>
            <div className={styles.heading}>
              <strong id="gears-title">Gears</strong>
              <span>{language === "es" ? "Asistente del sitio APG" : "APG website assistant"}</span>
            </div>
            <button className={styles.language} type="button" onClick={() => setLanguage((current) => current === "en" ? "es" : "en")} aria-label="Switch English and Spanish">
              <Languages size={17} aria-hidden="true" /> {language === "en" ? "ES" : "EN"}
            </button>
            <button
              className={styles.close}
              type="button"
              onClick={toggleAssistant}
              aria-label="Close Gears assistant"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.conversation} aria-live="polite">
              {messages.map((message) => (
                <div className={`${styles.message} ${message.role === "user" ? styles.userMessage : styles.gearsMessage}`} key={message.id}>
                  {message.text}
                </div>
              ))}
              <div ref={conversationEnd} />
            </div>
            <form className={styles.chatForm} onSubmit={handleSubmit}>
              <label className={styles.srOnly} htmlFor="gears-message">Ask Gears a question</label>
              <input
                id="gears-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={language === "es" ? "Pregúntale a Gears sobre APG…" : listingStep ? "Type your answer…" : "Ask Gears anything about APG…"}
                autoComplete="off"
              />
              <button className={styles.micButton} type="button" onClick={startVoice} aria-label="Speak to Gears">
                <Mic size={18} aria-hidden="true" />
              </button>
              <button type="submit" aria-label="Send message" disabled={!input.trim()}>
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
            {listening ? <p className={styles.listening} role="status">Listening…</p> : null}
            {!listingStep ? (
              <div className={styles.helperTools}>
                <button className={styles.listingHelper} type="button" onClick={startListingHelp}>Help me create my listing</button>
                <button type="button" onClick={pageGuidance}>Explain this page</button>
                <button type="button" onClick={() => addMessage("gears", photoGuides.default)}>Photo checklist</button>
                <button type="button" onClick={() => csvInput.current?.click()}><FileSpreadsheet size={15} aria-hidden="true" /> Check a CSV</button>
                <input ref={csvInput} className={styles.srOnly} type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) checkCsv(file); event.target.value = ""; }} />
              </div>
            ) : null}
            <p className={styles.quickLabel}>Quick links</p>
            <nav className={styles.actions} aria-label="Gears quick help">
              {actions.map(({ href, label, icon: Icon }) => (
                <Link className={styles.action} href={href} key={href} onClick={() => setOpen(false)}>
                  <Icon size={21} strokeWidth={2.2} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
            <p className={styles.note}>
              Gears provides website guidance only. Buyers and sellers remain responsible for listings,
              payments, fitment, repairs, and safe transactions.
            </p>
          </div>
        </section>
      ) : null}

      {!open && showIntro ? (
        <div className={styles.intro} role="status">
          Hi! I&apos;m Gears. Need help finding your way around APG?
        </div>
      ) : null}

      <button
        className={styles.launcher}
        type="button"
        onClick={toggleAssistant}
        aria-label={open ? "Close Gears assistant" : "Open Gears assistant"}
        aria-expanded={open}
      >
        <Image
          className={styles.gearHead}
          src="/gears-head.png"
          width={1240}
          height={1240}
          sizes="(max-width: 560px) 78px, 88px"
          alt=""
          aria-hidden="true"
          priority
        />
        <span className={styles.statusDot} aria-hidden="true" />
      </button>
    </aside>
  );
}

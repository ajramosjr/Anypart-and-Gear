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
  MessageCircleQuestion,
  ShieldCheck,
  Store,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import { useOctoberAwareness } from "./october-awareness";
import styles from "./gears-assistant.module.css";
import { createClient } from "@/lib/supabase/client";

const actions = [
  { href: "/marketplace#listings", label: "Find parts & gear", icon: Search },
  { href: "/sell", label: "Post an item", icon: Tag },
  { href: "/shops", label: "Explore shops", icon: Store },
  { href: "/toolbox", label: "Open APG Toolbox", icon: Wrench },
  { href: "/account", label: "Account help", icon: CircleHelp },
  { href: "/safety", label: "Marketplace safety", icon: ShieldCheck },
] as const;

type ListingResult = { id: string; title: string; price: number; location: string; imageUrl: string | null };
type Message = { id: number; role: "gears" | "user"; text: string; results?: ListingResult[]; action?: { href: string; label: string; draft?: Record<string, string> } };
type ListingStep = "item" | "category" | "condition" | "price" | "location" | "description" | null;
type RequestStep = "item_type" | "part_name" | "vehicle_year" | "make" | "model" | "engine" | "description" | "condition_preference" | "delivery" | "location" | "postal_code" | null;
type Language = "en" | "es";

const requestSteps: Exclude<RequestStep, null>[] = ["item_type", "part_name", "vehicle_year", "make", "model", "engine", "description", "condition_preference", "delivery", "location", "postal_code"];
const requestPrompts: Record<Exclude<RequestStep, null>, string> = {
  item_type: "What is the part for: a car or truck, motorcycle, boat, trailer, machinery, RC/hobby item, tool, or something else?",
  part_name: "What part do you need? If you are not sure, describe what you want identified.",
  vehicle_year: "What year is the vehicle or equipment? Say ‘unknown’ or ‘not applicable’ when needed.",
  make: "What is the manufacturer or make? Say ‘unknown’ if you do not know.",
  model: "What is the model? Include trim or drivetrain if relevant. Say ‘unknown’ if needed.",
  engine: "What engine size or equipment power specification does it have? Include fuel type if known. Say ‘unknown’ or ‘not applicable’; do not guess.",
  condition_preference: "Would you prefer new, used, or either? For rebuilt or remanufactured, choose either and mention that in the details.",
  delivery: "Do you want local pickup, shipping, or either?",
  description: "What details would help a local business identify it? Include a part number, size, side, color, or visible problem if known.",
  location: "What city and state are you in?",
  postal_code: "What ZIP code should nearby businesses search around?",
};
const requestPromptsEs: Record<Exclude<RequestStep, null>, string> = {
  item_type: "¿Para qué es la pieza: auto o camión, motocicleta, barco, remolque, maquinaria, herramienta u otro equipo?",
  part_name: "¿Qué pieza necesita? Si no sabe el nombre, describa lo que desea identificar.",
  vehicle_year: "¿Cuál es el año del vehículo o equipo? Escriba ‘no sé’ o ‘no aplica’ si corresponde.",
  make: "¿Cuál es la marca o fabricante? Escriba ‘no sé’ si no la conoce.",
  model: "¿Cuál es el modelo? Incluya versión o tracción si corresponde. Puede escribir ‘no sé’.",
  engine: "¿Qué motor o especificación de potencia tiene? Incluya combustible si lo sabe. Escriba ‘no sé’ o ‘no aplica’; no adivine.",
  condition_preference: "¿Prefiere nuevo, usado o cualquiera? Para reconstruido, elija cualquiera y añádalo en los detalles.",
  delivery: "¿Prefiere recogida local, envío o cualquiera?",
  description: "¿Qué detalles ayudarían a identificarla? Incluya número de pieza, tamaño, lado o problema visible si lo sabe.",
  location: "¿En qué ciudad y estado se encuentra?",
  postal_code: "¿Qué código postal deben usar los negocios cercanos?",
};

function requestItemType(answer: string) {
  if (/motorcycle|motorbike|bike|motocicleta|moto/i.test(answer)) return "Motorcycle";
  if (/boat|marine|watercraft|barco|lancha/i.test(answer)) return "Boat";
  if (/trailer|remolque/i.test(answer)) return "Trailer";
  if (/tool|drill|saw|herramienta/i.test(answer)) return "Tool or equipment";
  if (/machin|equipment|tractor|forklift|maquinaria|equipo/i.test(answer)) return "Machinery";
  if (/rc|hobby|drone/i.test(answer)) return "RC or hobby";
  if (/car|truck|auto|vehicle|coche|camión|camion/i.test(answer)) return "Car or truck";
  return "Other";
}

const APG_LINKS_ANSWER = "APG Links is a directory for courses, training, and trusted industry resources. Its categories stay empty until APG receives permission from each provider to publish its name, information, and link. A future listing will not mean the provider sponsors or is partnered with APG unless that relationship is specifically confirmed.";
const APG_LINKS_ANSWER_ES = "APG Links es un directorio de cursos, capacitación y recursos de la industria. Las categorías permanecen vacías hasta que APG reciba permiso de cada proveedor para publicar su nombre, información y enlace. Una publicación no significa que el proveedor patrocine o esté asociado con APG.";
const GEAR_GREETING_LAUNCH = Date.parse("2026-10-01T02:00:00Z");

const scamTerms = /gift card|wire transfer|verification code|security code|crypto|bitcoin|zelle.*deposit|venmo.*friends|cash app.*deposit|pay.*outside|text me|whatsapp/i;

const pageHelp: Record<string, string> = {
  "/": "You’re on the marketplace. I can build a search, explain categories, or help you start a listing.",
  "/sell": "You’re posting an item. I can prepare the details, check the quality, and fill this form.",
  "/shops": "You’re browsing business shops. I can explain business profiles or help locate a specialty.",
  "/shops/register": "You’re setting up a business. I can help write the specialty, description, services, and hours.",
  "/messages": "You’re in APG Messages. I can suggest a reply and check it for scam warning signs.",
  "/toolbox": "You’re in the Toolbox. Tell me the job and I’ll point you to the right chart or calculator.",
  "/links": "You’re on APG Links, a directory for courses, training, and trusted industry resources. Provider listings stay empty until APG receives permission to add them.",
  "/parts-wanted": "You’re on Parts Wanted. I can help prepare a request for a part you cannot find.",
  "/parts-wanted/new": "I can help prepare your request. Review every detail and add photos before you post it.",
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

function GearPortrait() {
  return (
    <picture className={styles.gearPortrait} aria-hidden="true">
      <source media="(prefers-reduced-motion: reduce)" srcSet="/gear-front.webp" />
      <img src="/gear-blinking.webp" alt="" width={600} height={600} />
    </picture>
  );
}

export function GearsAssistant() {
  const pathname = usePathname();
  const october = useOctoberAwareness();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [audience, setAudience] = useState<"customer" | "business" | null>(null);
  const [input, setInput] = useState("");
  const [listingStep, setListingStep] = useState<ListingStep>(null);
  const [listingDraft, setListingDraft] = useState<Record<string, string>>({});
  const [requestStep, setRequestStep] = useState<RequestStep>(null);
  const [requestDraft, setRequestDraft] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<Language>("en");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "gears", text: "Hi, I’m Gear. Find a part, connect with a shop, or get your business started." },
  ]);
  const nextMessageId = useRef(2);
  const conversationEnd = useRef<HTMLDivElement>(null);

  const hiddenOnNews = pathname.startsWith("/tech-wire");

  useEffect(() => {
    async function personalizeGreeting() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      const metadata = data.user?.user_metadata as Record<string, unknown> | undefined;
      const rawName = [metadata?.first_name, metadata?.full_name, metadata?.name]
        .find((value) => typeof value === "string" && value.trim()) as string | undefined;
      const name = rawName?.trim().split(/\s+/)[0]?.replace(/[^\p{L}\p{M}'-]/gu, "").slice(0, 30) || "";
      const key = `apg-gear-greeted-${user.id}`;
      const introduced = metadata?.gear_introduced === true || window.localStorage.getItem(key) === "true" || Date.parse(user.created_at) < GEAR_GREETING_LAUNCH;
      const salutation = name ? `Welcome back, ${name}!` : "Welcome back!";
      setMessages((current) => current.map((message, index) => index === 0 && message.role === "gears"
        ? { ...message, text: introduced ? `${salutation} What can I help you find on APG?` : `Hi${name ? ` ${name}` : ""}, I’m Gear. Ask me how to use APG, find something, or create a strong listing.` }
        : message));
      window.localStorage.setItem(key, "true");
      if (metadata?.gear_introduced !== true) {
        void supabase.auth.updateUser({ data: { gear_introduced: true } });
      }
    }
    void personalizeGreeting();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { try { setHidden(window.localStorage.getItem("apg-gear-hidden-v1") === "true"); } catch { /* Storage is optional. */ } });
    const show = () => { setHidden(false); setOpen(true); try { window.localStorage.setItem("apg-gear-hidden-v1", "false"); } catch {} };
    window.addEventListener("apg-show-gear", show);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("apg-show-gear", show); };
  }, []);

  useEffect(() => {
    conversationEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function toggleAssistant() {
    setOpen((current) => !current);
  }

  function addMessage(role: Message["role"], text: string, extra?: Pick<Message, "results" | "action">) {
    setMessages((current) => [...current, { id: nextMessageId.current++, role, text, ...extra }]);
  }

  function startListingHelp() {
    setRequestStep(null);
    setListingDraft({});
    setListingStep("item");
    addMessage("gears", language === "es" ? listingPromptsEs.item : listingPrompts.item);
  }

  function startRequestHelp() {
    setListingStep(null);
    setRequestDraft({});
    setRequestStep("item_type");
    addMessage("gears", language === "es" ? `Preparemos una solicitud de pieza. Revisará el formulario antes de publicarlo. ${requestPromptsEs.item_type}` : `Let’s prepare a Parts Wanted request. You’ll review the form before anything is posted. Do not include a VIN, phone number, email, or street address. ${requestPrompts.item_type}`);
  }

  async function searchListings(query: string) {
    const term = query.trim().slice(0, 80);
    if (!term) { addMessage("gears", "Tell me a part name, model, or number to search APG listings."); return; }
    try {
      const response = await fetch(`/api/gear/search?q=${encodeURIComponent(term)}`);
      const data = await response.json() as { results?: ListingResult[]; error?: string };
      if (!response.ok) { addMessage("gears", data.error || "I couldn’t search listings right now."); return; }
      addMessage("gears", data.results?.length ? `Here are live APG listings matching “${term}”. Check the part number and fitment with the seller.` : `I found no active APG listings matching “${term}”. I can help you prepare a Parts Wanted request.`, {
        results: data.results,
        ...(!data.results?.length ? { action: { href: "/parts-wanted/new", label: "Open Parts Wanted" } } : {}),
      });
    } catch { addMessage("gears", "I couldn’t search listings right now. Please try again."); }
  }

  function pageGuidance() {
    const fallback = pathname.startsWith("/listing/")
      ? "You’re viewing a listing. I can suggest seller questions, fitment checks, and safe transaction steps."
      : pathname.startsWith("/shops/")
        ? "You’re viewing a business profile. I can help you explore its services or prepare a message."
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
    if (!window.confirm(language === "es" ? "La entrada de voz puede enviar audio al servicio de reconocimiento de su navegador. No dicte VIN ni datos personales. Puede escribir en su lugar. ¿Usar voz?" : "Voice entry may send audio to your browser’s speech recognition provider. Do not dictate VINs or personal information. You can type instead. Use voice entry?")) return;
    const recognition = new RecognitionApi();
    recognition.lang = language === "es" ? "es-US" : "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => setInput(event.results[0]?.[0]?.transcript || "");
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); addMessage("gears", "I couldn’t hear that clearly. Please try again or type your answer."); };
    setListening(true);
    recognition.start();
  }

  function answerGeneralQuestion(question: string) {
    const normalized = question.toLowerCase();

    if (language === "es") {
      if (/solicitud|pieza buscada|no encuentro/.test(normalized)) { startRequestHelp(); return; }
      if (/vender|publicar|anuncio/.test(normalized)) { startListingHelp(); return; }
      if (/buscar|comprar|necesito|pieza/.test(normalized)) { void searchListings(question.replace(/^(buscar|comprar|necesito|busco)\s*/i, "")); return; }
      if (/negocio|tienda|inventario|csv/.test(normalized)) { addMessage("gears", "Puede crear un perfil comercial gratuito con su especialidad, servicios, horario y sitio web. Los clientes pueden contactar a su negocio. Publicar artículos o cargar inventario es opcional y puede hacerlo después."); return; }
      if (/seguro|estafa|pago/.test(normalized)) { addMessage("gears", "Use un lugar público seguro, revise el artículo antes de pagar, use pagos protegidos y nunca comparta contraseñas ni códigos de verificación."); return; }
      if (/herramienta|taladro|rosca|medida/.test(normalized)) { addMessage("gears", "APG Toolbox incluye tablas de taladro y rosca, guía de cinta métrica, conversiones, cálculos y referencias imprimibles."); return; }
      if (/curso|capacitación|escuela|proveedor|apg[\s-]*links/.test(normalized)) { addMessage("gears", APG_LINKS_ANSWER_ES); return; }
      addMessage("gears", "Puedo ayudarle a crear un anuncio, buscar piezas, preparar una solicitud de pieza, configurar una tienda, usar Toolbox o verificar la seguridad. ¿Qué desea hacer?");
      return;
    }

    if (scamTerms.test(question)) {
      addMessage("gears", "⚠️ Scam warning: this message contains a risky payment or contact phrase. Do not share verification codes or passwords, avoid gift cards and unprotected transfers, and keep records inside APG Messages.");
      return;
    }

    if (/parts wanted|request a part|request parts|can.t find|cannot find|no listing matches/.test(normalized)) {
      startRequestHelp();
    } else if (/^(find|search|buy|looking for|i need|show me|do you have)\b/.test(normalized)) {
      void searchListings(question.replace(/^(find|search for|search|buy|looking for|i need|show me|do you have)\s*/i, ""));
    } else if (/apg[\s-]*links|course|training|school|provider directory|education resource/.test(normalized)) {
      addMessage("gears", APG_LINKS_ANSWER);
    } else if (/sell|post|list|listing/.test(normalized)) {
      startListingHelp();
    } else if (/fit|fitment|year|make|model|engine|trim|part number/.test(normalized)) {
      addMessage("gears", "Fitment checklist: record the year, make, model, engine, trim, drivetrain, OEM/part number, measurements, connector count, and mounting points. Add: ‘Buyer must verify compatibility before purchase.’");
    } else if (/photo|picture|image/.test(normalized)) {
      const guide = /boat|marine|prop|outboard/.test(normalized) ? photoGuides.marine : /trailer/.test(normalized) ? photoGuides.trailer : /tool|drill|saw/.test(normalized) ? photoGuides.tool : /car|truck|vehicle|engine|part/.test(normalized) ? photoGuides.vehicle : photoGuides.default;
      addMessage("gears", guide);
    } else if (/part|where can i get/.test(normalized)) {
      void searchListings(question);
    } else if (/business|shop|inventory|bulk/.test(normalized)) {
      addMessage("gears", "Businesses can create a free APG profile to promote their specialty, services, hours and website, and let buyers contact them directly. Listing individual parts is optional. To add an individual item later, use Post an item. APG reviews public business details before unlocking Parts Wanted requests.");
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

    if (requestStep) {
      if (/^(cancel|stop|never mind|cancelar)$/i.test(answer)) {
        setRequestStep(null);
        setRequestDraft({});
        addMessage("gears", "Okay, I stopped the request draft. Nothing was posted.");
        return;
      }
      const unknown = /^(skip|unknown|not sure|not applicable|n\/?a|omitir|no sé|no se|no aplica)$/i.test(answer);
      if (/\b[A-HJ-NPR-Z0-9]{17}\b/i.test(answer) || /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(answer)) {
        addMessage("gears", language === "es" ? "No incluya VIN ni correo electrónico. Repita la respuesta sin esos datos." : "Please leave out VINs and email addresses. Answer again without those details.");
        return;
      }
      if (requestStep === "vehicle_year" && !unknown && !/^(18[89]\d|19\d{2}|20\d{2}|2100)$/.test(answer)) {
        addMessage("gears", "Enter a four-digit year from 1886 to 2100, or say unknown / not applicable."); return;
      }
      if (requestStep === "vehicle_year" && !unknown && Number(answer) < 1886) {
        addMessage("gears", "Enter a year from 1886 to 2100, or say unknown / not applicable."); return;
      }
      if (requestStep === "postal_code" && !/^\d{5}(?:-\d{4})?$/.test(answer)) {
        addMessage("gears", "Enter a US ZIP code, such as 11783 or 11783-1234."); return;
      }
      const condition = /^(new|nuevo)$/i.test(answer) ? "New" : /^(used|usado)$/i.test(answer) ? "Used" : /^(either|any|cualquiera|ambos)$/i.test(answer) ? "Either" : "";
      if (requestStep === "condition_preference" && !condition) {
        addMessage("gears", language === "es" ? requestPromptsEs.condition_preference : requestPrompts.condition_preference); return;
      }
      if (requestStep === "description" && !unknown && answer.length < 10) {
        addMessage("gears", "Add a little more detail (at least 10 characters), or say unknown."); return;
      }
      if (requestStep === "location" && answer.length < 2) {
        addMessage("gears", language === "es" ? requestPromptsEs.location : requestPrompts.location); return;
      }
      const delivery = /^(local pickup|pickup|pick up|recogida local|recogida)$/i.test(answer) ? "Local pickup" : /^(shipping|ship|envío|envio)$/i.test(answer) ? "Shipping" : /^(either|any|cualquiera|ambos)$/i.test(answer) ? "Either" : "";
      if (requestStep === "delivery" && !delivery) {
        addMessage("gears", language === "es" ? requestPromptsEs.delivery : requestPrompts.delivery); return;
      }
      const updated = { ...requestDraft, [requestStep]: requestStep === "condition_preference" ? condition : requestStep === "delivery" ? delivery : unknown ? "" : answer };
      setRequestDraft(updated);
      const next = requestSteps[requestSteps.indexOf(requestStep) + 1];
      if (next) { setRequestStep(next); addMessage("gears", language === "es" ? requestPromptsEs[next] : requestPrompts[next]); return; }

      setRequestStep(null);
      const part = updated.part_name?.trim() || "";
      const unsure = !part || /^(unsure|help identify|no estoy seguro|identificar)/i.test(part);
      const draft = {
        request_kind: unsure ? "help_identify" : "known_part",
        item_type: requestItemType(updated.item_type || ""),
        part_name: unsure ? "" : part.slice(0, 160),
        vehicle_year: updated.vehicle_year || "",
        make: (updated.make || "").slice(0, 100),
        model: (updated.model || "").slice(0, 100),
        engine: (updated.engine || "").slice(0, 160),
        delivery: (updated.delivery || "").slice(0, 100),
        condition_preference: updated.condition_preference || "Either",
        description: (updated.description || "Details not yet known; please help identify the correct part.").slice(0, 1600),
        location: (updated.location || "").slice(0, 120),
        postal_code: (updated.postal_code || "").slice(0, 12),
      };
      const summary = `Part: ${draft.part_name || "Help identify"}\nVehicle/equipment: ${draft.vehicle_year || "Year unknown"} ${draft.make || "Make unknown"} ${draft.model || "Model unknown"}\nEngine/specification: ${draft.engine || "Unknown / not applicable"}\nCondition: ${draft.condition_preference}\nDelivery: ${draft.delivery || "Not specified"}\nArea: ${draft.location}, ${draft.postal_code}`;
      addMessage("gears", `${summary}\n\nReview and edit the form, add photos of the part and its markings, and confirm before posting. Unknown details need supplier confirmation. Do not upload VIN plates or personal documents.`, {
        action: { href: "/parts-wanted/new", label: "Review Parts Wanted draft", draft },
      });
      return;
    }

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

  if (hiddenOnNews || hidden) return null;

  return (
    <aside className={`${styles.root} ${october ? styles.october : ""}`} aria-label="Gear website assistant">
      {open ? (
        <section className={styles.panel} aria-labelledby="gears-title">
          <div className={styles.header}>
            <div className={styles.headerGears} aria-hidden="true">{[0,1,2,3,4].map((gear) => <svg key={gear} viewBox="0 0 100 100"><g fill="none" stroke="currentColor" strokeWidth="5"><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="12"/>{Array.from({length: 12}, (_, tooth) => <path key={tooth} d="M50 12V22" transform={`rotate(${tooth * 30} 50 50)`}/>)}</g></svg>)}</div>
            <div className={styles.industrialAvatar}><GearPortrait /></div>
            <div className={styles.heading}>
              <strong id="gears-title">Ask APG</strong>
              <span>{language === "es" ? "Asistente del sitio APG" : "Your APG assistant"}</span>
            </div>
            <button className={styles.language} type="button" onClick={() => setLanguage((current) => current === "en" ? "es" : "en")} aria-label="Switch English and Spanish">
              <Languages size={17} aria-hidden="true" /> {language === "en" ? "ES" : "EN"}
            </button>
            <button
              className={styles.close}
              type="button"
              onClick={toggleAssistant}
              aria-label="Close Gear assistant"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.conversation} aria-live="polite">
              {messages.map((message) => (
                <div className={`${styles.message} ${message.role === "user" ? styles.userMessage : styles.gearsMessage}`} key={message.id}>
                  {message.text}
                  {message.results?.length ? <div className="mt-3 grid gap-2">{message.results.map((item) => <Link key={item.id} href={`/listing/${item.id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 text-[#071a35] hover:border-amber-500">
                    {item.imageUrl ? <Image src={item.imageUrl} alt="" width={52} height={52} className="size-13 shrink-0 rounded-md object-cover" /> : <span className="grid size-13 shrink-0 place-items-center rounded-md bg-slate-100"><Search size={19}/></span>}
                    <span className="min-w-0"><strong className="block truncate text-sm">{item.title}</strong><small className="block text-xs">${Number(item.price).toLocaleString()} · {item.location}</small></span>
                  </Link>)}</div> : null}
                  {message.action ? <Link href={message.action.href} onClick={() => {
                    if (message.action?.draft) {
                      try { window.sessionStorage.setItem("apg-part-request-draft", JSON.stringify({ draft: message.action.draft, createdAt: Date.now() })); }
                      catch { /* The user can still complete the blank form. */ }
                    }
                    setOpen(false);
                  }} className="mt-3 inline-flex rounded-lg bg-amber-400 px-3 py-2 text-sm font-bold text-[#071a35]">{message.action.label}</Link> : null}
                </div>
              ))}
              <div ref={conversationEnd} />
            </div>
            {!listingStep && !requestStep && <nav className={styles.audienceChoices} aria-label="Choose how Gear can help">
              <button type="button" aria-pressed={audience === "customer"} onClick={() => setAudience(audience === "customer" ? null : "customer")}><Search size={18} aria-hidden="true"/>{language === "es" ? "Buscar piezas o servicios" : "Find parts or services"}</button>
              <button type="button" aria-pressed={audience === "business"} onClick={() => setAudience(audience === "business" ? null : "business")}><Store size={18} aria-hidden="true"/>{language === "es" ? "Hacer crecer mi negocio" : "Grow my business"}</button>
            </nav>}
            {audience && !listingStep && !requestStep && <div className={styles.supportTools}>
              <p className={styles.quickLabel}>{audience === "customer" ? "Find what you need" : "Your business on APG"}</p>
              <nav className={styles.actions} aria-label="Helpful APG links">
                {(audience === "customer" ? actions.filter(action => ["/marketplace#listings", "/shops", "/toolbox"].includes(action.href)) : [
                  { href: "/shops/register", label: "Create business profile", icon: Store },
                  { href: "/sell", label: "List an item", icon: Tag },
                  { href: "/messages", label: "APG Messages", icon: MessageCircleQuestion },
                ]).map(({href, label, icon: Icon}) => <Link className={styles.action} key={href} href={href} onClick={() => setOpen(false)}><Icon size={18} aria-hidden="true"/>{label}</Link>)}
              </nav>
              {audience === "business" && <p className={styles.businessHint}>Add your website to your business profile. Inventory listings are optional.</p>}
              <div className={styles.helperTools}>
                {audience === "business" ? <button type="button" onClick={startListingHelp}>Help me create my listing</button> : <button type="button" onClick={startRequestHelp}>Help me request a part</button>}
                <button type="button" onClick={pageGuidance}>Explain this page</button>
                {audience === "business" && <button type="button" onClick={() => addMessage("gears", photoGuides.default)}>Photo checklist</button>}
              </div>
            </div>}
            <form className={styles.chatForm} onSubmit={handleSubmit}>
              <label className={styles.srOnly} htmlFor="gears-message">Ask Gear a question</label>
              <input
                id="gears-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={language === "es" ? "Pregúntale a Gear sobre APG…" : listingStep || requestStep ? "Type your answer…" : "Ask Gear anything about APG…"}
                autoComplete="off"
              />
              <button className={styles.micButton} type="button" onClick={startVoice} aria-label="Speak to Gear">
                <Mic size={18} aria-hidden="true" />
              </button>
              <button type="submit" aria-label="Send message" disabled={!input.trim()}>
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
            {listening ? <p className={styles.listening} role="status">Listening…</p> : null}
            <p className={styles.note}>
              Gear provides website guidance only. Buyers and sellers remain responsible for listings,
              payments, fitment, repairs, and safe transactions.
            </p>
          </div>
        </section>
      ) : null}

      {!open && <button className={styles.industrialLauncher} type="button" onClick={toggleAssistant} aria-label="Open APG assistant" aria-expanded={open}>
        <GearPortrait /><strong>Ask APG</strong>
      </button>}
      <button className={styles.hideGear} type="button" onClick={() => { setHidden(true); setOpen(false); try { window.localStorage.setItem("apg-gear-hidden-v1", "true"); } catch {} }}>Hide Gear</button>

    </aside>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  CircleHelp,
  Search,
  Send,
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

const listingPrompts: Record<Exclude<ListingStep, null>, string> = {
  item: "What are you selling? Include the brand and part name if you know them.",
  category: "Which category fits it best—car parts, boat parts, trailers, tools, machinery, motorcycles, RC & hobby, workwear, vehicles, or other?",
  condition: "What condition is it in—new, like new, good, fair, or for parts?",
  price: "What price would you like to ask? You can also say negotiable or trade.",
  location: "What city and state is the item located in?",
  description: "Finally, tell me any model numbers, fitment details, defects, or important information a buyer should know.",
};

const listingSteps: Exclude<ListingStep, null>[] = [
  "item",
  "category",
  "condition",
  "price",
  "location",
  "description",
];

export function GearsAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [input, setInput] = useState("");
  const [listingStep, setListingStep] = useState<ListingStep>(null);
  const [listingDraft, setListingDraft] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "gears", text: "Hi, I’m Gears. Ask me how to use APG, find something, or create a strong listing." },
  ]);
  const nextMessageId = useRef(2);
  const conversationEnd = useRef<HTMLDivElement>(null);

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
    addMessage("gears", listingPrompts.item);
  }

  function answerGeneralQuestion(question: string) {
    const normalized = question.toLowerCase();

    if (/sell|post|list|listing/.test(normalized)) {
      startListingHelp();
    } else if (/find|search|buy|part/.test(normalized)) {
      addMessage("gears", "Use the marketplace search and category filters to narrow the results. Open a listing to contact the seller directly. APG does not process the payment.");
    } else if (/business|shop|inventory|bulk/.test(normalized)) {
      addMessage("gears", "Businesses can create a shop and bulk-upload inventory. Choose Explore shops below, or open the business setup link on the Sell page.");
    } else if (/account|sign in|login|password|email/.test(normalized)) {
      addMessage("gears", "For account access, open Account help below. If your password is rejected, use Forgot password and check your spam folder for the reset email.");
    } else if (/safe|scam|payment|shipping/.test(normalized)) {
      addMessage("gears", "Meet in a safe public place when possible, inspect items before paying, use protected payment methods, and never send verification codes or gift cards.");
    } else if (/tool|chart|drill|tap|measure/.test(normalized)) {
      addMessage("gears", "The APG Toolbox includes drill-and-tap charts, a tape-measure guide, calculators, and printable workshop references. Use Open APG Toolbox below.");
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
      addMessage("gears", listingPrompts[nextStep]);
      return;
    }

    setListingStep(null);
    addMessage(
      "gears",
      `Your listing plan is ready:\n\nTitle: ${updatedDraft.item}\nCategory: ${updatedDraft.category}\nCondition: ${updatedDraft.condition}\nPrice: ${updatedDraft.price}\nLocation: ${updatedDraft.location}\nDescription: ${updatedDraft.description}\n\nAdd clear photos of the full item, model or part number, connectors, mounting points, and any wear. ${pathname === "/sell" ? "You can enter these details in the form behind me." : "Open Post an item below when you’re ready."}`,
    );
  }

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
              <span>APG website assistant</span>
            </div>
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
                placeholder={listingStep ? "Type your answer…" : "Ask Gears anything about APG…"}
                autoComplete="off"
              />
              <button type="submit" aria-label="Send message" disabled={!input.trim()}>
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
            {!listingStep ? (
              <button className={styles.listingHelper} type="button" onClick={startListingHelp}>
                Help me create my listing
              </button>
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

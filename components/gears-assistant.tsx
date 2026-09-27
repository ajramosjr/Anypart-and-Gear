"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CircleHelp,
  Search,
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

export function GearsAssistant() {
  const [open, setOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

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

  function toggleAssistant() {
    setOpen((current) => !current);
    setShowIntro(false);
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
            <p className={styles.greeting}>
              Hi, I&apos;m Gears. What would you like help with?
            </p>
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

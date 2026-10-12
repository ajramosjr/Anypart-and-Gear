"use client";
import { createContext, useContext } from "react";
import Link from "next/link";
const TechWireContext = createContext(false);
export function TechWireNavigationProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return <TechWireContext.Provider value={enabled}>{children}</TechWireContext.Provider>;
}
export function TechWireLink(props: React.ComponentProps<typeof Link>) {
  return useContext(TechWireContext) ? <Link {...props} /> : null;
}

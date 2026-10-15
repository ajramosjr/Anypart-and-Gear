"use client";
import { createContext, useContext } from "react";
import Link from "next/link";
const BuildIdeasContext = createContext(false);
export function BuildIdeasNavigationProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return <BuildIdeasContext.Provider value={enabled}>{children}</BuildIdeasContext.Provider>;
}
export function BuildIdeasLink(props: React.ComponentProps<typeof Link>) {
  return useContext(BuildIdeasContext) ? <Link {...props} /> : null;
}

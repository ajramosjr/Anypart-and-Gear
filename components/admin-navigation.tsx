"use client";
import { createContext, useContext } from "react";
import Link from "next/link";
const AdminNavigationContext = createContext(false);
export function AdminNavigationProvider({ isAdmin, children }: { isAdmin: boolean; children: React.ReactNode }) {
  return <AdminNavigationContext.Provider value={isAdmin}>{children}</AdminNavigationContext.Provider>;
}
export function AdminNavigationLink({ className }: { className?: string }) {
  return useContext(AdminNavigationContext) ? <Link href="/admin" className={className}>Admin dashboard</Link> : null;
}

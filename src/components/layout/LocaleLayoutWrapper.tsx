"use client";

import { usePathname } from "next/navigation";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function LocaleLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <div className="flex min-h-screen flex-col">
      <VisitTracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

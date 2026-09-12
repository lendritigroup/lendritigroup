"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, FileText, LayoutDashboard, LogOut, MessageSquare, Plus, Truck } from "lucide-react";
import { localePath } from "@/lib/paths";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const first = pathname.split("/").filter(Boolean)[0];
  const locale = locales.includes(first as Locale) ? (first as Locale) : defaultLocale;

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/machines", label: "Machines", icon: Truck },
    { href: "/admin/machines/new", label: "Add machine", icon: Plus },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/admin/content", label: "Website texts", icon: FileText },
  ];

  return (
    <aside className="flex w-full flex-col bg-navy text-white lg:min-h-screen lg:w-64">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <BrandLogo onDark width={140} height={44} imgClassName="h-10" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const full = localePath(locale, href);
          const active = pathname === full || (href !== "/admin" && pathname.startsWith(full));
          return (
            <Link
              key={href}
              href={full}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium",
                active ? "bg-white/10 text-brass" : "text-white/80 hover:bg-white/5"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link href={localePath(locale, "/")} className="block px-3 py-2 text-xs text-white/60 hover:text-white">
          View website
        </Link>
        <button
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/80 hover:text-white"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push(localePath(locale, "/login"));
            router.refresh();
          }}
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm({
  variant = "contact",
}: {
  variant?: "contact" | "sell";
}) {
  const t = useTranslations("contact");
  const ts = useTranslations("sell");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [pending, setPending] = useState(false);
  const isSell = variant === "sell";

  return (
    <form
      className="space-y-4 border border-border bg-card p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setStatus("idle");
        const form = new FormData(e.currentTarget);
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.get("name"),
            email: form.get("email"),
            phone: form.get("phone"),
            message: form.get("message"),
            machineName: isSell ? form.get("machineName") : null,
            kind: isSell ? "sell" : "contact",
          }),
        });
        setPending(false);
        setStatus(res.ok ? "ok" : "error");
        if (res.ok) e.currentTarget.reset();
      }}
    >
      <label className="block text-sm">
        {t("name")}
        <input name="name" className="mt-1 h-10 w-full border border-border px-3" />
      </label>
      <label className="block text-sm">
        {t("email")}
        <input name="email" type="email" className="mt-1 h-10 w-full border border-border px-3" />
      </label>
      <label className="block text-sm">
        {t("phone")}
        <input name="phone" className="mt-1 h-10 w-full border border-border px-3" />
      </label>
      {isSell && (
        <label className="block text-sm">
          {ts("machineWhich")}
          <input
            name="machineName"
            className="mt-1 h-10 w-full border border-border px-3"
            placeholder={ts("machineWhichHint")}
          />
        </label>
      )}
      <label className="block text-sm">
        {isSell ? ts("details") : t("message")}
        {isSell && <span className="mt-1 block text-xs font-normal text-muted-foreground">{ts("detailsHint")}</span>}
        <textarea
          name="message"
          rows={6}
          className="mt-1 w-full border border-border px-3 py-2"
          placeholder={isSell ? ts("detailsPlaceholder") : t("messageHint")}
        />
      </label>
      <button disabled={pending} className="h-11 bg-navy px-6 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-60">
        {pending ? "..." : isSell ? ts("cta") : t("send")}
      </button>
      {status === "ok" && <p className="text-sm text-green-800">{t("success")}</p>}
      {status === "error" && <p className="text-sm text-destructive">{t("error")}</p>}
    </form>
  );
}

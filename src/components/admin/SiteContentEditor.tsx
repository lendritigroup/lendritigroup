"use client";

import { useMemo, useState } from "react";
import { locales, localeNames, type Locale } from "@/i18n/config";
import {
  SITE_CONTENT_FIELDS,
  type SiteContentDraft,
} from "@/lib/site-content";

export function SiteContentEditor({ initial }: { initial: SiteContentDraft }) {
  const [draft, setDraft] = useState(initial);
  const [locale, setLocale] = useState<Locale>("sq");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");

  const groups = useMemo(() => {
    const map = new Map<string, typeof SITE_CONTENT_FIELDS>();
    for (const field of SITE_CONTENT_FIELDS) {
      const list = map.get(field.group) ?? [];
      list.push(field);
      map.set(field.group, list);
    }
    return [...map.entries()];
  }, []);

  return (
    <form
      className="space-y-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("saving");
        const res = await fetch("/api/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        setStatus(res.ok ? "ok" : "error");
      }}
    >
      <div className="flex flex-wrap gap-2">
        {locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            className={`h-9 px-4 text-xs font-semibold uppercase tracking-wider ${
              locale === loc ? "bg-navy text-white" : "border border-border bg-white text-navy"
            }`}
          >
            {localeNames[loc]}
          </button>
        ))}
      </div>

      {groups.map(([group, fields]) => (
        <section key={group} className="border border-border bg-card p-6">
          <h2 className="text-xl">{group}</h2>
          <div className="mt-5 space-y-5">
            {fields.map((field) => (
              <label key={field.key} className="block text-sm">
                <span className="font-medium">{field.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{field.hint}</span>
                <textarea
                  rows={field.rows}
                  value={draft[field.key][locale]}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      [field.key]: { ...prev[field.key], [locale]: e.target.value },
                    }))
                  }
                  className="mt-2 w-full border border-border px-3 py-2"
                />
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-4">
        <button
          disabled={status === "saving"}
          className="h-11 bg-navy px-6 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save texts"}
        </button>
        {status === "ok" && <p className="text-sm text-green-800">Saved. The website now shows the new texts.</p>}
        {status === "error" && <p className="text-sm text-destructive">Could not save. Try again.</p>}
      </div>
    </form>
  );
}

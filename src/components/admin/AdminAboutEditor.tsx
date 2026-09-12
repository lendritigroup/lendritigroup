"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Page } from "@/types/database";

const locales = ["sq", "en", "de", "sr", "mk"] as const;
const localeLabels: Record<string, string> = {
  sq: "Shqip",
  en: "English",
  de: "Deutsch",
  sr: "Srpski",
  mk: "Makedonski",
};

export function AdminAboutEditor({ page }: { page: Page | null }) {
  const [content, setContent] = useState<Record<string, string>>({
    sq: page?.content_sq ?? "",
    en: page?.content_en ?? "",
    de: page?.content_de ?? "",
    sr: page?.content_sr ?? "",
    mk: page?.content_mk ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("pages").upsert(
      {
        key: "about",
        content_sq: content.sq,
        content_en: content.en,
        content_de: content.de,
        content_sr: content.sr,
        content_mk: content.mk,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sq">
        <TabsList>
          {locales.map((loc) => (
            <TabsTrigger key={loc} value={loc}>
              {localeLabels[loc]}
            </TabsTrigger>
          ))}
        </TabsList>
        {locales.map((loc) => (
          <TabsContent key={loc} value={loc}>
            <div>
              <Label>Content ({localeLabels[loc]})</Label>
              <Textarea
                value={content[loc]}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, [loc]: e.target.value }))
                }
                rows={15}
                className="mt-1 font-mono text-sm"
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

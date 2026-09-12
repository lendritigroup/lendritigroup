"use client";

import { useTranslations } from "next-intl";
import type { Category } from "@/types/database";

export function AdminCategoriesList({
  locale,
  categories,
}: {
  locale: string;
  categories: Category[];
}) {
  const nameKey = `name_${locale}` as keyof Category;

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-4">Slug</th>
            <th className="text-left p-4">Name</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="p-4 font-mono text-sm">{cat.slug}</td>
              <td className="p-4">{(cat[nameKey] as string) || cat.name_sq}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { setRequestLocale } from "next-intl/server";
import { buildReports } from "@/lib/reports";
import { ReportsClient } from "@/components/admin/ReportsClient";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReportsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const report = await buildReports({
    preset: get("preset"),
    from: get("from"),
    to: get("to"),
    category: get("category"),
    manufacturer: get("manufacturer"),
    sold: get("sold"),
    result: get("result"),
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl">Reports</h1>
      <ReportsClient
        report={report}
        values={{
          preset: get("preset"),
          from: get("from"),
          to: get("to"),
          category: get("category"),
          manufacturer: get("manufacturer"),
          sold: get("sold"),
          result: get("result"),
        }}
      />
    </div>
  );
}

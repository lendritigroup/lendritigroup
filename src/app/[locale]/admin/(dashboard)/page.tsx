import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { listAdminMachines } from "@/lib/machines";
import { buildReports } from "@/lib/reports";
import { getVisitCount } from "@/lib/visits";
import { formatMoney } from "@/lib/finance";
import { localePath } from "@/lib/paths";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminMachinesTable } from "@/components/admin/AdminMachinesTable";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminDashboard({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [machines, report, visits] = await Promise.all([listAdminMachines(), buildReports(), getVisitCount()]);
  const unsold = machines.filter((m) => m.status !== "sold" && m.status !== "archived").length;

  const cards: { label: string; value: string | number; hint?: string }[] = [
    { label: "Site visits", value: visits.toLocaleString(locale), hint: "One count per visit. Admin browsing is excluded." },
    { label: "Active listings", value: report.sales.forSale },
    { label: "Sold", value: report.sales.sold },
    { label: "Reserved", value: report.sales.reserved },
    { label: "Unsold", value: unsold },
    { label: "Total inventory value", value: formatMoney(report.inventory.inventoryValue) },
    { label: "Total sales", value: formatMoney(report.financial.received) },
    { label: "Total profit", value: formatMoney(report.financial.totalProfit) },
    { label: "Total loss", value: formatMoney(report.financial.totalLoss) },
  ];

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Private</p>
          <h1 className="mt-1 text-3xl">Dashboard</h1>
        </div>
        <Link href={localePath(locale, "/admin/machines/new")} className="bg-navy px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">
          Add machine
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{c.value}</p>
              {c.hint ? <p className="mt-2 text-xs text-muted-foreground">{c.hint}</p> : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl">All machines</h2>
        <AdminMachinesTable machines={machines} locale={locale} />
      </div>
    </div>
  );
}

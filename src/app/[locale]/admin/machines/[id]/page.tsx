import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAdminMachine } from "@/lib/machines";
import { formatMoney, formatPercent, summarizeFinance } from "@/lib/finance";
import { localePath } from "@/lib/paths";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function TransactionPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const machine = await getAdminMachine(id);
  if (!machine) notFound();
  const fin = summarizeFinance(machine);

  const rows = [
    ["Purchase", formatMoney(machine.purchasePrice, machine.purchaseCurrency)],
    ["Transport", formatMoney(machine.transportCost)],
    ["Repairs", formatMoney(machine.repairCost)],
    ["Other purchase costs", formatMoney(machine.otherPurchaseCosts)],
    ["Total investment", formatMoney(fin.totalInvestment)],
    ["Original asking price", formatMoney(machine.askingPrice, machine.currency)],
    ["Actual selling price", formatMoney(machine.actualSellingPrice, machine.sellingCurrency)],
    ["Selling costs", formatMoney(machine.sellingCosts)],
    ["Other sale costs", formatMoney(machine.otherSaleCosts)],
    [fin.isLoss ? "Loss" : "Profit", formatMoney(fin.netResult)],
    ["Profit margin", formatPercent(fin.profitPercentage)],
  ] as const;

  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Private transaction</p>
      <h1 className="mt-2 text-3xl">{machine.manufacturer} {machine.model}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {machine.supplier ? `Supplier: ${machine.supplier}` : ""}
        {machine.buyer ? ` · Buyer: ${machine.buyer}` : ""}
      </p>
      <dl className="mt-8 border border-border bg-card">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between border-b px-4 py-3 text-sm last:border-0">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className={`font-medium ${label === "Loss" ? "text-destructive" : ""}`}>{value}</dd>
          </div>
        ))}
      </dl>
      {machine.saleNotes && <p className="mt-4 text-sm text-muted-foreground">{machine.saleNotes}</p>}
      <div className="mt-6 flex gap-4 text-sm">
        <Link href={localePath(locale, `/admin/machines/${machine.id}/edit`)} className="underline">Edit listing</Link>
        <Link href={localePath(locale, "/admin/machines")} className="underline">Back to machines</Link>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "@/lib/finance";

const COLORS = ["#0b1f3a", "#b0892c", "#3d5a80", "#6b7280"];

type Report = Awaited<ReturnType<typeof import("@/lib/reports").buildReports>>;

export function ReportsClient({
  report,
  values,
}: {
  report: Report;
  values: Record<string, string | undefined>;
}) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <form
        className="grid gap-3 border border-border bg-card p-4 md:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const params = new URLSearchParams();
          data.forEach((v, k) => {
            if (typeof v === "string" && v) params.set(k, v);
          });
          router.push(`?${params.toString()}`);
        }}
      >
        <select name="preset" defaultValue={values.preset ?? ""} className="h-10 border px-2 text-sm">
          <option value="">All time</option>
          <option value="this_month">This month</option>
          <option value="last_month">Last month</option>
          <option value="this_year">This year</option>
          <option value="last_year">Last year</option>
          <option value="custom">Custom range</option>
        </select>
        <input type="date" name="from" defaultValue={values.from ?? ""} className="h-10 border px-2 text-sm" />
        <input type="date" name="to" defaultValue={values.to ?? ""} className="h-10 border px-2 text-sm" />
        <select name="category" defaultValue={values.category ?? ""} className="h-10 border px-2 text-sm">
          <option value="">All categories</option>
          <option value="excavator">Excavators</option>
          <option value="truck">Trucks</option>
          <option value="other">Other</option>
        </select>
        <input name="manufacturer" placeholder="Manufacturer" defaultValue={values.manufacturer ?? ""} className="h-10 border px-2 text-sm" />
        <select name="sold" defaultValue={values.sold ?? ""} className="h-10 border px-2 text-sm">
          <option value="">Sold & unsold</option>
          <option value="sold">Sold</option>
          <option value="unsold">Unsold</option>
        </select>
        <select name="result" defaultValue={values.result ?? ""} className="h-10 border px-2 text-sm">
          <option value="">Profit & loss</option>
          <option value="profit">Profit only</option>
          <option value="loss">Loss only</option>
        </select>
        <button className="h-10 bg-navy text-xs font-semibold uppercase tracking-wider text-white">Filter</button>
      </form>

      <section>
        <h2 className="mb-4 text-xl">Sales overview</h2>
        <Grid items={[
          ["Machines sold", report.sales.sold],
          ["Currently for sale", report.sales.forSale],
          ["Reserved", report.sales.reserved],
          ["Archived", report.sales.archived],
          ["Purchases recorded", report.sales.purchases],
          ["Sales recorded", report.sales.sales],
          ["Purchase value", formatMoney(report.sales.purchaseValue)],
          ["Sales value", formatMoney(report.sales.salesValue)],
          ["Total profit", formatMoney(report.sales.totalProfit)],
          ["Total loss", formatMoney(report.sales.totalLoss)],
          ["Average selling price", formatMoney(report.sales.averageSellingPrice)],
          ["Average purchase price", formatMoney(report.sales.averagePurchasePrice)],
          ["Average profit / machine", formatMoney(report.sales.averageProfit)],
        ]} />
      </section>

      <section>
        <h2 className="mb-4 text-xl">Inventory overview</h2>
        <Grid items={[
          ["Excavators for sale", report.inventory.excavatorsForSale],
          ["Trucks for sale", report.inventory.trucksForSale],
          ["Other for sale", report.inventory.otherForSale],
          ["Inventory value", formatMoney(report.inventory.inventoryValue)],
          ["Sold excavators", report.inventory.excavatorsSold],
          ["Sold trucks", report.inventory.trucksSold],
          ["Sold other machinery", report.inventory.otherSold],
        ]} />
      </section>

      <section>
        <h2 className="mb-4 text-xl">Financial overview</h2>
        <Grid items={[
          ["Money invested", formatMoney(report.financial.invested)],
          ["Money received", formatMoney(report.financial.received)],
          ["Total costs", formatMoney(report.financial.costs)],
          ["Total profit", formatMoney(report.financial.totalProfit)],
          ["Total losses", formatMoney(report.financial.totalLoss)],
          ["Net result", formatMoney(report.financial.netResult)],
        ]} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Sales / purchases / profit by month">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={report.charts.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#0b1f3a" name="Sales" />
              <Bar dataKey="purchases" fill="#3d5a80" name="Purchases" />
              <Bar dataKey="profit" fill="#b0892c" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Sold vs unsold">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={report.charts.soldVsUnsold} dataKey="value" nameKey="name" outerRadius={90} label>
                {report.charts.soldVsUnsold.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Sales by category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={report.charts.byCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#0b1f3a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Profit by category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={report.charts.byCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="profit" fill="#b0892c" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function Grid({ items }: { items: [string, string | number][] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-4">
      <h3 className="mb-3 text-sm">{title}</h3>
      {children}
    </div>
  );
}

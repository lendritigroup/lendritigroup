import { prisma } from "./prisma";
import { grossProfit, summarizeFinance, totalInvestment } from "./finance";
import type { ReportFilters } from "@/types/machine";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1);
}

function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function resolveDateRange(filters: ReportFilters) {
  const now = new Date();
  if (filters.from && filters.to) {
    return { from: new Date(filters.from), to: endOfDay(new Date(filters.to)) };
  }
  switch (filters.preset) {
    case "this_month":
      return { from: startOfMonth(now), to: now };
    case "last_month": {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { from: last, to: end };
    }
    case "this_year":
      return { from: startOfYear(now), to: now };
    case "last_year": {
      const from = new Date(now.getFullYear() - 1, 0, 1);
      const to = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      return { from, to };
    }
    default:
      return { from: null as Date | null, to: null as Date | null };
  }
}

function inRange(date: Date | null, from: Date | null, to: Date | null) {
  if (!from && !to) return true;
  if (!date) return false;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

export async function buildReports(filters: ReportFilters = {}) {
  const { from, to } = resolveDateRange(filters);
  const machines = await prisma.machine.findMany({ include: { photos: true } });

  const filtered = machines.filter((m) => {
    if (filters.category && m.category !== filters.category) return false;
    if (filters.manufacturer && !m.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase())) {
      return false;
    }
    if (filters.machineId && m.id !== filters.machineId) return false;
    if (filters.sold === "sold" && m.status !== "sold") return false;
    if (filters.sold === "unsold" && m.status === "sold") return false;
    const date = m.saleDate ?? m.purchaseDate ?? m.createdAt;
    if (!inRange(date, from, to)) return false;
    const profit = grossProfit(m);
    if (filters.result === "profit" && (profit == null || profit <= 0)) return false;
    if (filters.result === "loss" && (profit == null || profit >= 0)) return false;
    return true;
  });

  const sold = filtered.filter((m) => m.status === "sold" && m.actualSellingPrice != null);
  const active = filtered.filter((m) => m.status === "active");
  const reserved = filtered.filter((m) => m.status === "reserved");
  const archived = filtered.filter((m) => m.status === "archived");
  const drafts = filtered.filter((m) => m.status === "draft");

  const purchaseValue = filtered.reduce((s, m) => s + (m.purchasePrice ?? 0), 0);
  const salesValue = sold.reduce((s, m) => s + (m.actualSellingPrice ?? 0), 0);
  const invested = filtered.reduce((s, m) => s + totalInvestment(m), 0);
  const costs = filtered.reduce(
    (s, m) => s + (m.transportCost + m.repairCost + m.otherPurchaseCosts + m.sellingCosts + m.otherSaleCosts),
    0
  );
  const profits = sold.map((m) => summarizeFinance(m));
  const totalProfit = profits.reduce((s, p) => s + p.profit, 0);
  const totalLoss = profits.reduce((s, p) => s + p.loss, 0);
  const netResult = totalProfit - totalLoss;

  const byCategory = (cat: string, status?: string) =>
    filtered.filter((m) => m.category === cat && (!status || m.status === status)).length;

  const inventoryValue = active.reduce((s, m) => s + (m.askingPrice ?? 0), 0);

  const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const months: Record<string, { sales: number; purchases: number; profit: number }> = {};
  for (const m of filtered) {
    if (m.purchaseDate) {
      const k = monthKey(m.purchaseDate);
      months[k] ??= { sales: 0, purchases: 0, profit: 0 };
      months[k].purchases += m.purchasePrice ?? 0;
    }
    if (m.saleDate && m.actualSellingPrice != null) {
      const k = monthKey(m.saleDate);
      months[k] ??= { sales: 0, purchases: 0, profit: 0 };
      months[k].sales += m.actualSellingPrice;
      months[k].profit += summarizeFinance(m).netResult ?? 0;
    }
  }

  const monthly = Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, ...v }));

  const categoryFinance = ["excavator", "truck", "other"].map((category) => {
    const items = sold.filter((m) => m.category === category);
    const sales = items.reduce((s, m) => s + (m.actualSellingPrice ?? 0), 0);
    const profit = items.reduce((s, m) => s + (summarizeFinance(m).netResult ?? 0), 0);
    const inventory = active.filter((m) => m.category === category).reduce((s, m) => s + (m.askingPrice ?? 0), 0);
    return { category, sales, profit, inventory, sold: items.length, forSale: byCategory(category, "active") };
  });

  return {
    range: { from: from?.toISOString() ?? null, to: to?.toISOString() ?? null },
    sales: {
      sold: sold.length,
      forSale: active.length,
      reserved: reserved.length,
      archived: archived.length,
      drafts: drafts.length,
      purchases: filtered.filter((m) => m.purchasePrice != null).length,
      sales: sold.length,
      purchaseValue,
      salesValue,
      totalProfit,
      totalLoss,
      averageSellingPrice: sold.length ? salesValue / sold.length : 0,
      averagePurchasePrice: (() => {
        const count = filtered.filter((m) => m.purchasePrice != null).length;
        return count ? purchaseValue / count : 0;
      })(),
      averageProfit: sold.length ? netResult / sold.length : 0,
    },
    inventory: {
      excavatorsForSale: byCategory("excavator", "active"),
      trucksForSale: byCategory("truck", "active"),
      otherForSale: byCategory("other", "active"),
      inventoryValue,
      excavatorsSold: byCategory("excavator", "sold"),
      trucksSold: byCategory("truck", "sold"),
      otherSold: byCategory("other", "sold"),
    },
    financial: {
      invested,
      received: salesValue,
      costs,
      totalProfit,
      totalLoss,
      netResult,
    },
    charts: {
      monthly,
      soldVsUnsold: [
        { name: "Sold", value: sold.length },
        { name: "For sale", value: active.length },
        { name: "Reserved", value: reserved.length },
        { name: "Other", value: archived.length + drafts.length },
      ],
      byCategory: categoryFinance,
    },
    machines: filtered.map((m) => ({
      id: m.id,
      title: `${m.manufacturer} ${m.model}`,
      category: m.category,
      status: m.status,
      year: m.year,
      ...summarizeFinance(m),
    })),
  };
}

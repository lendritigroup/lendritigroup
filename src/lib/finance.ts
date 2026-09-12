export type FinanceInput = {
  purchasePrice?: number | null;
  transportCost?: number | null;
  repairCost?: number | null;
  otherPurchaseCosts?: number | null;
  actualSellingPrice?: number | null;
  sellingCosts?: number | null;
  otherSaleCosts?: number | null;
  askingPrice?: number | null;
};

const n = (v?: number | null) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

export function totalInvestment(m: FinanceInput): number {
  return n(m.purchasePrice) + n(m.transportCost) + n(m.repairCost) + n(m.otherPurchaseCosts);
}

export function totalSaleCosts(m: FinanceInput): number {
  return n(m.sellingCosts) + n(m.otherSaleCosts);
}

export function netProceeds(m: FinanceInput): number | null {
  if (m.actualSellingPrice == null) return null;
  return n(m.actualSellingPrice) - totalSaleCosts(m);
}

export function grossProfit(m: FinanceInput): number | null {
  if (m.actualSellingPrice == null) return null;
  return n(m.actualSellingPrice) - totalInvestment(m) - totalSaleCosts(m);
}

export function profitPercentage(m: FinanceInput): number | null {
  const profit = grossProfit(m);
  const invested = totalInvestment(m);
  if (profit == null || invested === 0) return null;
  return (profit / invested) * 100;
}

export function isLoss(m: FinanceInput): boolean {
  const profit = grossProfit(m);
  return profit != null && profit < 0;
}

export function formatMoney(value?: number | null, currency = "EUR", locale = "de-DE"): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMoneyExact(value?: number | null, currency = "EUR", locale = "de-DE"): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(2)}%`;
}

export function machineTitle(manufacturer?: string | null, model?: string | null, year?: number | null) {
  return [manufacturer, model, year].filter(Boolean).join(" ") || "Listing";
}

export function summarizeFinance(m: FinanceInput) {
  const investment = totalInvestment(m);
  const profit = grossProfit(m);
  const loss = profit != null && profit < 0 ? Math.abs(profit) : 0;
  return {
    purchasePrice: n(m.purchasePrice),
    transportCost: n(m.transportCost),
    repairCost: n(m.repairCost),
    otherPurchaseCosts: n(m.otherPurchaseCosts),
    totalInvestment: investment,
    askingPrice: m.askingPrice ?? null,
    actualSellingPrice: m.actualSellingPrice ?? null,
    sellingCosts: n(m.sellingCosts),
    otherSaleCosts: n(m.otherSaleCosts),
    profit: profit != null && profit >= 0 ? profit : 0,
    loss,
    netResult: profit,
    profitPercentage: profitPercentage(m),
    isLoss: isLoss(m),
  };
}

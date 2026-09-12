"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { summarizeFinance, formatMoney } from "@/lib/finance";

export function SoldDialog({
  machineId,
  askingPrice,
  purchasePrice,
  transportCost,
  repairCost,
  otherPurchaseCosts,
}: {
  machineId: string;
  askingPrice?: number | null;
  purchasePrice?: number | null;
  transportCost?: number;
  repairCost?: number;
  otherPurchaseCosts?: number;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [actual, setActual] = useState(askingPrice ? String(askingPrice) : "");
  const [sellingCosts, setSellingCosts] = useState("0");
  const [otherSaleCosts, setOther] = useState("0");
  const router = useRouter();

  const preview = summarizeFinance({
    purchasePrice,
    transportCost,
    repairCost,
    otherPurchaseCosts,
    askingPrice,
    actualSellingPrice: Number(actual) || 0,
    sellingCosts: Number(sellingCosts) || 0,
    otherSaleCosts: Number(otherSaleCosts) || 0,
  });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-xs font-semibold uppercase text-navy underline">
        Mark as sold
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            className="w-full max-w-lg space-y-3 bg-white p-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setPending(true);
              const form = new FormData(e.currentTarget);
              const res = await fetch(`/api/admin/machines/${machineId}/sold`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  actualSellingPrice: String(form.get("actualSellingPrice") || "").trim(),
                  saleDate: form.get("saleDate"),
                  buyer: form.get("buyer"),
                  sellingCosts: Number(form.get("sellingCosts") || 0),
                  otherSaleCosts: Number(form.get("otherSaleCosts") || 0),
                  saleNotes: form.get("saleNotes"),
                  sellingCurrency: "EUR",
                }),
              });
              setPending(false);
              if (res.ok) {
                setOpen(false);
                router.refresh();
              }
            }}
          >
            <h2 className="text-xl">Record sale</h2>
            <p className="text-xs text-muted-foreground">
              Advertised price {formatMoney(askingPrice)} remains stored. Enter the actual transaction price.
            </p>
            <label className="block text-sm">
              Actual selling price
              <input name="actualSellingPrice" type="text" inputMode="decimal" value={actual} onChange={(e) => setActual(e.target.value)} placeholder="Optional" className="mt-1 h-10 w-full border px-3" />
            </label>
            <label className="block text-sm">
              Sale date
              <input name="saleDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="mt-1 h-10 w-full border px-3" />
            </label>
            <label className="block text-sm">
              Buyer
              <input name="buyer" className="mt-1 h-10 w-full border px-3" />
            </label>
            <label className="block text-sm">
              Selling costs
              <input name="sellingCosts" type="number" value={sellingCosts} onChange={(e) => setSellingCosts(e.target.value)} className="mt-1 h-10 w-full border px-3" />
            </label>
            <label className="block text-sm">
              Other costs
              <input name="otherSaleCosts" type="number" value={otherSaleCosts} onChange={(e) => setOther(e.target.value)} className="mt-1 h-10 w-full border px-3" />
            </label>
            <label className="block text-sm">
              Notes
              <textarea name="saleNotes" rows={3} className="mt-1 w-full border px-3 py-2" />
            </label>
            <div className={`border p-3 text-sm ${preview.isLoss ? "border-destructive text-destructive" : "border-green-800 text-green-900"}`}>
              Investment {formatMoney(preview.totalInvestment)} · Result {formatMoney(preview.netResult)}
              {preview.profitPercentage != null ? ` (${preview.profitPercentage.toFixed(2)}%)` : ""}
              {preview.isLoss ? " — LOSS" : " — PROFIT"}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">Cancel</button>
              <button disabled={pending} className="bg-navy px-4 py-2 text-xs font-semibold uppercase text-white">
                {pending ? "..." : "Save sale"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

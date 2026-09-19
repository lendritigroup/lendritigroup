"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatMoney, summarizeFinance } from "@/lib/finance";
import { localePath } from "@/lib/paths";
import { mainPhoto } from "@/lib/machines";
import { DEMO_SLUGS } from "@/lib/demo-listings";
import type { AdminMachine } from "@/types/machine";
import { SoldDialog } from "./SoldDialog";

export function AdminMachinesTable({
  machines,
  locale,
}: {
  machines: AdminMachine[];
  locale: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const demoIds = useMemo(
    () => machines.filter((m) => DEMO_SLUGS.includes(m.slug) || m.stockNumber?.startsWith("LG-")).map((m) => m.id),
    [machines]
  );

  async function setStatus(id: string, status: string) {
    setError(null);
    const res = await fetch(`/api/admin/machines/${id}/status`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError("Status could not be changed.");
      return;
    }
    router.refresh();
  }

  async function remove(ids: string[], label: string) {
    if (!ids.length) return;
    if (!confirm(`${label} ${ids.length} machine(s)? This cannot be undone.`)) return;
    setBusy("delete");
    setError(null);
    if (ids.length === 1) {
      const res = await fetch(`/api/admin/machines/${ids[0]}`, { method: "DELETE", credentials: "same-origin" });
      setBusy(null);
      if (!res.ok) {
        setError("The machine could not be deleted.");
        return;
      }
    } else {
      const res = await fetch("/api/admin/machines/bulk-delete", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      setBusy(null);
      if (!res.ok) {
        setError("The machines could not be deleted.");
        return;
      }
    }
    setSelected([]);
    router.refresh();
  }

  async function removeDemo() {
    if (!confirm("Delete all demo / mock listings (for sale and sold)?")) return;
    setBusy("demo");
    setError(null);
    const res = await fetch("/api/admin/machines/bulk-delete", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demo: true }),
    });
    setBusy(null);
    if (!res.ok) {
      setError("Demo listings could not be deleted.");
      return;
    }
    setSelected([]);
    router.refresh();
  }

  function toggle(id: string) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy !== null || selected.length === 0}
          onClick={() => remove(selected, "Delete")}
          className="border border-destructive px-3 py-2 text-xs font-semibold uppercase tracking-wider text-destructive disabled:opacity-40"
        >
          Delete selected ({selected.length})
        </button>
        <button
          type="button"
          disabled={busy !== null || demoIds.length === 0}
          onClick={removeDemo}
          className="bg-navy px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-40"
        >
          {busy === "demo" ? "Deleting…" : `Delete demo listings (${demoIds.length})`}
        </button>
      </div>
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
      <div className="overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={machines.length > 0 && selected.length === machines.length}
                  onChange={() => setSelected(selected.length === machines.length ? [] : machines.map((m) => m.id))}
                />
              </th>
              <th className="p-3">Photo</th>
              <th className="p-3">Manufacturer</th>
              <th className="p-3">Model</th>
              <th className="p-3">Category</th>
              <th className="p-3">Year</th>
              <th className="p-3">Asking</th>
              <th className="p-3">Purchase</th>
              <th className="p-3">Actual sale</th>
              <th className="p-3">Status</th>
              <th className="p-3">P/L</th>
              <th className="p-3">Added</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => {
              const fin = summarizeFinance(m);
              return (
                <tr key={m.id} className="border-t align-top">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggle(m.id)} />
                  </td>
                  <td className="p-3">
                    <div className="relative h-12 w-16 overflow-hidden bg-muted">
                      <Image src={mainPhoto(m)} alt="" fill className="object-contain object-center" />
                    </div>
                  </td>
                  <td className="p-3">{m.manufacturer}</td>
                  <td className="p-3">{m.model}</td>
                  <td className="p-3 capitalize">{m.category}</td>
                  <td className="p-3">{m.year ?? "—"}</td>
                  <td className="p-3">{formatMoney(m.askingPrice, m.currency)}</td>
                  <td className="p-3">{formatMoney(m.purchasePrice, m.purchaseCurrency)}</td>
                  <td className="p-3">{formatMoney(m.actualSellingPrice, m.sellingCurrency)}</td>
                  <td className="p-3 capitalize">{m.status}</td>
                  <td className={`p-3 ${fin.isLoss ? "text-destructive" : ""}`}>
                    {m.actualSellingPrice == null ? "—" : formatMoney(fin.netResult)}
                  </td>
                  <td className="p-3">{new Date(m.createdAt).toLocaleDateString("de-DE")}</td>
                  <td className="space-y-1 p-3">
                    <Link href={localePath(locale, `/admin/machines/${m.id}/edit`)} className="block text-xs underline">Edit</Link>
                    <Link href={localePath(locale, `/admin/machines/${m.id}`)} className="block text-xs underline">Finance</Link>
                    {m.status !== "sold" && (
                      <SoldDialog
                        machineId={m.id}
                        askingPrice={m.askingPrice}
                        purchasePrice={m.purchasePrice}
                        transportCost={m.transportCost}
                        repairCost={m.repairCost}
                        otherPurchaseCosts={m.otherPurchaseCosts}
                      />
                    )}
                    {m.status === "active" ? (
                      <button className="block text-xs underline" onClick={() => setStatus(m.id, "draft")}>Unpublish</button>
                    ) : m.status !== "sold" ? (
                      <button className="block text-xs underline" onClick={() => setStatus(m.id, "active")}>Publish</button>
                    ) : null}
                    {m.status === "active" && (
                      <button className="block text-xs underline" onClick={() => setStatus(m.id, "reserved")}>Reserve</button>
                    )}
                    <button
                      type="button"
                      disabled={busy !== null}
                      className="mt-1 block border border-destructive px-2 py-1 text-xs font-semibold uppercase text-destructive"
                      onClick={() => remove([m.id], "Delete")}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { listAdminMachines } from "@/lib/machines";
import { localePath } from "@/lib/paths";
import { AdminMachinesTable } from "@/components/admin/AdminMachinesTable";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminMachinesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const machines = await listAdminMachines();

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-3xl">Machines</h1>
        <Link href={localePath(locale, "/admin/machines/new")} className="bg-navy px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">
          Add machine
        </Link>
      </div>
      <AdminMachinesTable machines={machines} locale={locale} />
    </div>
  );
}

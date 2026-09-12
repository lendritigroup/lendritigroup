import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAdminMachine } from "@/lib/machines";
import { MachineForm } from "@/components/admin/MachineForm";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function EditMachinePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const machine = await getAdminMachine(id);
  if (!machine) notFound();
  return (
    <div>
      <h1 className="mb-6 text-3xl">Edit {machine.manufacturer} {machine.model}</h1>
      <MachineForm locale={locale} machine={machine} />
    </div>
  );
}

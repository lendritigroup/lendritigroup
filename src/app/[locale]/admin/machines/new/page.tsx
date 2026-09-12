import { setRequestLocale } from "next-intl/server";
import { MachineForm } from "@/components/admin/MachineForm";

type Props = { params: Promise<{ locale: string }> };

export default async function NewMachinePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <h1 className="mb-6 text-3xl">Add machine</h1>
      <MachineForm locale={locale} />
    </div>
  );
}

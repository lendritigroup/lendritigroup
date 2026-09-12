import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPublicMachine } from "@/lib/machines";
import { MachineDetail } from "@/components/product/MachineDetail";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const machine = await getPublicMachine("excavators", slug);
  if (!machine) return {};
  return {
    title: machine.seoTitle || `${machine.manufacturer} ${machine.model} ${machine.year ?? ""}`.trim(),
    description: machine.seoDescription || machine.description || undefined,
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const machine = await getPublicMachine("excavators", slug);
  if (!machine) notFound();
  return <MachineDetail machine={machine} locale={locale} />;
}

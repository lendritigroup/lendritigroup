import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ locale: string }> };

export default async function InquiriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const inquiries = await prisma.inquiry.findMany({
    include: { machine: { select: { manufacturer: true, model: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl">Inquiries</h1>
      <div className="space-y-4">
        {inquiries.length === 0 && <p className="text-muted-foreground">No inquiries yet.</p>}
        {inquiries.map((i) => (
          <article key={i.id} className="border border-border bg-card p-5">
            <div className="flex flex-wrap justify-between gap-2">
              <h2 className="text-lg normal-case tracking-normal">{i.name}</h2>
              <span className="text-xs uppercase text-muted-foreground">{i.status} · {new Date(i.createdAt).toLocaleString("de-DE")}</span>
            </div>
            <p className="mt-1 text-sm">{i.email}{i.phone ? ` · ${i.phone}` : ""}</p>
            {i.machine && (
              <p className="mt-1 text-sm text-navy">{i.machine.manufacturer} {i.machine.model}</p>
            )}
            <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{i.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

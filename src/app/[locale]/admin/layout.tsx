import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth";
import { localePath } from "@/lib/paths";
import { AdminNav } from "@/components/admin/AdminNav";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const admin = await requireAdmin();
  if (!admin) redirect(localePath(locale, "/login"));

  return (
    <div className="flex min-h-screen flex-col bg-[#eef0f3] lg:flex-row">
      <AdminNav />
      <div className="flex-1 overflow-x-auto p-4 md:p-8">{children}</div>
    </div>
  );
}

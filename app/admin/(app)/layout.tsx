import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/admin";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) redirect("/admin/login");
  const user = await requireUser();
  return <AdminShell email={user.email ?? undefined}>{children}</AdminShell>;
}

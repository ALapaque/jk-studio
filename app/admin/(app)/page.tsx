import { countsSummary, getMessages } from "@/lib/admin";
import { DashboardContent } from "@/components/admin/DashboardContent";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [counts, messages] = await Promise.all([
    countsSummary(),
    getMessages(),
  ]);
  const recent = messages.slice(0, 5).map((m) => ({
    id: m.id,
    name: m.name,
    project_type: m.project_type,
    body: m.body,
  }));

  return <DashboardContent counts={counts} recent={recent} />;
}

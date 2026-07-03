import Link from "next/link";
import { countsSummary, getMessages } from "@/lib/admin";
import { admin, Card, PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [counts, messages] = await Promise.all([
    countsSummary(),
    getMessages(),
  ]);
  const recent = messages.slice(0, 5);

  const tiles = [
    { label: "Catégories", value: counts.categories, href: "/admin/categories" },
    { label: "Séries", value: counts.projects, href: "/admin/series" },
    { label: "Photos", value: counts.photos, href: "/admin/series" },
    { label: "Vidéos", value: counts.videos, href: "/admin/series" },
    { label: "Messages non lus", value: counts.unread, href: "/admin/messages" },
  ];

  return (
    <div>
      <PageTitle sub="Vue d’ensemble du contenu et des messages.">
        Tableau de bord
      </PageTitle>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 14,
          marginBottom: 32,
        }}
      >
        {tiles.map((t) => (
          <Link key={t.label} href={t.href}>
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 30, fontWeight: 600, color: admin.ink }}>
                {t.value}
              </div>
              <div
                style={{
                  fontFamily: admin.mono,
                  fontSize: 10.5,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: admin.ink2,
                  marginTop: 4,
                }}
              >
                {t.label}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <PageTitle>Derniers messages</PageTitle>
      {recent.length === 0 ? (
        <p style={{ color: admin.ink2 }}>Aucun message pour l’instant.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {recent.map((m) => (
            <Card key={m.id} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong style={{ color: admin.ink }}>{m.name}</strong>
                <span style={{ color: admin.ink2, fontSize: 12 }}>
                  {m.project_type ?? "—"}
                </span>
              </div>
              <div style={{ color: admin.ink2, fontSize: 13, marginTop: 4 }}>
                {m.body.slice(0, 120)}
                {m.body.length > 120 ? "…" : ""}
              </div>
            </Card>
          ))}
          <Link href="/admin/messages" style={{ color: admin.accent, fontSize: 13 }}>
            Voir tous les messages →
          </Link>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { getAllCategories, getAllProjects } from "@/lib/admin";
import { createProject, moveProject } from "@/app/admin/actions";
import {
  admin,
  Button,
  Card,
  Field,
  Input,
  PageTitle,
} from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/ActionForm";

export const dynamic = "force-dynamic";

export default async function SeriesPage() {
  const [projects, cats] = await Promise.all([
    getAllProjects(),
    getAllCategories(),
  ]);

  return (
    <div>
      <PageTitle sub="Chaque série regroupe des photos et des vidéos, dans une catégorie.">
        Séries
      </PageTitle>

      <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
        {projects.map((p) => (
          <Card
            key={p.id}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px" }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 16, color: admin.ink }}>{p.title}</span>
                {!p.published && (
                  <span
                    style={{
                      fontFamily: admin.mono,
                      fontSize: 9.5,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: admin.danger,
                      border: `1px solid ${admin.danger}`,
                      borderRadius: 999,
                      padding: "2px 8px",
                    }}
                  >
                    Brouillon
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: admin.ink2, marginTop: 3 }}>
                {p.categories?.title ?? "—"} · {p.photos?.[0]?.count ?? 0} photos ·{" "}
                {p.videos?.[0]?.count ?? 0} vidéos
              </div>
            </div>
            <ActionForm
              action={moveProject}
              hidden={{ id: p.id, dir: "up", category_id: p.category_id }}
            >
              <Button variant="ghost" style={{ padding: "6px 10px" }}>↑</Button>
            </ActionForm>
            <ActionForm
              action={moveProject}
              hidden={{ id: p.id, dir: "down", category_id: p.category_id }}
            >
              <Button variant="ghost" style={{ padding: "6px 10px" }}>↓</Button>
            </ActionForm>
            <Link href={`/admin/series/${p.id}`}>
              <Button variant="ghost">Ouvrir</Button>
            </Link>
          </Card>
        ))}
        {projects.length === 0 && (
          <p style={{ color: admin.ink2 }}>Aucune série. Créez-en une ci-dessous.</p>
        )}
      </div>

      <Card>
        <h2 style={{ marginTop: 0, fontSize: 16, color: admin.ink }}>Nouvelle série</h2>
        {cats.length === 0 ? (
          <p style={{ color: admin.ink2 }}>
            Créez d’abord une <Link href="/admin/categories" style={{ color: admin.accent }}>catégorie</Link>.
          </p>
        ) : (
          <form action={createProject} style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Catégorie">
                <select
                  name="category_id"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: admin.bg,
                    border: `1px solid ${admin.border}`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    color: admin.ink,
                    fontSize: 14,
                  }}
                >
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Titre">
                <Input name="title" required placeholder="Salomé & Jan" />
              </Field>
            </div>
            <Field label="Description">
              <Input name="description" placeholder="Une journée entière, une averse parfaite." />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Lieu">
                <Input name="location" placeholder="Gand" />
              </Field>
              <Field label="Période">
                <Input name="period" placeholder="2026" />
              </Field>
            </div>
            <label style={{ display: "flex", gap: 10, alignItems: "center", color: admin.ink, fontSize: 14 }}>
              <input type="checkbox" name="published" />
              Publier immédiatement
            </label>
            <div>
              <Button type="submit">Créer la série</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

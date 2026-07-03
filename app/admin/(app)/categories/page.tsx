import Link from "next/link";
import { getAllCategories } from "@/lib/admin";
import { createCategory, deleteCategory, moveCategory } from "@/app/admin/actions";
import { admin, Button, Card, Field, Input, PageTitle } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/ActionForm";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const cats = await getAllCategories();

  return (
    <div>
      <PageTitle sub="Les grandes familles du portfolio (Portrait, Mariage, …).">
        Catégories
      </PageTitle>

      <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
        {cats.map((c, i) => (
          <Card
            key={c.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              padding: "12px 16px",
            }}
          >
            <span style={{ fontFamily: admin.mono, color: admin.ink2, width: 28 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, color: admin.ink }}>{c.title}</div>
              <div style={{ fontSize: 12, color: admin.ink2 }}>/{c.slug}</div>
            </div>
            <ActionForm action={moveCategory} hidden={{ id: c.id, dir: "up" }}>
              <Button variant="ghost" style={{ padding: "6px 10px" }}>↑</Button>
            </ActionForm>
            <ActionForm action={moveCategory} hidden={{ id: c.id, dir: "down" }}>
              <Button variant="ghost" style={{ padding: "6px 10px" }}>↓</Button>
            </ActionForm>
            <Link href={`/admin/categories/${c.id}`}>
              <Button variant="ghost">Modifier</Button>
            </Link>
            <ActionForm
              action={deleteCategory}
              hidden={{ id: c.id }}
              confirm={`Supprimer « ${c.title} » et toutes ses séries ?`}
            >
              <Button variant="danger">Suppr.</Button>
            </ActionForm>
          </Card>
        ))}
        {cats.length === 0 && (
          <p style={{ color: admin.ink2 }}>Aucune catégorie. Créez-en une ci-dessous.</p>
        )}
      </div>

      <Card>
        <h2 style={{ marginTop: 0, fontSize: 16, color: admin.ink }}>
          Nouvelle catégorie
        </h2>
        <form action={createCategory} style={{ display: "grid", gap: 14 }}>
          <div className="admin-2col">
            <Field label="Titre">
              <Input name="title" required placeholder="Portrait" />
            </Field>
            <Field label="Slug (optionnel)" hint="Laisser vide = généré du titre">
              <Input name="slug" placeholder="portrait" />
            </Field>
          </div>
          <Field label="Sous-titre">
            <Input name="subtitle" placeholder="Visages & lumière naturelle" />
          </Field>
          <Field label="Description">
            <Input name="description" placeholder="Visages, silences et lumière…" />
          </Field>
          <div className="admin-2col">
            <Field label="Lieu">
              <Input name="location" placeholder="Bruxelles & ailleurs" />
            </Field>
            <Field label="Période">
              <Input name="period" placeholder="2024 — 2026" />
            </Field>
          </div>
          <div>
            <Button type="submit">Créer la catégorie</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

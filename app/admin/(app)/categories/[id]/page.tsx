import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories } from "@/lib/admin";
import { updateCategory } from "@/app/admin/actions";
import { admin, Button, Card, Field, Input, PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = (await getAllCategories()).find((c) => c.id === id);
  if (!cat) notFound();

  return (
    <div>
      <Link href="/admin/categories" style={{ color: admin.ink2, fontSize: 13 }}>
        ← Catégories
      </Link>
      <PageTitle>Modifier — {cat.title}</PageTitle>

      <Card>
        <form action={updateCategory} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="id" value={cat.id} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Titre">
              <Input name="title" required defaultValue={cat.title} />
            </Field>
            <Field label="Slug">
              <Input name="slug" defaultValue={cat.slug} />
            </Field>
          </div>
          <Field label="Sous-titre">
            <Input name="subtitle" defaultValue={cat.subtitle ?? ""} />
          </Field>
          <Field label="Description">
            <Input name="description" defaultValue={cat.description} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Lieu">
              <Input name="location" defaultValue={cat.location} />
            </Field>
            <Field label="Période">
              <Input name="period" defaultValue={cat.period} />
            </Field>
          </div>
          <div>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

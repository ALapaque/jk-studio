import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryFull } from "@/lib/admin";
import { setCategoryCover, updateCategory } from "@/app/admin/actions";
import { publicImageUrl } from "@/lib/supabase/storage";
import { admin, Button, Card, Field, Input, PageTitle } from "@/components/admin/ui";
import { CoverUploader } from "@/components/admin/CoverUploader";
import { MediaManager } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCategoryFull(id);
  if (!cat) notFound();

  return (
    <div>
      <Link href="/admin/categories" style={{ color: admin.ink2, fontSize: 13 }}>
        ← Catégories
      </Link>
      <PageTitle>Modifier — {cat.title}</PageTitle>

      <Card style={{ marginBottom: 24 }}>
        <Field label="Image de couverture">
          <CoverUploader
            ownerId={cat.id}
            idField="category_id"
            pathPrefix={`covers/cat-${cat.id}`}
            action={setCategoryCover}
            currentSrc={publicImageUrl(cat.cover_path) || undefined}
          />
        </Field>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <form action={updateCategory} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="id" value={cat.id} />
          <div className="admin-2col">
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
          <div className="admin-2col">
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

      {/* ---- médias rattachés directement à la catégorie ---- */}
      <div
        style={{
          fontFamily: admin.mono,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: admin.ink2,
          margin: "4px 2px 12px",
        }}
      >
        Photos & vidéos de la catégorie (affichées directement sur la page catégorie)
      </div>
      <MediaManager
        ownerId={cat.id}
        ownerField="category_id"
        photos={cat.photos}
        videos={cat.videos}
        coverPath={cat.cover_path}
        setCover={setCategoryCover}
        coverField="category_id"
      />
    </div>
  );
}

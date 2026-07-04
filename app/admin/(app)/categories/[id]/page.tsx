import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategoryFull } from "@/lib/admin";
import { setCategoryCover, updateCategory } from "@/app/admin/actions";
import { publicImageUrl } from "@/lib/supabase/storage";
import { PageTitle, Field, Input } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Catégories
      </Link>
      <PageTitle>Modifier — {cat.title}</PageTitle>

      <Card className="mb-6">
        <CardContent className="p-5">
          <Field label="Image de couverture">
            <CoverUploader
              ownerId={cat.id}
              idField="category_id"
              pathPrefix={`covers/cat-${cat.id}`}
              action={setCategoryCover}
              currentSrc={publicImageUrl(cat.cover_path) || undefined}
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-5">
          <form action={updateCategory} className="grid gap-4">
            <input type="hidden" name="id" value={cat.id} />
            <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="grid gap-4 sm:grid-cols-2">
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
        </CardContent>
      </Card>

      <div className="mb-3 mt-2 px-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
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

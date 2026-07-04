import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { getAllCategories, getProjectFull } from "@/lib/admin";
import { publicImageUrl } from "@/lib/supabase/storage";
import {
  deleteProject,
  setProjectCover,
  updateProject,
} from "@/app/admin/actions";
import { PageTitle, Field, Input } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActionForm } from "@/components/admin/ActionForm";
import { CoverUploader } from "@/components/admin/CoverUploader";
import { MediaManager } from "@/components/admin/MediaManager";
import { SelectField } from "@/components/admin/fields/SelectField";
import { SwitchField } from "@/components/admin/fields/SwitchField";

export const dynamic = "force-dynamic";

export default async function EditSeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [p, cats] = await Promise.all([getProjectFull(id), getAllCategories()]);
  if (!p) notFound();

  return (
    <div>
      <Link
        href="/admin/series"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Séries
      </Link>
      <PageTitle
        sub={`${p.categories?.title ?? ""} · ${p.published ? "publiée" : "brouillon"}`}
      >
        {p.title}
      </PageTitle>

      {/* ---- champs de la série ---- */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <form action={updateProject} className="grid gap-4">
            <input type="hidden" name="id" value={p.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Catégorie">
                <SelectField
                  name="category_id"
                  defaultValue={p.category_id ?? undefined}
                  options={cats.map((c) => ({ value: c.id, label: c.title }))}
                />
              </Field>
              <Field label="Titre">
                <Input name="title" required defaultValue={p.title} />
              </Field>
            </div>
            <Field label="Slug">
              <Input name="slug" defaultValue={p.slug} />
            </Field>
            <Field label="Description">
              <Input name="description" defaultValue={p.description} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Lieu">
                <Input name="location" defaultValue={p.location} />
              </Field>
              <Field label="Période">
                <Input name="period" defaultValue={p.period} />
              </Field>
            </div>
            <SwitchField
              name="published"
              label="Publiée"
              hint="Visible sur le site public."
              defaultChecked={p.published}
            />
            <div className="flex items-center gap-4">
              <Button type="submit">Enregistrer</Button>
              {p.published && (
                <a
                  href={`/travaux/${p.categories?.slug}/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  Voir sur le site <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ---- couverture ---- */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <Field
            label="Image de couverture de la série"
            hint="Uploade une image, ou utilise « Couv. » sous une photo ci-dessous."
          >
            <CoverUploader
              ownerId={p.id}
              idField="project_id"
              pathPrefix={p.id}
              action={setProjectCover}
              currentSrc={publicImageUrl(p.cover_path) || undefined}
            />
          </Field>
        </CardContent>
      </Card>

      {/* ---- médias ---- */}
      <MediaManager
        ownerId={p.id}
        ownerField="project_id"
        photos={p.photos}
        videos={p.videos}
        coverPath={p.cover_path}
        setCover={setProjectCover}
        coverField="project_id"
      />

      {/* ---- zone dangereuse ---- */}
      <Card className="border-destructive/50">
        <CardContent className="p-5">
          <h2 className="text-base font-semibold text-destructive">
            Supprimer la série
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Supprime la série et toutes ses photos/vidéos. Irréversible.
          </p>
          <div className="mt-4">
            <ActionForm
              action={deleteProject}
              hidden={{ id: p.id }}
              confirm={`Supprimer « ${p.title} » et tous ses médias ?`}
              confirmLabel="Supprimer"
            >
              <Button variant="destructive">
                <Trash2 className="size-4" /> Supprimer définitivement
              </Button>
            </ActionForm>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories, getProjectFull } from "@/lib/admin";
import { publicImageUrl } from "@/lib/supabase/storage";
import {
  deleteProject,
  setProjectCover,
  updateProject,
} from "@/app/admin/actions";
import {
  admin,
  Button,
  Card,
  Field,
  Input,
  PageTitle,
} from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/ActionForm";
import { CoverUploader } from "@/components/admin/CoverUploader";
import { MediaManager } from "@/components/admin/MediaManager";

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
      <Link href="/admin/series" style={{ color: admin.ink2, fontSize: 13 }}>
        ← Séries
      </Link>
      <PageTitle sub={`${p.categories?.title ?? ""} · ${p.published ? "publiée" : "brouillon"}`}>
        {p.title}
      </PageTitle>

      {/* ---- champs de la série ---- */}
      <Card style={{ marginBottom: 24 }}>
        <form action={updateProject} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="id" value={p.id} />
          <div className="admin-2col">
            <Field label="Catégorie">
              <select
                name="category_id"
                defaultValue={p.category_id}
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
              <Input name="title" required defaultValue={p.title} />
            </Field>
          </div>
          <Field label="Slug">
            <Input name="slug" defaultValue={p.slug} />
          </Field>
          <Field label="Description">
            <Input name="description" defaultValue={p.description} />
          </Field>
          <div className="admin-2col">
            <Field label="Lieu">
              <Input name="location" defaultValue={p.location} />
            </Field>
            <Field label="Période">
              <Input name="period" defaultValue={p.period} />
            </Field>
          </div>
          <label style={{ display: "flex", gap: 10, alignItems: "center", color: admin.ink, fontSize: 14 }}>
            <input type="checkbox" name="published" defaultChecked={p.published} />
            Publiée (visible sur le site)
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Button type="submit">Enregistrer</Button>
            {p.published && (
              <a
                href={`/travaux/${p.categories?.slug}/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: admin.accent, fontSize: 13 }}
              >
                Voir sur le site ↗
              </a>
            )}
          </div>
        </form>
      </Card>

      {/* ---- couverture ---- */}
      <Card style={{ marginBottom: 24 }}>
        <Field label="Image de couverture de la série" hint="Uploade une image, ou utilise « Couv. » sous une photo ci-dessous.">
          <CoverUploader
            ownerId={p.id}
            idField="project_id"
            pathPrefix={p.id}
            action={setProjectCover}
            currentSrc={publicImageUrl(p.cover_path) || undefined}
          />
        </Field>
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
      <Card style={{ borderColor: admin.danger }}>
        <h2 style={{ marginTop: 0, fontSize: 15, color: admin.danger }}>Supprimer la série</h2>
        <p style={{ color: admin.ink2, fontSize: 13, marginTop: 0 }}>
          Supprime la série et toutes ses photos/vidéos. Irréversible.
        </p>
        <ActionForm action={deleteProject} hidden={{ id: p.id }} confirm={`Supprimer « ${p.title} » ?`}>
          <Button variant="danger">Supprimer définitivement</Button>
        </ActionForm>
      </Card>
    </div>
  );
}

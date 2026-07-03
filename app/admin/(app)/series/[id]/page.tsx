import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories, getProjectFull } from "@/lib/admin";
import { publicImageUrl } from "@/lib/supabase/storage";
import {
  addVideo,
  deletePhoto,
  deleteProject,
  deleteVideo,
  movePhoto,
  moveVideo,
  setProjectCover,
  toggleFeatured,
  updatePhoto,
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
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { CoverUploader } from "@/components/admin/CoverUploader";

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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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

      {/* ---- photos ---- */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 16, color: admin.ink }}>
            Photos ({p.photos.length})
          </h2>
          <PhotoUploader projectId={p.id} />
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {p.photos.map((ph) => {
            const isCover = p.cover_path === ph.storage_path;
            return (
              <div
                key={ph.id}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  border: `1px solid ${admin.border}`,
                  borderRadius: 8,
                  padding: 10,
                }}
              >
                <div style={{ position: "relative", width: 64, height: 80, flex: "none", background: admin.bg }}>
                  <Image
                    src={publicImageUrl(ph.storage_path)}
                    alt={ph.alt ?? ""}
                    fill
                    sizes="64px"
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                </div>
                <form action={updatePhoto} style={{ flex: 1, display: "grid", gap: 8 }}>
                  <input type="hidden" name="id" value={ph.id} />
                  <Input name="caption" defaultValue={ph.caption ?? ""} placeholder="Légende" style={{ padding: "7px 10px" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <Input name="alt" defaultValue={ph.alt ?? ""} placeholder="Texte alternatif (alt)" style={{ padding: "7px 10px" }} />
                    <Button type="submit" variant="ghost">OK</Button>
                  </div>
                </form>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <ActionForm action={movePhoto} hidden={{ id: ph.id, dir: "up", project_id: p.id }}>
                      <Button variant="ghost" style={{ padding: "5px 9px" }}>↑</Button>
                    </ActionForm>
                    <ActionForm action={movePhoto} hidden={{ id: ph.id, dir: "down", project_id: p.id }}>
                      <Button variant="ghost" style={{ padding: "5px 9px" }}>↓</Button>
                    </ActionForm>
                  </div>
                  <ActionForm action={setProjectCover} hidden={{ project_id: p.id, storage_path: ph.storage_path }}>
                    <Button variant="ghost" style={{ padding: "5px 9px", width: "100%" }} disabled={isCover}>
                      {isCover ? "★ Couv." : "Couv."}
                    </Button>
                  </ActionForm>
                  <ActionForm action={toggleFeatured} hidden={{ id: ph.id, featured: ph.featured ? "false" : "true" }}>
                    <Button
                      variant="ghost"
                      style={{
                        padding: "5px 9px",
                        width: "100%",
                        color: ph.featured ? admin.accent : admin.ink,
                        borderColor: ph.featured ? admin.accent : admin.border,
                      }}
                      title="Mettre en avant dans le hero de l'accueil"
                    >
                      {ph.featured ? "★ À la une" : "☆ Hero"}
                    </Button>
                  </ActionForm>
                  <ActionForm action={deletePhoto} hidden={{ id: ph.id, storage_path: ph.storage_path }} confirm="Supprimer cette photo ?">
                    <Button variant="danger" style={{ padding: "5px 9px", width: "100%" }}>Suppr.</Button>
                  </ActionForm>
                </div>
              </div>
            );
          })}
          {p.photos.length === 0 && (
            <p style={{ color: admin.ink2, margin: 0 }}>Aucune photo pour l’instant.</p>
          )}
        </div>
      </Card>

      {/* ---- vidéos ---- */}
      <Card style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16, color: admin.ink }}>
          Vidéos ({p.videos.length})
        </h2>
        <form action={addVideo} style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap", marginBottom: 16 }}>
          <input type="hidden" name="project_id" value={p.id} />
          <div style={{ flex: "2 1 260px" }}>
            <Field label="URL YouTube ou Vimeo">
              <Input name="url" required placeholder="https://youtu.be/… ou https://vimeo.com/…" />
            </Field>
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <Field label="Titre">
              <Input name="title" placeholder="Le film de mariage" />
            </Field>
          </div>
          <Button type="submit">Ajouter</Button>
        </form>
        <div style={{ display: "grid", gap: 8 }}>
          {p.videos.map((v) => (
            <div
              key={v.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                border: `1px solid ${admin.border}`,
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <span
                style={{
                  fontFamily: admin.mono,
                  fontSize: 9.5,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: admin.accent,
                }}
              >
                {v.provider}
              </span>
              <span style={{ flex: 1, color: admin.ink, fontSize: 14 }}>
                {v.title || v.video_id}
              </span>
              <ActionForm action={moveVideo} hidden={{ id: v.id, dir: "up", project_id: p.id }}>
                <Button variant="ghost" style={{ padding: "5px 9px" }}>↑</Button>
              </ActionForm>
              <ActionForm action={moveVideo} hidden={{ id: v.id, dir: "down", project_id: p.id }}>
                <Button variant="ghost" style={{ padding: "5px 9px" }}>↓</Button>
              </ActionForm>
              <ActionForm action={deleteVideo} hidden={{ id: v.id }} confirm="Supprimer cette vidéo ?">
                <Button variant="danger" style={{ padding: "5px 9px" }}>Suppr.</Button>
              </ActionForm>
            </div>
          ))}
          {p.videos.length === 0 && (
            <p style={{ color: admin.ink2, margin: 0 }}>Aucune vidéo.</p>
          )}
        </div>
      </Card>

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

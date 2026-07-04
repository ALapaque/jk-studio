import Image from "next/image";
import { publicImageUrl } from "@/lib/supabase/storage";
import { PhotoRow, VideoRow } from "@/lib/supabase/types";
import {
  addVideo,
  deletePhoto,
  deleteVideo,
  movePhoto,
  moveVideo,
  toggleFeatured,
  updatePhoto,
} from "@/app/admin/actions";
import { admin, Button, Card, Field, Input } from "./ui";
import { ActionForm } from "./ActionForm";
import { PhotoUploader } from "./PhotoUploader";

type OwnerField = "project_id" | "category_id";

/** Gestion des médias (photos + vidéos) d'une série OU d'une catégorie. */
export function MediaManager({
  ownerId,
  ownerField,
  photos,
  videos,
  coverPath,
  setCover,
  coverField,
}: {
  ownerId: string;
  ownerField: OwnerField;
  photos: PhotoRow[];
  videos: VideoRow[];
  coverPath: string | null;
  setCover: (formData: FormData) => void | Promise<void>;
  coverField: OwnerField;
}) {
  const owner = { [ownerField]: ownerId } as Record<string, string>;

  return (
    <>
      {/* ---- photos ---- */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16, color: admin.ink }}>
            Photos ({photos.length})
          </h2>
          <PhotoUploader ownerId={ownerId} ownerField={ownerField} />
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {photos.map((ph) => {
            const isCover = coverPath === ph.storage_path;
            return (
              <div
                key={ph.id}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  flexWrap: "wrap",
                  border: `1px solid ${admin.border}`,
                  borderRadius: 8,
                  padding: 10,
                }}
              >
                <div style={{ position: "relative", width: 64, height: 80, flex: "none", background: admin.bg }}>
                  <Image src={publicImageUrl(ph.storage_path)} alt={ph.alt ?? ""} fill sizes="64px" style={{ objectFit: "cover", borderRadius: 4 }} />
                </div>
                <form action={updatePhoto} style={{ flex: 1, minWidth: 200, display: "grid", gap: 8 }}>
                  <input type="hidden" name="id" value={ph.id} />
                  <Input name="caption" defaultValue={ph.caption ?? ""} placeholder="Légende" style={{ padding: "7px 10px" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <Input name="alt" defaultValue={ph.alt ?? ""} placeholder="Texte alternatif (alt)" style={{ padding: "7px 10px" }} />
                    <Button type="submit" variant="ghost">OK</Button>
                  </div>
                </form>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <ActionForm action={movePhoto} hidden={{ id: ph.id, dir: "up", ...owner }}>
                      <Button variant="ghost" style={{ padding: "5px 9px" }}>↑</Button>
                    </ActionForm>
                    <ActionForm action={movePhoto} hidden={{ id: ph.id, dir: "down", ...owner }}>
                      <Button variant="ghost" style={{ padding: "5px 9px" }}>↓</Button>
                    </ActionForm>
                  </div>
                  <ActionForm action={setCover} hidden={{ [coverField]: ownerId, storage_path: ph.storage_path }}>
                    <Button variant="ghost" style={{ padding: "5px 9px", width: "100%" }} disabled={isCover}>
                      {isCover ? "★ Couv." : "Couv."}
                    </Button>
                  </ActionForm>
                  <ActionForm action={toggleFeatured} hidden={{ id: ph.id, featured: ph.featured ? "false" : "true" }}>
                    <Button
                      variant="ghost"
                      style={{ padding: "5px 9px", width: "100%", color: ph.featured ? admin.accent : admin.ink, borderColor: ph.featured ? admin.accent : admin.border }}
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
          {photos.length === 0 && (
            <p style={{ color: admin.ink2, margin: 0 }}>Aucune photo pour l’instant.</p>
          )}
        </div>
      </Card>

      {/* ---- vidéos ---- */}
      <Card style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 16, color: admin.ink }}>
          Vidéos ({videos.length})
        </h2>
        <form action={addVideo} style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap", marginBottom: 16 }}>
          {Object.entries(owner).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
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
          {videos.map((v) => (
            <div
              key={v.id}
              style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", border: `1px solid ${admin.border}`, borderRadius: 8, padding: "10px 12px" }}
            >
              <span style={{ fontFamily: admin.mono, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: admin.accent }}>
                {v.provider}
              </span>
              <span style={{ flex: 1, minWidth: 120, color: admin.ink, fontSize: 14 }}>
                {v.title || v.video_id}
              </span>
              <ActionForm action={moveVideo} hidden={{ id: v.id, dir: "up", ...owner }}>
                <Button variant="ghost" style={{ padding: "5px 9px" }}>↑</Button>
              </ActionForm>
              <ActionForm action={moveVideo} hidden={{ id: v.id, dir: "down", ...owner }}>
                <Button variant="ghost" style={{ padding: "5px 9px" }}>↓</Button>
              </ActionForm>
              <ActionForm action={deleteVideo} hidden={{ id: v.id }} confirm="Supprimer cette vidéo ?">
                <Button variant="danger" style={{ padding: "5px 9px" }}>Suppr.</Button>
              </ActionForm>
            </div>
          ))}
          {videos.length === 0 && (
            <p style={{ color: admin.ink2, margin: 0 }}>Aucune vidéo.</p>
          )}
        </div>
      </Card>
    </>
  );
}

import Image from "next/image";
import { ChevronUp, ChevronDown, Star, Trash2, Check, Plus } from "lucide-react";
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
import { Field, Input } from "./ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">
              Photos <span className="text-muted-foreground">({photos.length})</span>
            </h2>
            <PhotoUploader ownerId={ownerId} ownerField={ownerField} />
          </div>

          <div className="grid gap-3">
            {photos.map((ph) => {
              const isCover = coverPath === ph.storage_path;
              return (
                <div
                  key={ph.id}
                  className="flex flex-wrap items-center gap-4 rounded-lg border border-border p-2.5"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={publicImageUrl(ph.storage_path)}
                      alt={ph.alt ?? ""}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <form action={updatePhoto} className="grid min-w-[200px] flex-1 gap-2">
                    <input type="hidden" name="id" value={ph.id} />
                    <Input name="caption" defaultValue={ph.caption ?? ""} placeholder="Légende" />
                    <div className="flex gap-2">
                      <Input name="alt" defaultValue={ph.alt ?? ""} placeholder="Texte alternatif (alt)" />
                      <Button type="submit" variant="outline" size="sm">
                        OK
                      </Button>
                    </div>
                  </form>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-1.5">
                      <ActionForm action={movePhoto} hidden={{ id: ph.id, dir: "up", ...owner }}>
                        <Button variant="ghost" size="icon" aria-label="Monter">
                          <ChevronUp className="size-4" />
                        </Button>
                      </ActionForm>
                      <ActionForm action={movePhoto} hidden={{ id: ph.id, dir: "down", ...owner }}>
                        <Button variant="ghost" size="icon" aria-label="Descendre">
                          <ChevronDown className="size-4" />
                        </Button>
                      </ActionForm>
                    </div>
                    <ActionForm action={setCover} hidden={{ [coverField]: ownerId, storage_path: ph.storage_path }}>
                      <Button variant={isCover ? "secondary" : "outline"} size="sm" className="w-full" disabled={isCover}>
                        {isCover ? <><Check className="size-3.5" /> Couv.</> : "Couv."}
                      </Button>
                    </ActionForm>
                    <ActionForm action={toggleFeatured} hidden={{ id: ph.id, featured: ph.featured ? "false" : "true" }}>
                      <Button
                        variant={ph.featured ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        title="Mettre en avant dans le hero de l'accueil"
                      >
                        <Star className={ph.featured ? "size-3.5 fill-current" : "size-3.5"} />
                        {ph.featured ? "À la une" : "Hero"}
                      </Button>
                    </ActionForm>
                    <ActionForm action={deletePhoto} hidden={{ id: ph.id, storage_path: ph.storage_path }} confirm="Supprimer cette photo ?" confirmLabel="Supprimer">
                      <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive">
                        <Trash2 className="size-3.5" /> Suppr.
                      </Button>
                    </ActionForm>
                  </div>
                </div>
              );
            })}
            {photos.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune photo pour l&apos;instant.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ---- vidéos ---- */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Vidéos <span className="text-muted-foreground">({videos.length})</span>
          </h2>
          <form action={addVideo} className="mb-4 flex flex-wrap items-end gap-3">
            {Object.entries(owner).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
            <div className="flex-[2_1_260px]">
              <Field label="URL YouTube ou Vimeo">
                <Input name="url" required placeholder="https://youtu.be/… ou https://vimeo.com/…" />
              </Field>
            </div>
            <div className="flex-[1_1_160px]">
              <Field label="Titre">
                <Input name="title" placeholder="Le film de mariage" />
              </Field>
            </div>
            <Button type="submit">
              <Plus className="size-4" /> Ajouter
            </Button>
          </form>
          <div className="grid gap-2">
            {videos.map((v) => (
              <div
                key={v.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2.5"
              >
                <Badge variant="secondary" className="uppercase">{v.provider}</Badge>
                <span className="min-w-[120px] flex-1 text-sm text-foreground">
                  {v.title || v.video_id}
                </span>
                <ActionForm action={moveVideo} hidden={{ id: v.id, dir: "up", ...owner }}>
                  <Button variant="ghost" size="icon" aria-label="Monter">
                    <ChevronUp className="size-4" />
                  </Button>
                </ActionForm>
                <ActionForm action={moveVideo} hidden={{ id: v.id, dir: "down", ...owner }}>
                  <Button variant="ghost" size="icon" aria-label="Descendre">
                    <ChevronDown className="size-4" />
                  </Button>
                </ActionForm>
                <ActionForm action={deleteVideo} hidden={{ id: v.id }} confirm="Supprimer cette vidéo ?" confirmLabel="Supprimer">
                  <Button variant="ghost" size="icon" aria-label="Supprimer" className="text-destructive hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </ActionForm>
              </div>
            ))}
            {videos.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune vidéo.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

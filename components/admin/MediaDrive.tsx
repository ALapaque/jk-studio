"use client";

import Image from "next/image";
import Link from "next/link";
import { Folder, ChevronRight, Trash2, Plus, Home } from "lucide-react";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";
import {
  createFolder,
  deleteAsset,
  deleteFolder,
  saveAsset,
} from "@/app/admin/media-actions";
import { appendUpload, type UploadedImage } from "@/lib/client-upload";
import { Field, Input } from "./ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "./ActionForm";
import { ImageUploader } from "./ImageUploader";

/** Le drive de la médiathèque : fil d'Ariane, sous-dossiers, images. */
export function MediaDrive({
  currentFolderId,
  breadcrumb,
  subfolders,
  assets,
}: {
  currentFolderId: string | null;
  breadcrumb: MediaFolderRow[];
  subfolders: MediaFolderRow[];
  assets: (MediaAssetRow & { usage: number })[];
}) {
  // Les fichiers uploadés ici atterrissent dans le dossier courant.
  const submitToLibrary = async (u: UploadedImage) => {
    const fd = new FormData();
    appendUpload(fd, u);
    if (currentFolderId) fd.set("folder_id", currentFolderId);
    await saveAsset(fd);
  };

  return (
    <>
      {/* ---- fil d'Ariane + upload ---- */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex flex-wrap items-center gap-1 text-sm">
              <Link
                href="/admin/mediatheque"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <Home className="size-4" /> Racine
              </Link>
              {breadcrumb.map((f) => (
                <span key={f.id} className="inline-flex items-center gap-1">
                  <ChevronRight className="size-4 text-muted-foreground" />
                  <Link
                    href={`/admin/mediatheque?folder=${f.id}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {f.name}
                  </Link>
                </span>
              ))}
            </nav>
            <ImageUploader
              prefix="library"
              label="Uploader ici"
              submit={submitToLibrary}
            />
          </div>
        </CardContent>
      </Card>

      {/* ---- dossiers ---- */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">
              Dossiers <span className="text-muted-foreground">({subfolders.length})</span>
            </h2>
            <form action={createFolder} className="flex items-end gap-2">
              {currentFolderId && (
                <input type="hidden" name="parent_id" value={currentFolderId} />
              )}
              <Field label="Nouveau dossier">
                <Input name="name" required placeholder="Ex. Mariages 2026" />
              </Field>
              <Button type="submit" variant="outline" size="sm">
                <Plus className="size-4" /> Créer
              </Button>
            </form>
          </div>

          {subfolders.length ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {subfolders.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <Link
                    href={`/admin/mediatheque?folder=${f.id}`}
                    className="flex min-w-0 flex-1 items-center gap-2.5 text-foreground hover:text-primary"
                  >
                    <Folder className="size-5 shrink-0 text-primary" />
                    <span className="truncate text-sm font-medium">{f.name}</span>
                  </Link>
                  <ActionForm
                    action={deleteFolder}
                    hidden={{ id: f.id }}
                    confirm={`Supprimer le dossier « ${f.name} » ? Les images qu'il contient reviennent à la racine, elles ne sont pas supprimées.`}
                    confirmLabel="Supprimer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Supprimer le dossier"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </ActionForm>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun sous-dossier.</p>
          )}
        </CardContent>
      </Card>

      {/* ---- images ---- */}
      <Card>
        <CardContent className="p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Images <span className="text-muted-foreground">({assets.length})</span>
          </h2>

          {assets.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {assets.map((a) => (
                <div
                  key={a.id}
                  className="group relative overflow-hidden rounded-lg border border-border"
                >
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={publicImageUrl(a.storage_path)}
                      alt={a.alt ?? a.filename ?? ""}
                      fill
                      sizes="(max-width:640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2">
                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                      {a.filename ?? "image"}
                    </span>
                    {a.usage > 0 ? (
                      <Badge variant="secondary" title="Affichée sur le site">
                        {a.usage}×
                      </Badge>
                    ) : (
                      <ActionForm
                        action={deleteAsset}
                        hidden={{ id: a.id, storage_path: a.storage_path }}
                        confirm="Supprimer définitivement cette image de la médiathèque ?"
                        confirmLabel="Supprimer"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Supprimer"
                          className="size-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </ActionForm>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucune image dans ce dossier. Utilise « Uploader ici » pour en
              ajouter.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Folder,
  ChevronRight,
  Trash2,
  Plus,
  Home,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";
import {
  createFolder,
  deleteAsset,
  deleteFolder,
  moveAsset,
  moveFolder,
  renameFolder,
  saveAsset,
} from "@/app/admin/media-actions";
import { appendUpload, type UploadedImage } from "@/lib/client-upload";
import { Field, Input } from "./ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "./ActionForm";
import { ImageUploader } from "./ImageUploader";

/** Petit `<select>` qui soumet son formulaire (Server Action) au changement,
 *  pour ranger une image ou un dossier sans clic supplémentaire. */
function MoveSelect({
  action,
  id,
  field,
  current,
  options,
  ariaLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  field: "folder_id" | "parent_id";
  current: string | null;
  options: MediaFolderRow[];
  ariaLabel: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <select
        name={field}
        defaultValue={current ?? ""}
        aria-label={ariaLabel}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="max-w-[9rem] rounded-md border border-input bg-transparent px-2 py-1 text-xs text-muted-foreground"
      >
        <option value="">Racine</option>
        {options.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
    </form>
  );
}

/** Le drive de la médiathèque : fil d'Ariane, sous-dossiers (renommer, déplacer,
 *  supprimer) et images (déplacer, supprimer). */
export function MediaDrive({
  currentFolderId,
  breadcrumb,
  subfolders,
  allFolders,
  assets,
}: {
  currentFolderId: string | null;
  breadcrumb: MediaFolderRow[];
  subfolders: MediaFolderRow[];
  allFolders: MediaFolderRow[];
  assets: (MediaAssetRow & { usage: number })[];
}) {
  const [renaming, setRenaming] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Filtre local du dossier courant : sous-dossiers par nom, images par nom de
  // fichier + texte alt. Purement visuel (aucune requête) — pour retrouver vite
  // dans un dossier chargé. La recherche sur TOUTE la banque, elle, vit dans le
  // sélecteur « Depuis la médiathèque ».
  const q = query.trim().toLowerCase();
  const shownSubfolders = q
    ? subfolders.filter((f) => f.name.toLowerCase().includes(q))
    : subfolders;
  const shownAssets = q
    ? assets.filter((a) =>
        `${a.filename ?? ""} ${a.alt ?? ""}`.toLowerCase().includes(q),
      )
    : assets;

  // Descendants de chaque dossier : cibles interdites pour un déplacement (on
  // ne peut pas ranger un dossier sous lui-même ni sous l'un de ses enfants,
  // sinon la branche deviendrait inatteignable). Calculé une fois.
  const descendantsByFolder = useMemo(() => {
    const childrenOf = new Map<string | null, MediaFolderRow[]>();
    for (const f of allFolders) {
      const key = f.parent_id ?? null;
      const arr = childrenOf.get(key);
      if (arr) arr.push(f);
      else childrenOf.set(key, [f]);
    }
    const map = new Map<string, Set<string>>();
    for (const f of allFolders) {
      const seen = new Set<string>();
      const stack = [f.id];
      while (stack.length) {
        const cur = stack.pop()!;
        for (const child of childrenOf.get(cur) ?? []) {
          if (!seen.has(child.id)) {
            seen.add(child.id);
            stack.push(child.id);
          }
        }
      }
      map.set(f.id, seen);
    }
    return map;
  }, [allFolders]);

  // Cibles de déplacement d'un dossier : tous sauf lui-même et ses descendants.
  const folderMoveTargets = (f: MediaFolderRow) => {
    const forbidden = descendantsByFolder.get(f.id) ?? new Set<string>();
    return allFolders.filter((o) => o.id !== f.id && !forbidden.has(o.id));
  };
  // Cibles de déplacement d'une image : tous les dossiers.
  const assetMoveTargets = allFolders;

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
            <div className="flex items-center gap-2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrer ce dossier…"
                aria-label="Filtrer ce dossier"
                className="w-48 rounded-md border border-input bg-transparent px-2 py-1.5 text-sm"
              />
              <ImageUploader
                prefix="library"
                label="Uploader ici"
                submit={submitToLibrary}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- dossiers ---- */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">
              Dossiers <span className="text-muted-foreground">({shownSubfolders.length})</span>
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

          {shownSubfolders.length ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {shownSubfolders.map((f) => (
                <div
                  key={f.id}
                  className="rounded-lg border border-border p-3"
                >
                  {renaming === f.id ? (
                    <form
                      action={renameFolder}
                      onSubmit={() => setRenaming(null)}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="id" value={f.id} />
                      <Input
                        name="name"
                        defaultValue={f.name}
                        autoFocus
                        required
                        className="h-8 flex-1"
                      />
                      <Button type="submit" size="icon" className="size-8" aria-label="Enregistrer">
                        <Check className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label="Annuler"
                        onClick={() => setRenaming(null)}
                      >
                        <X className="size-4" />
                      </Button>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/admin/mediatheque?folder=${f.id}`}
                          className="flex min-w-0 flex-1 items-center gap-2.5 text-foreground hover:text-primary"
                        >
                          <Folder className="size-5 shrink-0 text-primary" />
                          <span className="truncate text-sm font-medium">{f.name}</span>
                        </Link>
                        <div className="flex shrink-0 items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Renommer le dossier"
                            className="size-8"
                            onClick={() => setRenaming(f.id)}
                          >
                            <Pencil className="size-4" />
                          </Button>
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
                              className="size-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </ActionForm>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Déplacer&nbsp;:</span>
                        <MoveSelect
                          action={moveFolder}
                          id={f.id}
                          field="parent_id"
                          current={f.parent_id}
                          options={folderMoveTargets(f)}
                          ariaLabel={`Déplacer le dossier ${f.name} vers`}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {q ? "Aucun dossier ne correspond au filtre." : "Aucun sous-dossier."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ---- images ---- */}
      <Card>
        <CardContent className="p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Images <span className="text-muted-foreground">({shownAssets.length})</span>
          </h2>

          {shownAssets.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {shownAssets.map((a) => (
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
                  <div className="flex items-center gap-1.5 px-2 pb-2">
                    <span className="text-xs text-muted-foreground">Ranger&nbsp;:</span>
                    <MoveSelect
                      action={moveAsset}
                      id={a.id}
                      field="folder_id"
                      current={a.folder_id}
                      options={assetMoveTargets}
                      ariaLabel={`Déplacer ${a.filename ?? "l'image"} vers`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {q
                ? "Aucune image ne correspond au filtre."
                : "Aucune image dans ce dossier. Utilise « Uploader ici » pour en ajouter."}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

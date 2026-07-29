"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  GripVertical,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { PhotoRow } from "@/lib/supabase/types";
import { reorderPhotos } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/** Montage narratif d'une série : ordonne les photos et signale celles qui
 *  ne sont pas prêtes à publier.
 *
 *  Le glisser-déposer est en HTML5 natif — aucune librairie ajoutée (cf. la
 *  règle « pas de nouvelle dépendance par défaut »). Les boutons monter /
 *  descendre restent le chemin accessible au clavier : le drag & drop seul
 *  ne l'est pas, et cet écran doit rester utilisable sans souris. */
export function PhotoMontage({
  ownerId,
  ownerField,
  photos,
}: {
  ownerId: string;
  ownerField: "project_id" | "category_id";
  photos: PhotoRow[];
}) {
  const initial = useMemo(() => photos.map((p) => p.id), [photos]);
  const [order, setOrder] = useState<string[]>(initial);
  const [dragging, setDragging] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const byId = useMemo(
    () => new Map(photos.map((p) => [p.id, p])),
    [photos],
  );
  const rows = order.map((id) => byId.get(id)).filter(Boolean) as PhotoRow[];

  const dirty =
    order.length !== initial.length ||
    order.some((id, i) => id !== initial[i]);

  function move(id: string, dir: -1 | 1) {
    setOrder((cur) => {
      const i = cur.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  /** Réordonne pendant le survol : le déplacement se voit en direct plutôt
   *  qu'au relâchement, ce qui rend le montage bien plus lisible. */
  function onDragOver(overId: string) {
    if (!dragging || dragging === overId) return;
    setOrder((cur) => {
      const from = cur.indexOf(dragging);
      const to = cur.indexOf(overId);
      if (from < 0 || to < 0) return cur;
      const next = [...cur];
      next.splice(to, 0, ...next.splice(from, 1));
      return next;
    });
  }

  function save() {
    setError(null);
    const fd = new FormData();
    fd.set(ownerField, ownerId);
    fd.set("ids", order.join(","));
    startTransition(async () => {
      try {
        await reorderPhotos(fd);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Enregistrement impossible.");
      }
    });
  }

  const incomplete = rows.filter((p) => !p.subject || !p.location || !p.alt);

  if (!photos.length) return null;

  return (
    <div className="mb-6 rounded-xl border border-border p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Montage narratif{" "}
            <span className="text-muted-foreground">({rows.length})</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Glisse les photos pour définir l&apos;ordre du défilé, ou utilise
            les flèches.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreview((v) => !v)}
            aria-pressed={preview}
          >
            <Eye className="size-4" /> {preview ? "Masquer" : "Aperçu du défilé"}
          </Button>
          {dirty && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOrder(initial);
                  setError(null);
                }}
                disabled={pending}
              >
                <RotateCcw className="size-4" /> Annuler
              </Button>
              <Button type="button" size="sm" onClick={save} disabled={pending}>
                {pending ? "Enregistrement…" : "Enregistrer l'ordre"}
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {incomplete.length > 0 && (
        <p className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
          <TriangleAlert className="size-4 shrink-0" />
          {incomplete.length} photo(s) sans légende ou sans texte alternatif —
          elles s&apos;afficheront sans légende sur le site.
        </p>
      )}

      {preview ? (
        /* Aperçu : la séquence telle qu'elle se lira dans le défilé. */
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p, i) => (
            <li key={p.id} className="overflow-hidden rounded-lg bg-muted">
              <div
                className="relative w-full"
                style={{ aspectRatio: p.orientation === "portrait" ? "2/3" : "3/2" }}
              >
                <Image
                  src={publicImageUrl(p.storage_path)}
                  alt={p.alt ?? ""}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] tabular-nums text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-2.5 text-sm">
                {p.subject || p.location ? (
                  <span className="flex flex-wrap items-baseline gap-1.5">
                    <em className="font-serif italic">{p.subject}</em>
                    {p.subject && p.location && (
                      <span className="text-primary">—</span>
                    )}
                    <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {p.location}
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Sans légende</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="grid gap-2">
          {rows.map((p, i) => {
            const missing = !p.subject || !p.location || !p.alt;
            return (
              <li
                key={p.id}
                draggable
                onDragStart={() => setDragging(p.id)}
                onDragEnd={() => setDragging(null)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOver(p.id);
                }}
                className={[
                  "flex items-center gap-3 rounded-lg border p-2 transition-opacity",
                  dragging === p.id
                    ? "border-primary opacity-50"
                    : "border-border",
                ].join(" ")}
              >
                <GripVertical
                  className="size-4 shrink-0 cursor-grab text-muted-foreground"
                  aria-hidden
                />
                <span className="w-6 shrink-0 text-sm tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-muted">
                  <Image
                    src={publicImageUrl(p.storage_path)}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <span className="min-w-0 flex-1 truncate text-sm">
                  {p.subject || (
                    <span className="text-muted-foreground">Sans sujet</span>
                  )}
                  {p.location && (
                    <span className="text-muted-foreground">
                      {" "}
                      — {p.location}
                    </span>
                  )}
                </span>

                {p.orientation && (
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    {p.orientation === "portrait" ? "Portrait" : "Paysage"}
                  </Badge>
                )}
                {missing && (
                  <Badge
                    variant="outline"
                    className="border-amber-500/50 text-amber-700 dark:text-amber-400"
                    title="Sujet, lieu ou texte alternatif manquant"
                  >
                    À compléter
                  </Badge>
                )}

                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Monter ${p.subject ?? "la photo"}`}
                    disabled={i === 0}
                    onClick={() => move(p.id, -1)}
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Descendre ${p.subject ?? "la photo"}`}
                    disabled={i === rows.length - 1}
                    onClick={() => move(p.id, 1)}
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

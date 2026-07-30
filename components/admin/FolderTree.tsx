"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Folder, FolderOpen, Home } from "lucide-react";
import type { MediaFolderRow } from "@/lib/supabase/types";

/** Prise en charge du glisser-déposer d'une image sur un nœud de l'arbre. */
export interface TreeDnd {
  dropOver: string | null;
  ROOT: string;
  onDragOver: (e: React.DragEvent, key: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, folderId: string | null) => void;
}

/** Arborescence des dossiers, façon explorateur de fichiers.
 *
 *  Colonne de gauche de la médiathèque : tous les dossiers, dépliables. Le
 *  chemin du dossier courant est ouvert d'emblée et surligné. La navigation
 *  passe par des <Link> (`?folder=`), donc le rendu reste serveur mais fluide.
 *  Chaque nœud est aussi une cible de dépôt pour ranger une image par glisser. */
export function FolderTree({
  allFolders,
  currentFolderId,
  dnd,
}: {
  allFolders: MediaFolderRow[];
  currentFolderId: string | null;
  dnd?: TreeDnd;
}) {
  const childrenOf = new Map<string | null, MediaFolderRow[]>();
  for (const f of [...allFolders].sort((a, b) => a.name.localeCompare(b.name))) {
    const k = f.parent_id ?? null;
    const arr = childrenOf.get(k);
    if (arr) arr.push(f);
    else childrenOf.set(k, [f]);
  }

  const byId = new Map(allFolders.map((f) => [f.id, f]));
  // Ouverture initiale : le dossier courant et tous ses parents.
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    let cur = currentFolderId ? byId.get(currentFolderId) ?? null : null;
    while (cur) {
      s.add(cur.id);
      cur = cur.parent_id ? byId.get(cur.parent_id) ?? null : null;
    }
    return s;
  });
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const rowCls = (active: boolean, over: boolean) =>
    [
      "group flex items-center gap-1 rounded-md pr-2 text-sm transition-colors",
      active
        ? "bg-primary/15 text-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
      over ? "ring-1 ring-primary bg-primary/10" : "",
    ].join(" ");

  const renderNodes = (parentId: string | null, depth: number) => {
    const kids = childrenOf.get(parentId) ?? [];
    return kids.map((f) => {
      const hasKids = (childrenOf.get(f.id) ?? []).length > 0;
      const isOpen = expanded.has(f.id);
      const active = currentFolderId === f.id;
      const over = !!dnd && dnd.dropOver === f.id;
      return (
        <div key={f.id}>
          <div
            className={rowCls(active, over)}
            onDragOver={dnd ? (e) => dnd.onDragOver(e, f.id) : undefined}
            onDragLeave={dnd ? dnd.onDragLeave : undefined}
            onDrop={dnd ? (e) => dnd.onDrop(e, f.id) : undefined}
          >
            <span style={{ width: depth * 14 }} aria-hidden />
            {hasKids ? (
              <button
                type="button"
                onClick={() => toggle(f.id)}
                aria-label={isOpen ? "Replier" : "Déplier"}
                aria-expanded={isOpen}
                className="flex size-5 shrink-0 items-center justify-center text-muted-foreground"
              >
                <ChevronRight
                  className={`size-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </button>
            ) : (
              <span className="size-5 shrink-0" aria-hidden />
            )}
            <Link
              href={`/admin/mediatheque?folder=${f.id}`}
              draggable={false}
              className="flex min-w-0 flex-1 items-center gap-1.5 py-1.5"
            >
              {isOpen && hasKids ? (
                <FolderOpen className="size-4 shrink-0 text-primary" />
              ) : (
                <Folder className="size-4 shrink-0 text-primary" />
              )}
              <span className="truncate">{f.name}</span>
            </Link>
          </div>
          {isOpen && renderNodes(f.id, depth + 1)}
        </div>
      );
    });
  };

  const rootActive = !currentFolderId;
  const rootOver = !!dnd && dnd.dropOver === dnd.ROOT;

  return (
    <nav aria-label="Dossiers" className="grid gap-0.5">
      <div
        className={rowCls(rootActive, rootOver)}
        onDragOver={dnd ? (e) => dnd.onDragOver(e, dnd.ROOT) : undefined}
        onDragLeave={dnd ? dnd.onDragLeave : undefined}
        onDrop={dnd ? (e) => dnd.onDrop(e, null) : undefined}
      >
        <span className="size-5 shrink-0" aria-hidden />
        <Link
          href="/admin/mediatheque"
          draggable={false}
          className="flex min-w-0 flex-1 items-center gap-1.5 py-1.5"
        >
          <Home className="size-4 shrink-0 text-primary" />
          <span className="truncate font-medium">Racine</span>
        </Link>
      </div>
      {renderNodes(null, 0)}
    </nav>
  );
}

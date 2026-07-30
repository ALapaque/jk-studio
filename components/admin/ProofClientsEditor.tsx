"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { publicImageUrl } from "@/lib/supabase/storage";
import { Input } from "./ui";
import { Button } from "@/components/ui/button";

/** Éditeur de la liste des clients de la preuve sociale.
 *
 *  Chaque client a un nom et un logo OPTIONNEL. Le logo se téléverse ici même
 *  (upload direct navigateur → Storage, comme ContentImageUploader) plutôt que
 *  de saisir un chemin à la main. Sans logo, seul le nom est rendu, en
 *  capitales (comportement du ProofBand).
 *
 *  L'état vit côté client ; à la soumission, la liste est sérialisée dans un
 *  champ caché « clients » au format « Nom | chemin-logo » attendu par l'action
 *  saveProof — l'action serveur reste donc inchangée. */

const slugExt = (name: string) =>
  (name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "png";

type Row = { name: string; logoPath: string; key: string };

export function ProofClientsEditor({
  initial,
}: {
  initial: { name: string; logoPath?: string }[];
}) {
  const [rows, setRows] = useState<Row[]>(
    initial.map((c, i) => ({
      name: c.name,
      logoPath: c.logoPath ?? "",
      key: `init-${i}`,
    })),
  );
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Compteur pour des clés stables sans Math.random / Date.now (indisponibles).
  const seq = useRef(0);

  // Sérialisation attendue par saveProof : une ligne par client, « Nom | logo ».
  const serialized = rows
    .filter((r) => r.name.trim())
    .map((r) =>
      r.logoPath ? `${r.name.trim()} | ${r.logoPath}` : r.name.trim(),
    )
    .join("\n");

  const patch = (key: string, next: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...next } : r)));

  const addRow = () => {
    seq.current += 1;
    setRows((rs) => [...rs, { name: "", logoPath: "", key: `new-${seq.current}` }]);
  };

  const removeRow = (key: string) =>
    setRows((rs) => rs.filter((r) => r.key !== key));

  const uploadLogo = async (key: string, file: File | null) => {
    if (!file) return;
    setError(null);
    setBusyKey(key);
    try {
      const sb = createClient();
      const path = `brand/clients/${crypto.randomUUID()}.${slugExt(file.name)}`;
      const { error: upErr } = await sb.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
          contentType: file.type || undefined,
          upsert: false,
        });
      if (upErr) throw upErr;
      patch(key, { logoPath: path });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="grid gap-3">
      {/* Champ caché soumis avec le formulaire parent (action saveProof). */}
      <input type="hidden" name="clients" value={serialized} />

      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun client. Ajoute-les ci-dessous — n&apos;affiche que des marques
          dont tu as l&apos;autorisation d&apos;usage.
        </p>
      )}

      {rows.map((r) => (
        <div
          key={r.key}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-2.5"
        >
          {/* Aperçu / téléversement du logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-20 items-center justify-center overflow-hidden rounded-md border border-input bg-muted">
              {r.logoPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={publicImageUrl(r.logoPath)}
                  alt={r.name || "logo"}
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  sans logo
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/png,image/svg+xml,image/webp,image/jpeg"
                  className="hidden"
                  disabled={busyKey === r.key}
                  onChange={(e) => uploadLogo(r.key, e.target.files?.[0] ?? null)}
                />
                <span className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                  <Upload className="size-3.5" />
                  {busyKey === r.key
                    ? "Envoi…"
                    : r.logoPath
                      ? "Changer"
                      : "Logo"}
                </span>
              </label>
              {r.logoPath && (
                <button
                  type="button"
                  onClick={() => patch(r.key, { logoPath: "" })}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3" /> Retirer le logo
                </button>
              )}
            </div>
          </div>

          {/* Nom */}
          <Input
            value={r.name}
            onChange={(e) => patch(r.key, { name: e.target.value })}
            placeholder="Nom du client (ex. Deloitte)"
            className="min-w-[160px] flex-1"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Retirer le client"
            className="text-destructive hover:text-destructive"
            onClick={() => removeRow(r.key)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="size-4" /> Ajouter un client
        </Button>
      </div>
    </div>
  );
}

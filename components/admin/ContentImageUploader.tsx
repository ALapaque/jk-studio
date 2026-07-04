"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slugExt = (name: string) =>
  (name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";

/**
 * Uploader d'image générique pour le contenu (logo, favicon, portrait…).
 * Upload direct navigateur → Supabase Storage, puis Server Action `save` avec
 * la clé. Aperçu en <img> brut (compatible .ico/.svg).
 */
export function ContentImageUploader({
  currentSrc,
  pathPrefix,
  save,
  remove,
  label,
  hint,
  accept = "image/*",
  previewClassName = "h-16 w-32",
}: {
  currentSrc?: string;
  pathPrefix: string;
  save: (formData: FormData) => void | Promise<void>;
  remove: () => void | Promise<void>;
  label: string;
  hint?: string;
  accept?: string;
  previewClassName?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const sb = createClient();
      const key = `${pathPrefix}/${crypto.randomUUID()}.${slugExt(file.name)}`;
      const { error: upErr } = await sb.storage
        .from(STORAGE_BUCKET)
        .upload(key, file, { contentType: file.type || undefined, upsert: false });
      if (upErr) throw upErr;
      const fd = new FormData();
      fd.append("storage_path", key);
      await save(fd);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onRemove = async () => {
    setBusy(true);
    try {
      await remove();
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-4">
        <div
          className={cn(
            "relative flex items-center justify-center overflow-hidden rounded-md border border-input bg-muted",
            previewClassName,
          )}
        >
          {currentSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentSrc} alt={label} className="h-full w-full object-contain p-2" />
          ) : (
            <span className="text-xs text-muted-foreground">aucun</span>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
          <Upload className="size-4" />
          {busy ? "Envoi…" : currentSrc ? `Changer ${label.toLowerCase()}` : `Uploader ${label.toLowerCase()}`}
        </Button>
        {currentSrc && (
          <Button type="button" variant="ghost" onClick={onRemove} disabled={busy} className="text-destructive hover:text-destructive">
            <Trash2 className="size-4" /> Retirer
          </Button>
        )}
      </div>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}

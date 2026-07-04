"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { saveBrandLogo, removeBrandLogo } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const slugExt = (name: string) =>
  (name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";

/** Upload du logo de la marque (envoi direct Storage → Server Action). */
export function LogoUploader({ currentSrc }: { currentSrc?: string }) {
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
      const key = `brand/${crypto.randomUUID()}.${slugExt(file.name)}`;
      const { error: upErr } = await sb.storage
        .from(STORAGE_BUCKET)
        .upload(key, file, { contentType: file.type || undefined, upsert: false });
      if (upErr) throw upErr;
      const fd = new FormData();
      fd.append("storage_path", key);
      await saveBrandLogo(fd);
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
      await removeBrandLogo();
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex h-16 w-32 items-center justify-center overflow-hidden rounded-md border border-input bg-muted">
        {currentSrc ? (
          <Image src={currentSrc} alt="Logo" fill sizes="128px" className="object-contain p-2" />
        ) : (
          <span className="text-xs text-muted-foreground">aucun logo</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
        <Upload className="size-4" />
        {busy ? "Envoi…" : currentSrc ? "Changer le logo" : "Uploader un logo"}
      </Button>
      {currentSrc && (
        <Button type="button" variant="ghost" onClick={onRemove} disabled={busy} className="text-destructive hover:text-destructive">
          <Trash2 className="size-4" /> Retirer
        </Button>
      )}
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}

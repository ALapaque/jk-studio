"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { admin, Button } from "./ui";

const slugExt = (name: string) =>
  (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "jpg";

/** Upload d'une image de couverture (catégorie ou série), envoi direct vers
 *  Supabase Storage puis enregistrement via une Server Action. */
export function CoverUploader({
  ownerId,
  idField,
  pathPrefix,
  action,
  currentSrc,
}: {
  ownerId: string;
  idField: string;
  pathPrefix: string;
  action: (formData: FormData) => void | Promise<void>;
  currentSrc?: string;
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
      fd.append(idField, ownerId);
      fd.append("storage_path", key);
      await action(fd);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          position: "relative",
          width: 96,
          height: 64,
          flex: "none",
          background: admin.bg,
          border: `1px solid ${admin.border}`,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {currentSrc ? (
          <Image src={currentSrc} alt="Couverture" fill sizes="96px" style={{ objectFit: "cover" }} />
        ) : (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: admin.ink2,
              fontSize: 11,
            }}
          >
            aucune
          </span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <Button type="button" variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? "Envoi…" : currentSrc ? "Changer la couverture" : "Uploader une couverture"}
      </Button>
      {error && <span style={{ color: admin.danger, fontSize: 12.5 }}>{error}</span>}
    </div>
  );
}

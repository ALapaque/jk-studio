"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { savePhoto } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { admin, Button } from "./ui";

function readDimensions(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ w: 0, h: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

const slugExt = (name: string) =>
  (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "jpg";

export function PhotoUploader({
  ownerId,
  ownerField = "project_id",
}: {
  ownerId: string;
  ownerField?: "project_id" | "category_id";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const sb = createClient();
    const list = Array.from(files);
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      setStatus(`Envoi ${i + 1}/${list.length} — ${file.name}`);
      try {
        const { w, h } = await readDimensions(file);
        // 1) upload direct navigateur → Supabase Storage (session authentifiée)
        const key = `${ownerId}/${crypto.randomUUID()}.${slugExt(file.name)}`;
        const { error: upErr } = await sb.storage
          .from(STORAGE_BUCKET)
          .upload(key, file, { contentType: file.type || undefined, upsert: false });
        if (upErr) throw upErr;
        // 2) enregistrement de la fiche (petit payload) via Server Action
        const fd = new FormData();
        fd.append(ownerField, ownerId);
        fd.append("storage_path", key);
        fd.append("width", String(w));
        fd.append("height", String(h));
        await savePhoto(fd);
      } catch (e) {
        setError(
          `Échec sur ${file.name} : ${e instanceof Error ? e.message : String(e)}`,
        );
        break;
      }
    }
    setStatus(null);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => onFiles(e.target.files)}
      />
      <Button type="button" onClick={() => inputRef.current?.click()}>
        + Ajouter des photos
      </Button>
      {status && <span style={{ color: admin.ink2, fontSize: 13 }}>{status}</span>}
      {error && <span style={{ color: admin.danger, fontSize: 13 }}>{error}</span>}
    </div>
  );
}

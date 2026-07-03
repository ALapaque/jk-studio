"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPhoto } from "@/app/admin/actions";
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

export function PhotoUploader({ projectId }: { projectId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const list = Array.from(files);
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      setStatus(`Envoi ${i + 1}/${list.length} — ${file.name}`);
      try {
        const { w, h } = await readDimensions(file);
        const fd = new FormData();
        fd.append("project_id", projectId);
        fd.append("file", file);
        fd.append("width", String(w));
        fd.append("height", String(h));
        await uploadPhoto(fd);
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

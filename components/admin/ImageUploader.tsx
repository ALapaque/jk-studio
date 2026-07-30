"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { uploadImage, type UploadedImage } from "@/lib/client-upload";
import { Button } from "@/components/ui/button";
import { admin } from "./ui";

/** Bouton d'upload d'images générique.
 *
 *  Réutilisé par la médiathèque et par l'upload direct dans une série : la
 *  logique d'upload navigateur (fichier → Storage + dérivés) est partagée via
 *  `uploadImage`, et `submit` décide seulement de la Server Action appelée
 *  (saveAsset pour la banque, uploadToOwner pour une série). Ainsi les deux
 *  chemins produisent exactement les mêmes fichiers. */
export function ImageUploader({
  prefix,
  label = "Uploader",
  submit,
}: {
  /** Sous-chemin du bucket où ranger les fichiers (ex. « library »). */
  prefix: string;
  label?: string;
  /** Enregistre un upload côté serveur (asset, rattachement…). */
  submit: (u: UploadedImage) => Promise<void>;
}) {
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
        const uploaded = await uploadImage(file, prefix);
        await submit(uploaded);
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
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => onFiles(e.target.files)}
      />
      <Button type="button" onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" /> {label}
      </Button>
      {status && <span style={{ color: admin.ink2, fontSize: 13 }}>{status}</span>}
      {error && <span style={{ color: admin.danger, fontSize: 13 }}>{error}</span>}
    </div>
  );
}

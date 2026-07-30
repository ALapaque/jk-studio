"use client";

import { ImageUploader } from "./ImageUploader";
import { uploadToOwner } from "@/app/admin/media-actions";
import { appendUpload, type UploadedImage } from "@/lib/client-upload";

/** Upload direct dans une série/catégorie. Le fichier entre d'abord dans la
 *  médiathèque (à la racine) puis est rattaché — le comportement demandé :
 *  « uploader la met aussi dans la banque ». */
export function OwnerUploader({
  ownerField,
  ownerId,
}: {
  ownerField: "project_id" | "category_id";
  ownerId: string;
}) {
  const submit = async (u: UploadedImage) => {
    const fd = new FormData();
    appendUpload(fd, u);
    fd.set("owner_field", ownerField);
    fd.set("owner_id", ownerId);
    await uploadToOwner(fd);
  };
  // Les fichiers restent rangés sous l'id du parent dans le bucket, comme avant.
  return <ImageUploader prefix={ownerId} label="Uploader" submit={submit} />;
}

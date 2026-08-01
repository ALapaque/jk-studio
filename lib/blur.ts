// Aperçu flou de repli pour next/image.
//
// Les photos téléversées récemment portent un LQIP (`blurDataURL`) généré à
// l'upload (voir lib/image-resize.ts). Les plus anciennes — et les données de
// démo — n'en ont pas : sans repli, elles s'affichent d'un coup, sans
// placeholder. Ce dégradé neutre chaud, minuscule (SVG 12×16), sert alors
// d'aperçu flou universel, discret sur thème clair comme sombre.

export const BLUR_FALLBACK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMicgaGVpZ2h0PScxNic+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSdnJyB4MT0nMCcgeTE9JzAnIHgyPScwJyB5Mj0nMSc+PHN0b3Agb2Zmc2V0PScwJyBzdG9wLWNvbG9yPScjNmY2NjVhJy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjNGI0NDNiJy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9JzEyJyBoZWlnaHQ9JzE2JyBmaWxsPSd1cmwoI2cpJy8+PC9zdmc+";

/** Props de flou pour un `<Image>` next/image : aperçu par photo si disponible,
 *  sinon repli universel. Toujours `placeholder="blur"` → jamais de « pop »
 *  brutal au chargement. */
export function blurProps(blurDataURL?: string | null): {
  placeholder: "blur";
  blurDataURL: string;
} {
  return {
    placeholder: "blur",
    blurDataURL: blurDataURL || BLUR_FALLBACK,
  };
}

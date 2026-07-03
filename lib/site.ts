/** URL publique du site (sans slash final). Définie par NEXT_PUBLIC_SITE_URL
 *  en production (Vercel) ; repli sur le domaine par défaut. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://jkstudio.be"
).replace(/\/+$/, "");

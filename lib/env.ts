// Accès centralisé aux variables d'environnement.

// Les valeurs collées dans un hébergeur contiennent parfois des espaces ou des
// sauts de ligne parasites : on les nettoie systématiquement.
const clean = (v: string | undefined) => (v ?? "").trim();

/** Une valeur est-elle utilisable dans un en-tête HTTP (ByteString, ≤ 255) ?
 *  Une clé copiée alors qu'elle était masquée contient des puces « • »
 *  (U+2022) et casse toute requête Supabase — on la détecte ici. */
function headerSafe(v: string): boolean {
  for (let i = 0; i < v.length; i++) if (v.charCodeAt(i) > 255) return false;
  return true;
}

export const SUPABASE_URL = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const SUPABASE_ANON_KEY = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const SUPABASE_SERVICE_ROLE_KEY = clean(
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

let warned = false;
function warnIfInvalid(name: string, value: string) {
  if (value && !headerSafe(value) && !warned) {
    warned = true;
    console.error(
      `[env] ${name} contient des caractères invalides (ex. « • »). ` +
        "La clé a probablement été copiée alors qu'elle était masquée dans " +
        "Supabase. Recopie-la avec le bouton « copier » et recolle-la.",
    );
  }
}

/** Le site sait-il parler à Supabase (lecture publique) ? */
export function isSupabaseConfigured(): boolean {
  warnIfInvalid("NEXT_PUBLIC_SUPABASE_ANON_KEY", SUPABASE_ANON_KEY);
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && headerSafe(SUPABASE_ANON_KEY));
}

/** Les mutations admin (service role) sont-elles possibles ? */
export function isAdminConfigured(): boolean {
  warnIfInvalid("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY);
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_SERVICE_ROLE_KEY &&
      headerSafe(SUPABASE_SERVICE_ROLE_KEY),
  );
}

export const RESEND_API_KEY = clean(process.env.RESEND_API_KEY);
export const CONTACT_EMAIL_TO = clean(process.env.CONTACT_EMAIL_TO);
export const CONTACT_EMAIL_FROM =
  clean(process.env.CONTACT_EMAIL_FROM) || "onboarding@resend.dev";

/** Nom du bucket de stockage des images. */
export const STORAGE_BUCKET = "portfolio";

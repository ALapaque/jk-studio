// Accès centralisé aux variables d'environnement.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** Le site sait-il parler à Supabase (lecture publique) ? */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/** Les mutations admin (service role) sont-elles possibles ? */
export function isAdminConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
export const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO ?? "";
export const CONTACT_EMAIL_FROM =
  process.env.CONTACT_EMAIL_FROM ?? "onboarding@resend.dev";

/** Nom du bucket de stockage des images. */
export const STORAGE_BUCKET = "portfolio";

import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "@/lib/env";

/** Client anon sans session (lectures publiques : RSC, build/generateStaticParams).
 *  N'utilise pas les cookies → sûr à appeler pendant le build. RLS = anon
 *  (ne voit que le contenu publié). */
export function createPublicSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Client Supabase serveur lié aux cookies de session (RSC / Server Actions).
 *  Utilisé pour lire l'utilisateur connecté et effectuer des opérations sous
 *  son identité (RLS appliquée). */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Appelé depuis un RSC en lecture seule : ignoré (le middleware
          // rafraîchit la session).
        }
      },
    },
  });
}

/** Client service-role, sans session, qui contourne la RLS. À n'utiliser QUE
 *  côté serveur, dans des Server Actions déjà protégées par l'auth. */
export function createAdminSupabase() {
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

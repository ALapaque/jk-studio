"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { createAdminSupabase } from "@/lib/supabase/server";
import {
  CONTACT_EMAIL_FROM,
  CONTACT_EMAIL_TO,
  RESEND_API_KEY,
  isAdminConfigured,
} from "@/lib/env";

export interface ContactResult {
  ok: boolean;
  error?: string;
}

/* Rate-limit en mémoire : fenêtre glissante par IP.
 *
 * Limite assumée : sur des fonctions serverless, la mémoire est propre à
 * chaque instance et disparaît au recyclage. Ça n'arrête donc pas une attaque
 * distribuée et patiente — mais ça coupe les rafales, qui sont le cas réel du
 * spam de formulaire. Combiné au honeypot, c'est proportionné à l'enjeu, et
 * surtout ça évite un CAPTCHA visible, que le §9 exclut explicitement.
 *
 * Un durcissement durable passerait par un compteur en base ou un service
 * dédié — à faire si le spam devient un vrai problème, pas avant. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Purge opportuniste : sans ça la Map grossit indéfiniment sur une instance
  // longue durée.
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

export async function submitContact(formData: FormData): Promise<ContactResult> {
  // Honeypot : champ invisible pour un humain, rempli par la plupart des bots.
  // On répond `ok` sans rien enregistrer — signaler le rejet apprendrait au
  // bot à contourner le piège.
  if (String(formData.get("societe") ?? "").trim()) {
    console.warn("[contact] honeypot déclenché — message ignoré.");
    return { ok: true };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "inconnue";
  if (rateLimited(ip)) {
    return {
      ok: false,
      error: "Trop de messages envoyés. Réessayez dans quelques minutes.",
    };
  }

  const name = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const body = String(formData.get("message") ?? "").trim();
  const projectType = String(formData.get("projet_type") ?? "").trim() || null;

  if (!name || !email || !body) {
    return { ok: false, error: "Merci de remplir les champs obligatoires." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Adresse email invalide." };
  }

  // 1) Persistance en base (si Supabase configuré).
  if (isAdminConfigured()) {
    try {
      const sb = createAdminSupabase();
      const { error } = await sb.from("messages").insert({
        name,
        email,
        project_type: projectType,
        body,
      });
      if (error) throw error;
    } catch (err) {
      console.error("[contact] insert Supabase échoué:", err);
      return {
        ok: false,
        error: "Une erreur est survenue. Réessayez dans un instant.",
      };
    }
  } else {
    console.warn("[contact] Supabase non configuré — message non persisté.");
  }

  // 2) Notification email (best-effort — n'échoue pas la soumission).
  if (RESEND_API_KEY && CONTACT_EMAIL_TO) {
    try {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: `JKStudio <${CONTACT_EMAIL_FROM}>`,
        to: [CONTACT_EMAIL_TO],
        replyTo: email,
        subject: `Nouveau message — ${projectType ?? "Projet"} — ${name}`,
        text: `De : ${name} <${email}>\nType : ${projectType ?? "—"}\n\n${body}`,
      });
    } catch (err) {
      console.error("[contact] envoi Resend échoué:", err);
    }
  }

  return { ok: true };
}

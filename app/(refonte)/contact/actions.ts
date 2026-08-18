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

/* Détection de spam par signaux, sans CAPTCHA (§9). Chaque signal vaut 1 point ;
 * on ne rejette qu'à partir de 2 pour ne JAMAIS bloquer un vrai client (un seul
 * signal isolé — un nom d'un seul mot, un email avec un point — reste accepté).
 *
 * Les spams reçus ont une signature nette : nom et message en charabia aléatoire
 * (casse alternée, sans espace) et adresse Gmail bourrée de points (même boîte
 * réutilisée, Gmail ignorant les points). */

/** Chaîne « aléatoire » : un seul bloc (sans espace), assez long, non
 *  prononçable (peu de voyelles, casse qui alterne, ou longue suite de
 *  consonnes). Un vrai nom ou un vrai message contient des espaces. */
function looksRandom(input: string): boolean {
  const t = input.trim();
  if (t.length < 10 || /\s/.test(t)) return false;
  const letters = t.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 8) return false;
  const vowels = (letters.match(/[aeiouy]/gi) ?? []).length;
  const vowelRatio = vowels / letters.length;
  let caseSwitches = 0;
  for (let i = 1; i < letters.length; i++) {
    const prevLower = letters[i - 1] >= "a" && letters[i - 1] <= "z";
    const curLower = letters[i] >= "a" && letters[i] <= "z";
    if (prevLower !== curLower) caseSwitches++;
  }
  const longConsonantRun = /[bcdfghjklmnpqrstvwxz]{5,}/i.test(letters);
  return vowelRatio < 0.28 || caseSwitches >= 5 || longConsonantRun;
}

function spamSignals(opts: {
  name: string;
  email: string;
  body: string;
  elapsedMs: number;
}): number {
  const { name, email, body, elapsedMs } = opts;
  let score = 0;

  // 1) Adresse avec abus de points dans la partie locale (astuce Gmail).
  const local = email.split("@")[0] ?? "";
  if ((local.match(/\./g) ?? []).length >= 4) score++;

  // 2) Nom en charabia.
  if (looksRandom(name)) score++;

  // 3) Message en charabia (un vrai message a des espaces).
  if (looksRandom(body)) score++;

  // 4) Lien dans le message (les vrais briefs en contiennent rarement).
  if (/\b(?:https?:\/\/|www\.)/i.test(body)) score++;

  // 5) Formulaire rempli trop vite pour un humain (bot JS). `elapsedMs <= 0`
  //    signifie « inconnu » (repli) — on ne compte pas ce signal.
  if (elapsedMs > 0 && elapsedMs < 2500) score++;

  return score;
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

  // Score de spam : à partir de 2 signaux, on rejette silencieusement (comme le
  // honeypot — on répond `ok` sans rien enregistrer ni notifier, pour ne pas
  // apprendre au bot ce qui l'a trahi). Le seuil de 2 protège les vrais clients.
  const elapsedMs = Number(formData.get("elapsed")) || 0;
  const score = spamSignals({ name, email, body, elapsedMs });
  if (score >= 2) {
    console.warn(
      `[contact] message rejeté (spam, score ${score}) de ${email} — ignoré.`,
    );
    return { ok: true };
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

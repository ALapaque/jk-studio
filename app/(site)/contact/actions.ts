"use server";

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

export async function submitContact(formData: FormData): Promise<ContactResult> {
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

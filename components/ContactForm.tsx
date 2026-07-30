"use client";

import { useState } from "react";
import { submitContact } from "@/app/(refonte)/contact/actions";

/* Formulaire de contact de la refonte.
 *
 * Stylé aux tokens --jk-* et aux seules polices de la refonte (Instrument Serif
 * + IBM Plex Sans). Il ne référence plus les variables de l'ancien thème ni les
 * polices de l'admin (Archivo / Space Mono) : c'était le dernier écran public à
 * les tirer, ce qui forçait leur préchargement et encombrait le LCP. */

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--jk-sans)",
  fontSize: 9.5,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--jk-ink-mute)",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--jk-rule)",
  padding: "10px 0",
  fontFamily: "var(--jk-sans)",
  fontSize: 16,
  color: "var(--jk-ink)",
  outline: "none",
};

export function ContactForm({ projectTypes }: { projectTypes: string[] }) {
  const [projType, setProjType] = useState(projectTypes[0] ?? "Autre");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const res = await submitContact(formData);
    setPending(false);
    if (res.ok) setSent(true);
    else setError(res.error ?? "Une erreur est survenue.");
  };

  if (sent) {
    return (
      <div style={{ border: "1px solid var(--jk-rule)", padding: "clamp(30px,4vw,56px)" }}>
        <div style={{ fontFamily: "var(--jk-serif)", fontStyle: "italic", fontSize: "clamp(28px,3vw,40px)", lineHeight: 1.15, marginBottom: 16 }}>
          Merci — votre message est parti.
        </div>
        <div style={{ fontFamily: "var(--jk-sans)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--jk-ink-mute)", marginBottom: 28 }}>
          Réponse sous 48 h, promis.
        </div>
        <button
          onClick={() => setSent(false)}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--jk-sans)", fontSize: 10, letterSpacing: "0.16em", color: "var(--jk-brass)", textTransform: "uppercase" }}
        >
          Envoyer un autre message →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 26 }}>
      <input type="hidden" name="projet_type" value={projType} />

      {/* Honeypot. Caché à l'œil ET aux lecteurs d'écran (aria-hidden +
          tabIndex -1) pour qu'aucun utilisateur légitime ne puisse le remplir
          par erreur, alors qu'un bot qui parcourt le DOM le remplira.
          `display:none` plutôt qu'un décalage hors écran : plus simple, et les
          bots qui évaluent le style sont rares. `autoComplete="off"` évite
          qu'un gestionnaire de mots de passe le remplisse tout seul. */}
      <div aria-hidden style={{ display: "none" }}>
        <label htmlFor="societe">Société</label>
        <input
          id="societe"
          type="text"
          name="societe"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label style={{ display: "grid", gap: 9 }}>
        <span style={labelStyle}>Nom *</span>
        <input required name="nom" placeholder="Votre nom" className="jk-cf-field" style={fieldStyle} />
      </label>
      <label style={{ display: "grid", gap: 9 }}>
        <span style={labelStyle}>Email *</span>
        <input required type="email" name="email" placeholder="vous@exemple.be" className="jk-cf-field" style={fieldStyle} />
      </label>
      <div style={{ display: "grid", gap: 12 }}>
        <span style={labelStyle}>Type de projet</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {projectTypes.map((t) => {
            const sel = t === projType;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setProjType(t)}
                style={{
                  background: sel ? "var(--jk-ink)" : "transparent",
                  color: sel ? "var(--jk-bg)" : "var(--jk-ink-mute)",
                  border: `1px solid ${sel ? "var(--jk-ink)" : "var(--jk-rule)"}`,
                  borderRadius: 999,
                  padding: "9px 18px",
                  cursor: "pointer",
                  fontFamily: "var(--jk-sans)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  transition: "all .25s ease",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <label style={{ display: "grid", gap: 9 }}>
        <span style={labelStyle}>Le projet *</span>
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Dates, lieu, envies, références…"
          className="jk-cf-field"
          style={{ ...fieldStyle, lineHeight: 1.6, resize: "vertical" }}
        />
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <button
          type="submit"
          disabled={pending}
          className="jk-cf-btn"
          style={{
            background: "transparent",
            border: "1px solid var(--jk-ink)",
            borderRadius: 999,
            padding: "16px 34px",
            cursor: pending ? "default" : "pointer",
            fontFamily: "var(--jk-sans)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--jk-ink)",
            opacity: pending ? 0.6 : 1,
          }}
        >
          {pending ? "Envoi…" : "Envoyer →"}
        </button>
        {error && (
          <span
            role="alert"
            style={{
              fontFamily: "var(--jk-sans)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#c96f4a",
            }}
          >
            {error}
          </span>
        )}
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { submitContact } from "@/app/(site)/contact/actions";

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 9.5,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--ink2)",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--line)",
  padding: "10px 0",
  fontFamily: "var(--font-sans), sans-serif",
  fontSize: 16,
  color: "var(--ink)",
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
      <div style={{ border: "1px solid var(--line)", padding: "clamp(30px,4vw,56px)" }}>
        <div style={{ fontFamily: "var(--font-serif), serif", fontStyle: "italic", fontSize: "clamp(28px,3vw,40px)", lineHeight: 1.15, marginBottom: 16 }}>
          Merci — votre message est parti.
        </div>
        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink2)", marginBottom: 28 }}>
          Réponse sous 48 h, promis.
        </div>
        <button
          onClick={() => setSent(false)}
          data-cursor="link"
          style={{ background: "none", border: "none", padding: 0, fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.16em", color: "var(--accent)", textTransform: "uppercase" }}
        >
          Envoyer un autre message →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} data-reveal="rise" style={{ display: "grid", gap: 26 }}>
      <input type="hidden" name="projet_type" value={projType} />
      <label style={{ display: "grid", gap: 9 }}>
        <span style={labelStyle}>Nom *</span>
        <input required name="nom" placeholder="Votre nom" className="jk-field" style={fieldStyle} />
      </label>
      <label style={{ display: "grid", gap: 9 }}>
        <span style={labelStyle}>Email *</span>
        <input required type="email" name="email" placeholder="vous@exemple.be" className="jk-field" style={fieldStyle} />
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
                data-cursor="link"
                style={{
                  background: sel ? "var(--ink)" : "transparent",
                  color: sel ? "var(--bg)" : "var(--ink2)",
                  border: `1px solid ${sel ? "var(--ink)" : "var(--line)"}`,
                  borderRadius: 999,
                  padding: "9px 18px",
                  fontFamily: "var(--font-mono), monospace",
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
          className="jk-field"
          style={{ ...fieldStyle, lineHeight: 1.6, resize: "vertical" }}
        />
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <button
          type="submit"
          disabled={pending}
          data-magnet="1"
          data-cursor="link"
          className="jk-btn-outline"
          style={{
            background: "transparent",
            border: "1px solid var(--ink)",
            borderRadius: 999,
            padding: "16px 34px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink)",
            opacity: pending ? 0.6 : 1,
          }}
        >
          {pending ? "Envoi…" : "Envoyer →"}
        </button>
        {error && (
          <span
            role="alert"
            style={{
              fontFamily: "var(--font-mono), monospace",
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

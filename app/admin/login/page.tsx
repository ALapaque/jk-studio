"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { admin, Button, Card, Field, Input } from "@/components/admin/ui";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const configured = isSupabaseConfigured();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    const sb = createClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  };

  const magic = async () => {
    if (!email) {
      setError("Entrez votre email pour recevoir un lien.");
      return;
    }
    setError(null);
    setPending(true);
    const sb = createClient();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/admin`
            : undefined,
      },
    });
    setPending(false);
    if (error) setError(error.message);
    else setMagicSent(true);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: admin.bg,
        padding: 20,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 380 }}>
        <div
          style={{
            fontFamily: "var(--font-serif), serif",
            fontStyle: "italic",
            fontSize: 30,
            color: admin.ink,
            marginBottom: 4,
          }}
        >
          JKStudio
        </div>
        <div
          style={{
            fontFamily: admin.mono,
            fontSize: 10.5,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: admin.ink2,
            marginBottom: 22,
          }}
        >
          Administration
        </div>

        {!configured ? (
          <p style={{ color: admin.ink2, fontSize: 13.5, lineHeight: 1.6 }}>
            Supabase n’est pas encore configuré. Renseignez
            <code style={{ color: admin.accent }}> NEXT_PUBLIC_SUPABASE_URL </code>
            et
            <code style={{ color: admin.accent }}> NEXT_PUBLIC_SUPABASE_ANON_KEY </code>
            dans <code>.env.local</code>, puis rechargez.
          </p>
        ) : magicSent ? (
          <p style={{ color: admin.ink, fontSize: 14, lineHeight: 1.6 }}>
            Lien de connexion envoyé à <b>{email}</b>. Vérifiez votre boîte mail.
          </p>
        ) : (
          <form onSubmit={login} style={{ display: "grid", gap: 16 }}>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </Field>
            <Field label="Mot de passe">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
            {error && (
              <div style={{ color: admin.danger, fontSize: 12.5 }}>{error}</div>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? "Connexion…" : "Se connecter"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={magic}
              disabled={pending}
            >
              Recevoir un lien magique
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}

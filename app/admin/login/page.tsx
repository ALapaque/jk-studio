"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { AdminThemeProvider } from "@/components/admin/AdminTheme";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <main className="grid min-h-screen place-items-center bg-background p-5 text-foreground">
      <div className="absolute right-4 top-4">
        <AdminThemeToggle />
      </div>
      <Card className="w-full max-w-sm">
        <CardContent className="p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-semibold">JK</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold">JKStudio</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Administration
              </div>
            </div>
          </div>

          {!configured ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Supabase n&apos;est pas encore configuré. Renseignez{" "}
              <code className="text-primary">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
              <code className="text-primary">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              dans <code>.env.local</code>, puis rechargez.
            </p>
          ) : magicSent ? (
            <p className="text-sm leading-relaxed">
              Lien de connexion envoyé à <b>{email}</b>. Vérifiez votre boîte mail.
            </p>
          ) : (
            <form onSubmit={login} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={pending} className="w-full">
                {pending && <Loader2 className="size-4 animate-spin" />}
                {pending ? "Connexion…" : "Se connecter"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={magic}
                disabled={pending}
                className="w-full"
              >
                Recevoir un lien magique
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <AdminThemeProvider>
      <Suspense>
        <LoginInner />
      </Suspense>
    </AdminThemeProvider>
  );
}

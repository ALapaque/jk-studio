// Primitives d'UI de l'admin — adossées à shadcn/ui + Tailwind (thème clair/
// sombre via .admin-root). Les noms d'export sont conservés pour compatibilité
// avec les pages existantes pendant la migration.
import React from "react";
import { cn } from "@/lib/utils";
import { Button as ShButton, buttonVariants } from "@/components/ui/button";
import { Input as ShInput } from "@/components/ui/input";
import { Textarea as ShTextarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card as ShCard,
  CardContent,
} from "@/components/ui/card";
import type { VariantProps } from "class-variance-authority";

/**
 * Ancien objet de tokens — conservé uniquement pour ne pas casser les imports
 * résiduels. Les nouvelles pages utilisent les classes Tailwind (text-foreground,
 * text-muted-foreground, border-border, bg-card, text-destructive…).
 * @deprecated privilégier les utilitaires Tailwind du thème.
 */
export const admin = {
  bg: "var(--background)",
  panel: "var(--card)",
  panel2: "var(--secondary)",
  border: "var(--border)",
  ink: "var(--foreground)",
  ink2: "var(--muted-foreground)",
  accent: "var(--primary)",
  danger: "var(--destructive)",
  mono: "var(--font-mono), ui-monospace, monospace",
  sans: "var(--font-sans), system-ui, sans-serif",
};

export function PageTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {children}
      </h1>
      {sub && <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Card({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <ShCard className={cn("gap-0 py-0", className)} style={style}>
      <CardContent className="p-5">{children}</CardContent>
    </ShCard>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function Input(props: React.ComponentProps<"input">) {
  return <ShInput {...props} />;
}

export function Textarea(props: React.ComponentProps<"textarea">) {
  return <ShTextarea {...props} />;
}

type OldVariant = "primary" | "ghost" | "danger";
type ShVariant = VariantProps<typeof buttonVariants>["variant"];

const VARIANT_MAP: Record<OldVariant, ShVariant> = {
  primary: "default",
  ghost: "outline",
  danger: "destructive",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: Omit<React.ComponentProps<typeof ShButton>, "variant"> & {
  variant?: OldVariant | ShVariant;
}) {
  const mapped =
    variant && variant in VARIANT_MAP
      ? VARIANT_MAP[variant as OldVariant]
      : (variant as ShVariant);
  return <ShButton variant={mapped} className={className} {...props} />;
}

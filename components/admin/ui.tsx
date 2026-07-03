// Primitives d'UI de l'admin (styles inline, utilisables en RSC ou client).
import React from "react";

export const admin = {
  bg: "#141210",
  panel: "#1c1a16",
  panel2: "#232019",
  border: "#2c281f",
  ink: "#e8e3d8",
  ink2: "#928b7c",
  accent: "#d6bc8c",
  danger: "#c96f4a",
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
    <div style={{ marginBottom: 28 }}>
      <h1
        style={{
          margin: 0,
          fontFamily: admin.sans,
          fontSize: 24,
          fontWeight: 600,
          color: admin.ink,
        }}
      >
        {children}
      </h1>
      {sub && (
        <p style={{ margin: "6px 0 0", color: admin.ink2, fontSize: 13.5 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: admin.panel,
        border: `1px solid ${admin.border}`,
        borderRadius: 10,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
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
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          fontFamily: admin.mono,
          fontSize: 10.5,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: admin.ink2,
        }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 11.5, color: admin.ink2 }}>{hint}</span>
      )}
    </label>
  );
}

const baseControl: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: admin.bg,
  border: `1px solid ${admin.border}`,
  borderRadius: 8,
  padding: "10px 12px",
  color: admin.ink,
  fontFamily: admin.sans,
  fontSize: 14,
  outline: "none",
};

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...baseControl, ...props.style }} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      style={{ ...baseControl, resize: "vertical", lineHeight: 1.5, ...props.style }}
    />
  );
}

export function Button({
  variant = "primary",
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const v: Record<string, React.CSSProperties> = {
    primary: { background: admin.accent, color: "#1a1510", border: "none" },
    ghost: {
      background: "transparent",
      color: admin.ink,
      border: `1px solid ${admin.border}`,
    },
    danger: {
      background: "transparent",
      color: admin.danger,
      border: `1px solid ${admin.danger}`,
    },
  };
  return (
    <button
      {...props}
      style={{
        borderRadius: 8,
        padding: "9px 16px",
        fontFamily: admin.mono,
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        ...v[variant],
        ...style,
      }}
    />
  );
}

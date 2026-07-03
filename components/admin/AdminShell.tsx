"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { admin } from "./ui";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/series", label: "Séries" },
  { href: "/admin/contenu", label: "Contenu" },
  { href: "/admin/apparence", label: "Apparence" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminShell({
  email,
  children,
}: {
  email?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: admin.bg,
        color: admin.ink,
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        fontFamily: admin.sans,
      }}
    >
      <aside
        style={{
          borderRight: `1px solid ${admin.border}`,
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-serif), serif",
            fontStyle: "italic",
            fontSize: 24,
            padding: "0 8px 4px",
          }}
        >
          JKStudio
        </div>
        <div
          style={{
            fontFamily: admin.mono,
            fontSize: 9.5,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: admin.ink2,
            padding: "0 8px 18px",
          }}
        >
          Administration
        </div>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            style={{
              padding: "9px 12px",
              borderRadius: 8,
              fontSize: 14,
              color: active(n.href, n.exact) ? "#1a1510" : admin.ink,
              background: active(n.href, n.exact) ? admin.accent : "transparent",
            }}
          >
            {n.label}
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          style={{ padding: "9px 12px", fontSize: 13, color: admin.ink2 }}
        >
          Voir le site ↗
        </a>
        {email && (
          <div style={{ padding: "4px 12px", fontSize: 11.5, color: admin.ink2 }}>
            {email}
          </div>
        )}
        <form action={signOut}>
          <button
            type="submit"
            style={{
              width: "100%",
              textAlign: "left",
              padding: "9px 12px",
              borderRadius: 8,
              border: `1px solid ${admin.border}`,
              background: "transparent",
              color: admin.ink,
              cursor: "pointer",
              fontFamily: admin.mono,
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Déconnexion
          </button>
        </form>
      </aside>

      <main style={{ padding: "36px 40px", maxWidth: 1100 }}>{children}</main>
    </div>
  );
}

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
    <div className="admin-shell" style={{ fontFamily: admin.sans }}>
      <aside className="admin-sidebar">
        <div>
          <div
            style={{
              fontFamily: "var(--font-serif), serif",
              fontStyle: "italic",
              fontSize: 22,
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
              marginTop: 2,
            }}
          >
            Administration
          </div>
        </div>

        <nav className="admin-nav">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={active(n.href, n.exact) ? "active" : ""}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="admin-spacer" />

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          style={{ padding: "6px 12px", fontSize: 13, color: admin.ink2 }}
        >
          Voir le site ↗
        </a>
        {email && (
          <div style={{ padding: "0 12px", fontSize: 11.5, color: admin.ink2 }}>
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

      <main className="admin-main">{children}</main>
    </div>
  );
}

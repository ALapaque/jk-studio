"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  LayoutDashboard,
  FolderOpen,
  GalleryVerticalEnd,
  FileText,
  Palette,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
} from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { AdminThemeToggle } from "./AdminThemeToggle";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "Catégories", icon: FolderOpen },
  { href: "/admin/series", label: "Séries", icon: GalleryVerticalEnd },
  { href: "/admin/contenu", label: "Contenu", icon: FileText },
  { href: "/admin/apparence", label: "Apparence", icon: Palette },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span className="text-sm font-semibold tracking-tight">JK</span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-foreground">JKStudio</div>
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Administration
        </div>
      </div>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => {
        const active = isActive(n.href, n.exact);
        const Icon = n.icon;
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="admin-nav-active"
                className="absolute inset-0 rounded-lg bg-accent"
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }
                }
              />
            )}
            <Icon className="relative z-10 size-4 shrink-0" />
            <span className="relative z-10">{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({
  email,
  onNavigate,
}: {
  email?: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-5 p-4">
      <div className="pt-1">
        <Brand />
      </div>
      <Separator />
      <NavLinks onNavigate={onNavigate} />
      <div className="flex-1" />
      <Separator />
      <div className="flex flex-col gap-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ExternalLink className="size-4" />
          Voir le site
        </a>
        {email && (
          <div className="flex items-center gap-2.5 px-2 py-1">
            <Avatar className="size-7">
              <AvatarFallback className="text-[11px]">
                {email.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </div>
        )}
        <form action={signOut}>
          <Button
            type="submit"
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <LogOut className="size-4" />
            Déconnexion
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AdminShell({
  email,
  children,
}: {
  email?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar lg:block">
        <SidebarBody email={email} />
      </aside>

      {/* Topbar — mobile */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Menu">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarBody email={email} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <Brand />
        <AdminThemeToggle />
      </header>

      {/* Main */}
      <div className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
          {/* Desktop theme toggle, top-right */}
          <div className="mb-2 hidden justify-end lg:flex">
            <AdminThemeToggle />
          </div>
          {children}
        </div>
      </div>

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

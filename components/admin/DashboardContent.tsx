"use client";

import Link from "next/link";
import {
  FolderOpen,
  GalleryVerticalEnd,
  Image as ImageIcon,
  Video,
  Mail,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/admin/ui";
import {
  Stagger,
  StaggerItem,
  AnimatedNumber,
} from "@/components/admin/motion-primitives";

export interface Counts {
  categories: number;
  projects: number;
  photos: number;
  videos: number;
  unread: number;
}

export interface RecentMessage {
  id: string;
  name: string;
  project_type: string | null;
  body: string;
}

const TILES: {
  key: keyof Counts;
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { key: "categories", label: "Catégories", href: "/admin/categories", icon: FolderOpen },
  { key: "projects", label: "Séries", href: "/admin/series", icon: GalleryVerticalEnd },
  { key: "photos", label: "Photos", href: "/admin/series", icon: ImageIcon },
  { key: "videos", label: "Vidéos", href: "/admin/series", icon: Video },
  { key: "unread", label: "Messages non lus", href: "/admin/messages", icon: Mail },
];

export function DashboardContent({
  counts,
  recent,
}: {
  counts: Counts;
  recent: RecentMessage[];
}) {
  const reduce = useReducedMotion();
  return (
    <div>
      <PageTitle sub="Vue d'ensemble du contenu et des messages.">
        Tableau de bord
      </PageTitle>

      <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {TILES.map((t) => {
          const Icon = t.icon;
          return (
            <StaggerItem key={t.label}>
              <Link href={t.href} className="group block">
                <motion.div
                  whileHover={reduce ? undefined : { y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Card className="overflow-hidden transition-colors group-hover:border-primary/40">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <Icon className="size-5 text-muted-foreground" />
                        <ArrowRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </div>
                      <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                        <AnimatedNumber value={counts[t.key]} />
                      </div>
                      <div className="mt-1 text-xs font-medium text-muted-foreground">
                        {t.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Derniers messages
          </h2>
          <Link
            href="/admin/messages"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Tout voir →
          </Link>
        </div>

        {recent.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Aucun message pour l'instant.
            </CardContent>
          </Card>
        ) : (
          <Stagger className="grid gap-3">
            {recent.map((m) => (
              <StaggerItem key={m.id}>
                <Card className="transition-colors hover:border-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-foreground">{m.name}</span>
                      {m.project_type && (
                        <Badge variant="secondary" className="shrink-0">
                          {m.project_type}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {m.body}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}

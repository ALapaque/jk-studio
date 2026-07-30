import Link from "next/link";
import { Newspaper, Plus, Trash2, Pencil } from "lucide-react";
import { requireUser, getAllPosts } from "@/lib/admin";
import { createPost, deletePost } from "@/app/admin/post-actions";
import { PageTitle } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "@/components/admin/ActionForm";

export const dynamic = "force-dynamic";

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-BE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export default async function JournalPage() {
  await requireUser();
  const posts = await getAllPosts();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <PageTitle sub="Articles du journal — mariages réels, coulisses. Publie pour les rendre visibles sur /journal.">
          Journal
        </PageTitle>
        {/* createPost crée un brouillon puis ouvre son éditeur. */}
        <form action={createPost}>
          <Button type="submit">
            <Plus className="size-4" /> Nouvel article
          </Button>
        </form>
      </div>

      {posts.length ? (
        <div className="grid gap-2">
          {posts.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex flex-wrap items-center gap-3 p-4">
                <Newspaper className="size-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-foreground">
                      {p.title}
                    </span>
                    {p.published ? (
                      <Badge variant="secondary">Publié</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-amber-500/50 text-amber-600 dark:text-amber-400"
                      >
                        Brouillon
                      </Badge>
                    )}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    /journal/{p.slug} · {fmtDate(p.published_at ?? p.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/journal/${p.id}`}>
                      <Pencil className="size-3.5" /> Éditer
                    </Link>
                  </Button>
                  <ActionForm
                    action={deletePost}
                    hidden={{ id: p.id }}
                    confirm={`Supprimer l'article « ${p.title} » ? Définitif.`}
                    confirmLabel="Supprimer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Supprimer"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </ActionForm>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Aucun article. Clique « Nouvel article » pour commencer.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

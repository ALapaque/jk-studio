import Link from "next/link";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import { getAllCategories } from "@/lib/admin";
import { createCategory, deleteCategory, moveCategory } from "@/app/admin/actions";
import { PageTitle, Field, Input } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActionForm } from "@/components/admin/ActionForm";
import { Stagger, StaggerItem } from "@/components/admin/motion-primitives";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const cats = await getAllCategories();

  return (
    <div>
      <PageTitle sub="Les grandes familles du portfolio (Portrait, Mariage, …).">
        Catégories
      </PageTitle>

      <Stagger className="mb-8 grid gap-3">
        {cats.map((c, i) => (
          <StaggerItem key={c.id}>
            <Card className="transition-colors hover:border-primary/30">
              <CardContent className="flex flex-wrap items-center gap-3 p-3 pl-4">
                <span className="w-7 font-mono text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-foreground">
                    {c.title}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    /{c.slug}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ActionForm action={moveCategory} hidden={{ id: c.id, dir: "up" }}>
                    <Button variant="ghost" size="icon" aria-label="Monter">
                      <ChevronUp className="size-4" />
                    </Button>
                  </ActionForm>
                  <ActionForm action={moveCategory} hidden={{ id: c.id, dir: "down" }}>
                    <Button variant="ghost" size="icon" aria-label="Descendre">
                      <ChevronDown className="size-4" />
                    </Button>
                  </ActionForm>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/categories/${c.id}`}>
                      <Pencil className="size-3.5" /> Modifier
                    </Link>
                  </Button>
                  <ActionForm
                    action={deleteCategory}
                    hidden={{ id: c.id }}
                    confirm={`Supprimer « ${c.title} » et toutes ses séries ? Cette action est irréversible.`}
                    confirmLabel="Supprimer"
                  >
                    <Button variant="ghost" size="icon" aria-label="Supprimer" className="text-destructive hover:text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  </ActionForm>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
        {cats.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucune catégorie. Créez-en une ci-dessous.
          </p>
        )}
      </Stagger>

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <Plus className="size-4" /> Nouvelle catégorie
          </h2>
          <form action={createCategory} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Titre">
                <Input name="title" required placeholder="Portrait" />
              </Field>
              <Field label="Slug (optionnel)" hint="Laisser vide = généré du titre">
                <Input name="slug" placeholder="portrait" />
              </Field>
            </div>
            <Field label="Sous-titre">
              <Input name="subtitle" placeholder="Visages & lumière naturelle" />
            </Field>
            <Field label="Description">
              <Input name="description" placeholder="Visages, silences et lumière…" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Lieu">
                <Input name="location" placeholder="Bruxelles & ailleurs" />
              </Field>
              <Field label="Période">
                <Input name="period" placeholder="2024 — 2026" />
              </Field>
            </div>
            <div>
              <Button type="submit">Créer la catégorie</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

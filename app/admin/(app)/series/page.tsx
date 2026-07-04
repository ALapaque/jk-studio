import Link from "next/link";
import { ChevronUp, ChevronDown, Plus, ArrowRight } from "lucide-react";
import { getAllCategories, getAllProjects } from "@/lib/admin";
import { createProject, moveProject } from "@/app/admin/actions";
import { PageTitle, Field, Input } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "@/components/admin/ActionForm";
import { SelectField } from "@/components/admin/fields/SelectField";
import { SwitchField } from "@/components/admin/fields/SwitchField";
import { Stagger, StaggerItem } from "@/components/admin/motion-primitives";

export const dynamic = "force-dynamic";

export default async function SeriesPage() {
  const [projects, cats] = await Promise.all([
    getAllProjects(),
    getAllCategories(),
  ]);

  return (
    <div>
      <PageTitle sub="Chaque série regroupe des photos et des vidéos, dans une catégorie.">
        Séries
      </PageTitle>

      <Stagger className="mb-8 grid gap-3">
        {projects.map((p) => (
          <StaggerItem key={p.id}>
            <Card className="transition-colors hover:border-primary/30">
              <CardContent className="flex flex-wrap items-center gap-3 p-3 pl-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-foreground">
                      {p.title}
                    </span>
                    {!p.published && (
                      <Badge variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-400">
                        Brouillon
                      </Badge>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {p.categories?.title ?? "—"} · {p.photos?.[0]?.count ?? 0} photos
                    {" · "}
                    {p.videos?.[0]?.count ?? 0} vidéos
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ActionForm action={moveProject} hidden={{ id: p.id, dir: "up", category_id: p.category_id }}>
                    <Button variant="ghost" size="icon" aria-label="Monter">
                      <ChevronUp className="size-4" />
                    </Button>
                  </ActionForm>
                  <ActionForm action={moveProject} hidden={{ id: p.id, dir: "down", category_id: p.category_id }}>
                    <Button variant="ghost" size="icon" aria-label="Descendre">
                      <ChevronDown className="size-4" />
                    </Button>
                  </ActionForm>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/series/${p.id}`}>
                      Ouvrir <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucune série. Créez-en une ci-dessous.
          </p>
        )}
      </Stagger>

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <Plus className="size-4" /> Nouvelle série
          </h2>
          {cats.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Créez d&apos;abord une{" "}
              <Link href="/admin/categories" className="text-primary underline underline-offset-4">
                catégorie
              </Link>
              .
            </p>
          ) : (
            <form action={createProject} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Catégorie">
                  <SelectField
                    name="category_id"
                    required
                    placeholder="Choisir une catégorie"
                    options={cats.map((c) => ({ value: c.id, label: c.title }))}
                    defaultValue={cats[0]?.id}
                  />
                </Field>
                <Field label="Titre">
                  <Input name="title" required placeholder="Salomé & Jan" />
                </Field>
              </div>
              <Field label="Description">
                <Input name="description" placeholder="Une journée entière, une averse parfaite." />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Lieu">
                  <Input name="location" placeholder="Gand" />
                </Field>
                <Field label="Période">
                  <Input name="period" placeholder="2026" />
                </Field>
              </div>
              <SwitchField name="published" label="Publier immédiatement" hint="Visible sur le site public." />
              <div>
                <Button type="submit">Créer la série</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

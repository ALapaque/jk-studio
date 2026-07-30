import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireUser, getPost, getAllAssets, getAllFolders } from "@/lib/admin";
import { publicImageUrl } from "@/lib/supabase/storage";
import {
  updatePost,
  savePostCover,
  removePostCover,
} from "@/app/admin/post-actions";
import { PageTitle, Field, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SwitchField } from "@/components/admin/fields/SwitchField";
import { ContentImageUploader } from "@/components/admin/ContentImageUploader";
import { PostBodyEditor } from "@/components/admin/PostBodyEditor";
import { PostMediaEditor } from "@/components/admin/PostMediaEditor";

export const dynamic = "force-dynamic";

export default async function PostEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const [post, assets, folders] = await Promise.all([
    getPost(id),
    getAllAssets(),
    getAllFolders(),
  ]);
  if (!post) notFound();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Retour">
            <Link href="/admin/journal">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <PageTitle sub={`/journal/${post.slug}`}>Éditer l&apos;article</PageTitle>
        </div>
        {post.published && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/journal/${post.slug}`} target="_blank">
              <ExternalLink className="size-3.5" /> Voir en ligne
            </Link>
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="mb-5 grid gap-2">
            <span className="text-sm font-medium">Image de couverture</span>
            <ContentImageUploader
              label="Couverture"
              pathPrefix="journal/covers"
              currentSrc={publicImageUrl(post.cover_path) || undefined}
              save={savePostCover.bind(null, post.id)}
              remove={removePostCover.bind(null, post.id)}
              previewClassName="h-24 w-40"
              hint="Grande image en tête d'article et sur la liste du journal."
            />
          </div>

          <form action={updatePost} className="grid gap-4">
            <input type="hidden" name="id" value={post.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Titre">
                <Input name="title" defaultValue={post.title} required />
              </Field>
              <Field label="Slug (URL)" hint="Vide = généré depuis le titre">
                <Input name="slug" defaultValue={post.slug} />
              </Field>
            </div>
            <Field label="Chapô / résumé" hint="Court — repris en liste et en OpenGraph.">
              <Textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ""} />
            </Field>
            <Field label="Étiquettes" hint="Séparées par des virgules (ex. Mariage, Lorraine).">
              <Input name="tags" defaultValue={post.tags.join(", ")} />
            </Field>

            <div className="grid gap-2">
              <span className="text-sm font-medium">Corps de l&apos;article</span>
              <PostBodyEditor initial={post.body} />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium">Galerie de l&apos;article</span>
              <span className="text-xs text-muted-foreground">
                Images affichées en bas de l&apos;article, en grand, avec
                animations. Distinctes des images insérées dans le corps.
              </span>
              <PostMediaEditor
                initial={post.media}
                assets={assets}
                folders={folders}
              />
            </div>

            <SwitchField
              name="published"
              label="Publié"
              hint="Décoché = brouillon, invisible sur le site."
              defaultChecked={post.published}
            />

            <div>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

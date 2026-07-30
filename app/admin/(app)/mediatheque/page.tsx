import { requireUser, getFolderContents } from "@/lib/admin";
import { PageTitle } from "@/components/admin/ui";
import { MediaDrive } from "@/components/admin/MediaDrive";

export const dynamic = "force-dynamic";

/* Médiathèque — banque photo façon drive (admin uniquement).
 *
 * Navigation par dossier via le paramètre `?folder=<id>`. Jamais rendue sur le
 * site public : les tables sont en RLS admin-only (0006). */

export default async function MediathequePage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}) {
  await requireUser();
  const { folder } = await searchParams;
  const { breadcrumb, subfolders, allFolders, assets } =
    await getFolderContents(folder ?? null);

  return (
    <div>
      <PageTitle sub="Ta banque d'images — jamais affichée sur le site. Range, puis pioche depuis une série.">
        Médiathèque
      </PageTitle>
      <MediaDrive
        currentFolderId={folder ?? null}
        breadcrumb={breadcrumb}
        subfolders={subfolders}
        allFolders={allFolders}
        assets={assets}
      />
    </div>
  );
}

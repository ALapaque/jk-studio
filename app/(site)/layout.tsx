import { getAppearance, getSiteContent } from "@/lib/content";
import { publicImageUrl } from "@/lib/supabase/storage";
import { SiteChrome } from "@/components/SiteChrome";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appearance, content] = await Promise.all([
    getAppearance(),
    getSiteContent(),
  ]);
  const brand = {
    name: content.brand.name,
    tagline: content.brand.tagline,
    logoSrc: publicImageUrl(content.brand.logoPath) || "",
  };
  return (
    <SiteChrome
      grain={appearance.grain}
      brand={brand}
      nav={content.nav}
      footer={content.footer}
    >
      {children}
    </SiteChrome>
  );
}

import { getAppearance, getSiteContent } from "@/lib/content";
import { publicImageUrl } from "@/lib/supabase/storage";
import { SiteChrome } from "@/components/SiteChrome";
import { JsonLd } from "@/components/jk/JsonLd";

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
    <>
      {/* Données structurées, posées une seule fois pour tout le site public
          (le layout admin ne les inclut pas). */}
      <JsonLd content={content} />
      <SiteChrome
        grain={appearance.grain}
        brand={brand}
        nav={content.nav}
        footer={content.footer}
      >
        {children}
      </SiteChrome>
    </>
  );
}

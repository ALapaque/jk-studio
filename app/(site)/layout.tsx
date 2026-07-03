import { getAppearance, getSiteContent } from "@/lib/content";
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
  return (
    <SiteChrome grain={appearance.grain} footer={content.footer}>
      {children}
    </SiteChrome>
  );
}

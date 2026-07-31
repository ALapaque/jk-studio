import type { SiteContent } from "@/lib/content";

/** Props d'un template de la page À-propos. */
export interface AboutTemplateProps {
  about: SiteContent["about"];
}

export interface AboutTemplateEntry {
  key: string;
  label: string;
  description: string;
  Component: (props: AboutTemplateProps) => React.ReactNode;
}

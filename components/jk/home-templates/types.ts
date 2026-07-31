import type { Category } from "@/lib/types";
import type { SiteContent } from "@/lib/content";

/** Props d'un template de la page d'accueil. */
export interface HomeTemplateProps {
  cats: Category[];
  content: SiteContent;
}

export interface HomeTemplateEntry {
  key: string;
  label: string;
  description: string;
  Component: (props: HomeTemplateProps) => React.ReactNode;
}

import type { Category } from "@/lib/types";
import type { SiteContent } from "@/lib/content";

/** Props d'un template de l'index Portfolio (/travaux). */
export interface WorksTemplateProps {
  cats: Category[];
  content: SiteContent;
}

export interface WorksTemplateEntry {
  key: string;
  label: string;
  description: string;
  Component: (props: WorksTemplateProps) => React.ReactNode;
}

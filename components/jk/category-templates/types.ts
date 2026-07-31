import type { Category } from "@/lib/types";

/** Props d'un template de page détail de catégorie. */
export interface CategoryTemplateProps {
  category: Category;
}

export interface CategoryTemplateEntry {
  key: string;
  label: string;
  description: string;
  Component: (props: CategoryTemplateProps) => React.ReactNode;
}

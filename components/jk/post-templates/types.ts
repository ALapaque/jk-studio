import type { Post } from "@/lib/types";

/** Props d'un template de page détail d'article. Le post est déjà normalisé
 *  (URLs résolues) par `mapPost` — identique en public et en aperçu admin. */
export interface PostTemplateProps {
  post: Post;
}

/** Descripteur d'un template dans le registre. */
export interface PostTemplateEntry {
  key: string;
  label: string;
  description: string;
  Component: (props: PostTemplateProps) => React.ReactNode;
}

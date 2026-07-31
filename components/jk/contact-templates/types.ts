import type { SiteContent } from "@/lib/content";

/** Props d'un template de la page Contact. `preview` neutralise l'envoi du
 *  formulaire dans l'aperçu admin. */
export interface ContactTemplateProps {
  contact: SiteContent["contact"];
  preview?: boolean;
}

export interface ContactTemplateEntry {
  key: string;
  label: string;
  description: string;
  Component: (props: ContactTemplateProps) => React.ReactNode;
}

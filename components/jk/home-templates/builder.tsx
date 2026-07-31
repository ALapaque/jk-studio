import { Fragment } from "react";
import { normalizeHomeLayout } from "@/lib/home-layout";
import { deriveHomeData } from "./shared";
import { renderHomeSection } from "./blocks";
import type { HomeTemplateProps } from "./types";

/* Template « builder » (composeur) de l'accueil.
 *
 * Ne fixe aucune composition : il lit `content.homeLayout` (réglé depuis
 * Contenu → Accueil) et rend les sections activées dans l'ordre choisi par le
 * photographe. Chaque section délègue à un bloc réutilisable (blocks.tsx).
 * Repli sur la composition classique tant que rien n'est personnalisé. */

export function HomeBuilder({ cats, content }: HomeTemplateProps) {
  const { sections } = normalizeHomeLayout(content.homeLayout);
  const data = deriveHomeData(cats, content);

  return (
    <main>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      {sections
        .filter((s) => s.enabled)
        .map((section) => (
          <Fragment key={section.type}>
            {renderHomeSection({ cats, content, data, section })}
          </Fragment>
        ))}
    </main>
  );
}

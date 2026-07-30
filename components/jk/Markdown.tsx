import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { ProseImage } from "./ProseImage";

/** Rendu du corps d'un article (Markdown → HTML assaini).
 *
 *  MÊME pipeline que l'aperçu de l'éditeur admin (remark-gfm + rehype-sanitize),
 *  donc ce que le photographe voit est ce qui est publié. `rehype-sanitize`
 *  neutralise tout HTML dangereux — le corps vient de la base, mais on ne fait
 *  jamais confiance à une chaîne pour l'injecter telle quelle.
 *
 *  La mise en forme (serif des titres, filets, images pleine largeur…) vit dans
 *  la classe `.jk-prose` de jk-tokens.css. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="jk-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          // Images du corps : figures animées + légende (voir ProseImage).
          img: ({ src, alt }) => (
            <ProseImage src={typeof src === "string" ? src : undefined} alt={alt} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

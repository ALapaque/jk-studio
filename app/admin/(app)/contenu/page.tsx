import { getSiteContent, type Fact } from "@/lib/content";
import {
  saveAbout,
  saveContact,
  saveFooter,
  saveHero,
  saveStudio,
} from "@/app/admin/actions";
import {
  admin,
  Button,
  Card,
  Field,
  Input,
  PageTitle,
  Textarea,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const factsToText = (f: Fact[]) => f.map((x) => `${x.k} | ${x.v}`).join("\n");

export default async function ContenuPage() {
  const c = await getSiteContent();

  return (
    <div>
      <PageTitle sub="Tous les textes du site. Les listes : une entrée par ligne. Les tableaux clé/valeur : « clé | valeur » par ligne.">
        Contenu
      </PageTitle>

      <div style={{ display: "grid", gap: 24 }}>
        {/* HERO */}
        <Card>
          <h2 style={sec}>Accueil — hero</h2>
          <form action={saveHero} style={grid}>
            <Field label="Accroche (petit texte)">
              <Input name="eyebrow" defaultValue={c.hero.eyebrow} />
            </Field>
            <Field label="Titre (une ligne par ligne affichée)">
              <Textarea name="titleLines" rows={2} defaultValue={c.hero.titleLines.join("\n")} />
            </Field>
            <div className="admin-2col">
              <Field label="Coordonnées">
                <Input name="coords" defaultValue={c.hero.coords} />
              </Field>
              <Field label="Ligne des catégories">
                <Input name="categoriesLine" defaultValue={c.hero.categoriesLine} />
              </Field>
            </div>
            <Save />
          </form>
        </Card>

        {/* STUDIO */}
        <Card>
          <h2 style={sec}>Accueil — bloc « Le studio »</h2>
          <form action={saveStudio} style={grid}>
            <Field label="Phrase (début)">
              <Input name="lead" defaultValue={c.studio.lead} />
            </Field>
            <Field label="Phrase (partie en accent)">
              <Input name="leadEm" defaultValue={c.studio.leadEm} />
            </Field>
            <Field label="Paragraphe">
              <Textarea name="paragraph" rows={3} defaultValue={c.studio.paragraph} />
            </Field>
            <Field label="Faits (clé | valeur)">
              <Textarea name="facts" rows={3} defaultValue={factsToText(c.studio.facts)} />
            </Field>
            <Save />
          </form>
        </Card>

        {/* ABOUT */}
        <Card>
          <h2 style={sec}>À propos</h2>
          <form action={saveAbout} style={grid}>
            <Field label="Titre">
              <Input name="title" defaultValue={c.about.title} />
            </Field>
            <div className="admin-2col">
              <Field label="Légende du portrait">
                <Input name="portraitCaption" defaultValue={c.about.portraitCaption} />
              </Field>
              <Field label="Année du portrait">
                <Input name="portraitYear" defaultValue={c.about.portraitYear} />
              </Field>
            </div>
            <Field label="Paragraphes (un par ligne)">
              <Textarea name="paragraphs" rows={4} defaultValue={c.about.paragraphs.join("\n")} />
            </Field>
            <Field label="Faits (clé | valeur)">
              <Textarea name="facts" rows={3} defaultValue={factsToText(c.about.facts)} />
            </Field>
            <Field label="Principes (un par ligne)">
              <Textarea name="principles" rows={3} defaultValue={c.about.principles.join("\n")} />
            </Field>
            <Save />
          </form>
        </Card>

        {/* CONTACT */}
        <Card>
          <h2 style={sec}>Contact</h2>
          <form action={saveContact} style={grid}>
            <Field label="Titre">
              <Input name="title" defaultValue={c.contact.title} />
            </Field>
            <Field label="Accroche">
              <Textarea name="lead" rows={2} defaultValue={c.contact.lead} />
            </Field>
            <div className="admin-2col">
              <Field label="Email">
                <Input name="email" defaultValue={c.contact.email} />
              </Field>
              <Field label="Ligne de réponse">
                <Input name="response" defaultValue={c.contact.response} />
              </Field>
            </div>
            <Field label="Faits (clé | valeur)">
              <Textarea name="facts" rows={3} defaultValue={factsToText(c.contact.facts)} />
            </Field>
            <Field label="Types de projet (un par ligne)">
              <Textarea name="projectTypes" rows={3} defaultValue={c.contact.projectTypes.join("\n")} />
            </Field>
            <Save />
          </form>
        </Card>

        {/* FOOTER */}
        <Card>
          <h2 style={sec}>Pied de page</h2>
          <form action={saveFooter} style={grid}>
            <div className="admin-2col">
              <Field label="Copyright">
                <Input name="copyright" defaultValue={c.footer.copyright} />
              </Field>
              <Field label="Localisation">
                <Input name="location" defaultValue={c.footer.location} />
              </Field>
            </div>
            <Field label="Réseaux (un par ligne)">
              <Textarea name="socials" rows={3} defaultValue={c.footer.socials.join("\n")} />
            </Field>
            <Save />
          </form>
        </Card>
      </div>
    </div>
  );
}

const sec: React.CSSProperties = { marginTop: 0, fontSize: 16, color: admin.ink };
const grid: React.CSSProperties = { display: "grid", gap: 14 };

function Save() {
  return (
    <div>
      <Button type="submit">Enregistrer</Button>
    </div>
  );
}

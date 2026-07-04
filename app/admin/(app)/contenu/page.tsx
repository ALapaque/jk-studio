import { getSiteContent, type Fact } from "@/lib/content";
import {
  saveAbout,
  saveContact,
  saveFooter,
  saveHero,
  saveStudio,
} from "@/app/admin/actions";
import { PageTitle, Field, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

const factsToText = (f: Fact[]) => f.map((x) => `${x.k} | ${x.v}`).join("\n");

function Save() {
  return (
    <div>
      <Button type="submit">Enregistrer</Button>
    </div>
  );
}

export default async function ContenuPage() {
  const c = await getSiteContent();

  return (
    <div>
      <PageTitle sub="Tous les textes du site. Les listes : une entrée par ligne. Les tableaux clé/valeur : « clé | valeur » par ligne.">
        Contenu
      </PageTitle>

      <Tabs defaultValue="hero">
        <TabsList className="mb-5 flex-wrap">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="studio">Le studio</TabsTrigger>
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="footer">Pied de page</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardContent className="p-5">
              <form action={saveHero} className="grid gap-4">
                <Field label="Accroche (petit texte)">
                  <Input name="eyebrow" defaultValue={c.hero.eyebrow} />
                </Field>
                <Field label="Titre (une ligne par ligne affichée)">
                  <Textarea name="titleLines" rows={2} defaultValue={c.hero.titleLines.join("\n")} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Coordonnées">
                    <Input name="coords" defaultValue={c.hero.coords} />
                  </Field>
                  <Field label="Ligne des catégories">
                    <Input name="categoriesLine" defaultValue={c.hero.categoriesLine} />
                  </Field>
                </div>
                <Save />
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="studio">
          <Card>
            <CardContent className="p-5">
              <form action={saveStudio} className="grid gap-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardContent className="p-5">
              <form action={saveAbout} className="grid gap-4">
                <Field label="Titre">
                  <Input name="title" defaultValue={c.about.title} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardContent className="p-5">
              <form action={saveContact} className="grid gap-4">
                <Field label="Titre">
                  <Input name="title" defaultValue={c.contact.title} />
                </Field>
                <Field label="Accroche">
                  <Textarea name="lead" rows={2} defaultValue={c.contact.lead} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardContent className="p-5">
              <form action={saveFooter} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

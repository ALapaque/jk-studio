import { getSiteContent, type Fact } from "@/lib/content";
import { publicImageUrl } from "@/lib/supabase/storage";
import {
  saveAbout,
  saveAboutPortrait,
  removeAboutPortrait,
  saveBrand,
  saveBrandLogo,
  removeBrandLogo,
  saveBrandFavicon,
  removeBrandFavicon,
  saveContact,
  saveFooter,
  saveHero,
  saveHome,
  saveNav,
  saveNotFound,
  saveStudio,
  saveWorks,
} from "@/app/admin/actions";
import { PageTitle, Field, Input, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentImageUploader } from "@/components/admin/ContentImageUploader";

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

      <Tabs defaultValue="brand">
        <TabsList className="mb-5 flex-wrap">
          <TabsTrigger value="brand">Marque & nav</TabsTrigger>
          <TabsTrigger value="home">Accueil</TabsTrigger>
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="footer">Pied de page</TabsTrigger>
          <TabsTrigger value="misc">Divers</TabsTrigger>
        </TabsList>

        {/* ---- MARQUE & NAV ---- */}
        <TabsContent value="brand">
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4 text-base font-semibold text-foreground">Identité</h3>
                <div className="mb-5 grid gap-2">
                  <span className="text-sm font-medium">Logo</span>
                  <ContentImageUploader
                    label="Logo"
                    pathPrefix="brand"
                    currentSrc={publicImageUrl(c.brand.logoPath) || undefined}
                    save={saveBrandLogo}
                    remove={removeBrandLogo}
                    hint="Affiché dans l'en-tête, le loader d'intro, le voile de transition et le pied de page. Sans logo, le nom ci-dessous est utilisé. Idéalement un PNG/SVG transparent monochrome."
                  />
                </div>
                <div className="mb-5 grid gap-2">
                  <span className="text-sm font-medium">Favicon</span>
                  <ContentImageUploader
                    label="Favicon"
                    pathPrefix="brand/favicon"
                    currentSrc={publicImageUrl(c.brand.faviconPath) || undefined}
                    save={saveBrandFavicon}
                    remove={removeBrandFavicon}
                    accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
                    previewClassName="size-16"
                    hint="Icône de l'onglet du navigateur. Image carrée (.png, .ico ou .svg), idéalement 512×512."
                  />
                </div>
                <form action={saveBrand} className="grid gap-4">
                  <Field label="Nom de la marque">
                    <Input name="name" defaultValue={c.brand.name} required />
                  </Field>
                  <Field label="Tagline (loader d'intro)">
                    <Input name="tagline" defaultValue={c.brand.tagline} />
                  </Field>
                  <Save />
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4 text-base font-semibold text-foreground">Navigation</h3>
                <form action={saveNav} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Travaux">
                      <Input name="work" defaultValue={c.nav.work} />
                    </Field>
                    <Field label="À propos">
                      <Input name="about" defaultValue={c.nav.about} />
                    </Field>
                    <Field label="Contact">
                      <Input name="contact" defaultValue={c.nav.contact} />
                    </Field>
                  </div>
                  <Save />
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---- ACCUEIL ---- */}
        <TabsContent value="home">
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4 text-base font-semibold text-foreground">Hero</h3>
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
                  <Field label="Indice de défilement">
                    <Input name="scrollHint" defaultValue={c.hero.scrollHint} />
                  </Field>
                  <Save />
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4 text-base font-semibold text-foreground">Titres des sections</h3>
                <form action={saveHome} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Section « Le studio »">
                      <Input name="studioTitle" defaultValue={c.home.studioTitle} />
                    </Field>
                    <Field label="Section « Sélection »">
                      <Input name="selectionTitle" defaultValue={c.home.selectionTitle} />
                    </Field>
                    <Field label="Section « Catégories »">
                      <Input name="categoriesTitle" defaultValue={c.home.categoriesTitle} />
                    </Field>
                    <Field label="Lien « Index complet »">
                      <Input name="categoriesLink" defaultValue={c.home.categoriesLink} />
                    </Field>
                  </div>
                  <Save />
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4 text-base font-semibold text-foreground">Bloc « Le studio »</h3>
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
          </div>
        </TabsContent>

        {/* ---- À PROPOS ---- */}
        <TabsContent value="about">
          <Card>
            <CardContent className="p-5">
              <div className="mb-5 grid gap-2">
                <span className="text-sm font-medium">Photo du portrait</span>
                <ContentImageUploader
                  label="Portrait"
                  pathPrefix="about"
                  currentSrc={publicImageUrl(c.about.portraitPath) || undefined}
                  save={saveAboutPortrait}
                  remove={removeAboutPortrait}
                  previewClassName="h-24 w-20"
                  hint="Affichée sur la page « À propos ». Sans image, une photo par défaut est utilisée."
                />
              </div>
              <form action={saveAbout} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Eyebrow">
                    <Input name="eyebrow" defaultValue={c.about.eyebrow} />
                  </Field>
                  <Field label="Titre">
                    <Input name="title" defaultValue={c.about.title} />
                  </Field>
                </div>
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
                <Field label="Lien d'appel à l'action">
                  <Input name="ctaLink" defaultValue={c.about.ctaLink} />
                </Field>
                <Save />
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- CONTACT ---- */}
        <TabsContent value="contact">
          <Card>
            <CardContent className="p-5">
              <form action={saveContact} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Eyebrow">
                    <Input name="eyebrow" defaultValue={c.contact.eyebrow} />
                  </Field>
                  <Field label="Titre">
                    <Input name="title" defaultValue={c.contact.title} />
                  </Field>
                </div>
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

        {/* ---- PIED DE PAGE ---- */}
        <TabsContent value="footer">
          <Card>
            <CardContent className="p-5">
              <form action={saveFooter} className="grid gap-4">
                <h3 className="text-sm font-medium text-muted-foreground">Appel à l&apos;action</h3>
                <Field label="Eyebrow du CTA">
                  <Input name="ctaEyebrow" defaultValue={c.footer.ctaEyebrow} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Titre CTA — ligne 1">
                    <Input name="ctaLine1" defaultValue={c.footer.ctaLine1} />
                  </Field>
                  <Field label="Titre CTA — ligne 2">
                    <Input name="ctaLine2" defaultValue={c.footer.ctaLine2} />
                  </Field>
                </div>
                <h3 className="mt-2 text-sm font-medium text-muted-foreground">Barre du bas</h3>
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

        {/* ---- DIVERS ---- */}
        <TabsContent value="misc">
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4 text-base font-semibold text-foreground">Page « Travaux » & navigation des séries</h3>
                <form action={saveWorks} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Eyebrow">
                      <Input name="eyebrow" defaultValue={c.works.eyebrow} />
                    </Field>
                    <Field label="Titre de la page" hint="Vide = utilise le nom du menu">
                      <Input name="title" defaultValue={c.works.title} />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Lien retour à l'index">
                      <Input name="backToIndex" defaultValue={c.works.backToIndex} />
                    </Field>
                    <Field label="Label « Catégorie »">
                      <Input name="categoryLabel" defaultValue={c.works.categoryLabel} />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Bouton « Précédent »">
                      <Input name="prev" defaultValue={c.works.prev} />
                    </Field>
                    <Field label="Bouton « Suivant »">
                      <Input name="next" defaultValue={c.works.next} />
                    </Field>
                  </div>
                  <Save />
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-4 text-base font-semibold text-foreground">Page 404</h3>
                <form action={saveNotFound} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Eyebrow">
                      <Input name="eyebrow" defaultValue={c.notFound.eyebrow} />
                    </Field>
                    <Field label="Titre">
                      <Input name="title" defaultValue={c.notFound.title} />
                    </Field>
                  </div>
                  <Field label="Lien de retour">
                    <Input name="cta" defaultValue={c.notFound.cta} />
                  </Field>
                  <Save />
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

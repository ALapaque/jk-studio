import { getAppearance } from "@/lib/content";
import { saveAppearance, savePageTemplates } from "@/app/admin/actions";
import { PageTitle, Field } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SelectField } from "@/components/admin/fields/SelectField";
import { SwitchField } from "@/components/admin/fields/SwitchField";
import { SliderField } from "@/components/admin/fields/SliderField";
import { PageTemplatesEditor } from "@/components/admin/PageTemplatesEditor";
import { HOME_TEMPLATE_OPTIONS } from "@/components/jk/home-templates";
import { WORKS_TEMPLATE_OPTIONS } from "@/components/jk/works-templates";
import { CATEGORY_TEMPLATE_OPTIONS } from "@/components/jk/category-templates";
import { ABOUT_TEMPLATE_OPTIONS } from "@/components/jk/about-templates";
import { CONTACT_TEMPLATE_OPTIONS } from "@/components/jk/contact-templates";

export const dynamic = "force-dynamic";

export default async function ApparencePage() {
  const a = await getAppearance();

  return (
    <div>
      <PageTitle sub="Couleur d'accent, thème par défaut, grain et halo — appliqués à tout le site public.">
        Apparence
      </PageTitle>

      <Card className="max-w-xl">
        <CardContent className="p-5">
          <form action={saveAppearance} className="grid gap-6">
            <Field label="Thème par défaut du site public">
              <SelectField
                name="defaultTheme"
                defaultValue={a.defaultTheme}
                options={[
                  { value: "dark", label: "Sombre" },
                  { value: "light", label: "Clair" },
                ]}
              />
            </Field>

            <Field label="Couleur d'accent" hint={`Actuelle : ${a.accent}`}>
              <input
                type="color"
                name="accent"
                defaultValue={a.accent}
                className="h-10 w-20 cursor-pointer rounded-md border border-input bg-transparent p-1"
              />
            </Field>

            <SwitchField
              name="grain"
              label="Grain filmique"
              hint="Ajoute une texture argentique sur le site public."
              defaultChecked={a.grain}
            />

            <Field label="Halo (glow)">
              <SliderField
                name="glow"
                defaultValue={a.glow}
                min={0}
                max={2}
                step={0.1}
                prefix="Intensité : "
              />
            </Field>

            <div>
              <Button type="submit">Enregistrer l&apos;apparence</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ---- Mise en page des pages ---- */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <h2 className="text-base font-semibold text-foreground">
            Mise en page des pages
          </h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            Choisis une mise en page pour chaque page du site, avec un aperçu
            bureau / mobile. Enregistre pour appliquer.
          </p>
          <form action={savePageTemplates} className="grid gap-5">
            <PageTemplatesEditor
              initial={a.pageTemplates}
              optionsByPage={{
                home: HOME_TEMPLATE_OPTIONS,
                works: WORKS_TEMPLATE_OPTIONS,
                category: CATEGORY_TEMPLATE_OPTIONS,
                about: ABOUT_TEMPLATE_OPTIONS,
                contact: CONTACT_TEMPLATE_OPTIONS,
              }}
            />
            <div>
              <Button type="submit">Enregistrer les mises en page</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

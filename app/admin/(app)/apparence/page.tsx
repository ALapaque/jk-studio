import { getAppearance } from "@/lib/content";
import { saveAppearance } from "@/app/admin/actions";
import { PageTitle, Field } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SelectField } from "@/components/admin/fields/SelectField";
import { SwitchField } from "@/components/admin/fields/SwitchField";
import { SliderField } from "@/components/admin/fields/SliderField";

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
    </div>
  );
}

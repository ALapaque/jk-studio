import { getAppearance } from "@/lib/content";
import { saveAppearance } from "@/app/admin/actions";
import {
  admin,
  Button,
  Card,
  Field,
  Input,
  PageTitle,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function ApparencePage() {
  const a = await getAppearance();

  return (
    <div>
      <PageTitle sub="Couleur d’accent, thème par défaut, grain et halo — appliqués à tout le site public.">
        Apparence
      </PageTitle>

      <Card style={{ maxWidth: 520 }}>
        <form action={saveAppearance} style={{ display: "grid", gap: 18 }}>
          <Field label="Thème par défaut">
            <select
              name="defaultTheme"
              defaultValue={a.defaultTheme}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: admin.bg,
                border: `1px solid ${admin.border}`,
                borderRadius: 8,
                padding: "10px 12px",
                color: admin.ink,
                fontSize: 14,
              }}
            >
              <option value="dark">Sombre</option>
              <option value="light">Clair</option>
            </select>
          </Field>

          <Field label="Couleur d’accent" hint={`Actuelle : ${a.accent}`}>
            <input
              type="color"
              name="accent"
              defaultValue={a.accent}
              style={{ width: 72, height: 40, background: "none", border: `1px solid ${admin.border}`, borderRadius: 8 }}
            />
          </Field>

          <label style={{ display: "flex", gap: 10, alignItems: "center", color: admin.ink, fontSize: 14 }}>
            <input type="checkbox" name="grain" defaultChecked={a.grain} />
            Grain filmique
          </label>

          <Field label={`Halo (glow) — ${a.glow}`}>
            <input
              type="range"
              name="glow"
              min={0}
              max={2}
              step={0.1}
              defaultValue={a.glow}
              style={{ width: "100%" }}
            />
          </Field>

          <div>
            <Button type="submit">Enregistrer l’apparence</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

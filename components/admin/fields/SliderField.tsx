"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

/**
 * Slider shadcn (Radix) qui poste une valeur numérique via un input caché
 * (`Number(formData.get(name))` reste valide côté Server Action).
 * Le libellé se compose avec des props simples (pas de fonction, pour rester
 * sérialisable entre Server et Client Components).
 */
export function SliderField({
  name,
  defaultValue,
  min = 0,
  max = 2,
  step = 0.1,
  prefix = "",
  decimals = 1,
}: {
  name: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  decimals?: number;
}) {
  const [v, setV] = useState(defaultValue);
  return (
    <div className="grid gap-3">
      <span className="text-sm tabular-nums text-muted-foreground">
        {prefix}
        {v.toFixed(decimals)}
      </span>
      <input type="hidden" name={name} value={v} />
      <Slider
        value={[v]}
        min={min}
        max={max}
        step={step}
        onValueChange={([n]) => setV(n)}
      />
    </div>
  );
}

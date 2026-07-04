"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Switch shadcn qui respecte la sémantique d'une checkbox HTML : l'input caché
 * (`value="on"`) n'est présent QUE lorsqu'il est activé — les Server Actions
 * testent `formData.get(name) === "on"`.
 */
export function SwitchField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(!!defaultChecked);
  const id = `sw-${name}`;
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <div className="grid gap-0.5">
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {on && <input type="hidden" name={name} value="on" />}
      <Switch id={id} checked={on} onCheckedChange={setOn} />
    </div>
  );
}

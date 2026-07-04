"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Option {
  value: string;
  label: string;
}

/**
 * Select shadcn (Radix) qui poste bien sa valeur dans un `<form action>` via un
 * input caché — Radix Select ne participe pas nativement aux formulaires.
 */
export function SelectField({
  name,
  options,
  defaultValue,
  placeholder,
  required,
  id,
}: {
  name: string;
  options: Option[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <>
      <input type="hidden" name={name} value={value} required={required} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder ?? "Sélectionner…"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

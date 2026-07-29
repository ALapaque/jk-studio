import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Maquettes Claude Design conservées telles quelles pour référence
    // (prototypes HTML/JS, pas du code applicatif) — les linter n'a pas de
    // sens et masque les vraies erreurs du projet.
    "legacy/**",
  ]),
]);

export default eslintConfig;

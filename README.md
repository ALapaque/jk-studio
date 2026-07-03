# JKStudio — Portfolio photo & vidéo

Site vitrine d'un studio photo & vidéo bruxellois, réimplémenté en **Next.js**
d'après la maquette Claude Design `JKStudio Site.dc.html`.

Site richement animé (curseur custom, parallaxe 3D, révélations au scroll,
transitions plein écran, lightbox photo/vidéo, thème clair/sombre, grain
filmique), désormais en **vraies routes** avec rendu serveur (SEO) et prêt à
accueillir un back-office Supabase + une admin sur mesure.

## Stack

| Brique | Techno |
|---|---|
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Hébergement cible | **Vercel** (SSR/ISR, `next/image` natif) |
| Données (Phase 2) | Supabase — Auth + Postgres + Storage images |
| Vidéo | Embeds YouTube / Vimeo (jamais de fichier stocké) |
| Animations | moteur maison porté de la maquette (hooks/composants React) |

## État — Phase 1 (site public) ✅

- Toutes les routes publiques : `/`, `/travaux`, `/travaux/[categorie]`,
  `/travaux/[categorie]/[serie]`, `/a-propos`, `/contact`, 404.
- Design fidèle à la maquette (thème clair/sombre, curseur, parallaxe, reveals,
  transitions, lightbox, grain).
- Contenu servi par des **données de démonstration** (`lib/demo-data.ts`,
  transcription de la maquette) — remplacées par Supabase en Phase 2.

Phases suivantes : **P2** Supabase + admin CMS complet · **P3** déploiement
Vercel + finitions SEO.

## Développement

```bash
npm install
npm run dev        # http://localhost:3000
```

Build de production :

```bash
npm run build
npm run start
```

> Note environnement : `next/font` et l'optimiseur `next/image` récupèrent des
> ressources distantes au build/à l'exécution. Derrière un proxy sortant, lancer
> avec `NODE_USE_ENV_PROXY=1` (Node ≥ 22.21).

## Structure

```
app/                 routes (public ; admin en P2)
components/          UI + moteur d'animation (components/motion/)
lib/                 theme, contenu, données de démo, utilitaires vidéo, types
legacy/              maquette d'origine (.dc.html + support.js) pour référence
```

## Personnalisation (Phase 1)

- **Contenu éditorial** : `lib/content.ts` (accueil / à-propos / contact / footer).
- **Catégories, séries, médias** : `lib/demo-data.ts`.
- **Apparence** (accent, thème par défaut, grain, halo) : `lib/theme.ts`
  (`DEFAULT_APPEARANCE`). En Phase 2, ces réglages passeront dans l'admin.

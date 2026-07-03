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

## État

**Phase 1 — site public ✅** : routes `/`, `/travaux`, `/travaux/[categorie]`,
`/travaux/[categorie]/[serie]`, `/a-propos`, `/contact`, 404. Design fidèle à la
maquette (thème clair/sombre, curseur, parallaxe, reveals, transitions, lightbox,
grain).

**Phase 2 — Supabase + admin CMS ✅** : base Postgres + RLS + stockage images,
**admin complet** sur `/admin` (auth, catégories, séries, upload photos, vidéos
YouTube/Vimeo, textes éditoriaux, apparence, messages), formulaire de contact
(Supabase + email Resend). Le site fonctionne aussi **sans Supabase** (repli sur
les données de démo).

**Phase 3 — déploiement Vercel** : voir [`docs/DEPLOY_VERCEL.md`](docs/DEPLOY_VERCEL.md).

## Développement

```bash
npm install
cp .env.example .env.local     # puis remplir (voir docs/SUPABASE_SETUP.md)
npm run dev                    # http://localhost:3000
npm run seed                  # (optionnel) remplit Supabase avec la démo
```

Sans `.env.local`, le site tourne sur les données de démonstration et l'admin
affiche un message de configuration.

### Guides

- **Mise en ligne de A à Z** : [`docs/MISE_EN_LIGNE.md`](docs/MISE_EN_LIGNE.md) ← commence ici
- Mise en place Supabase : [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)
- Utilisation de l'admin : [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md)
- Déploiement Vercel : [`docs/DEPLOY_VERCEL.md`](docs/DEPLOY_VERCEL.md)

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

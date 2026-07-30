# Refonte — mesure des Core Web Vitals

> Livrable du Lot 7 (§10). Première mesure réelle du projet : l'accès à une URL
> n'a été possible qu'après l'ouverture de la preview Vercel.

## Conditions

Lighthouse 12, **mobile, 4G simulée** (`--throttling-method=simulate`), contre le
**build de production** servi localement. Page préchauffée, **deux runs**
concordants — la première mesure, faite à froid, donnait un TBT de 1 740 ms
manifestement aberrant et a été écartée.

Lighthouse applique son propre modèle réseau, donc le critère « 4G simulée » du
brief est respecté. En revanche le TTFB local est optimiste par rapport au CDN :
**les LCP ci-dessous sont un plancher, pas une valeur de production.**

⚠️ Mesuré sur les **données de démonstration** : images Unsplash servies via
`/_next/image`. Le chemin « variantes CDN » du Lot 4 n'est donc **pas exercé** —
il le sera après la migration `0005` et le backfill.

## Résultats — page série (défilé plein écran)

| Métrique | Mesure | Critère du §7 | Verdict |
|---|---|---|---|
| **LCP** | **3,8 – 3,9 s** | < 2,5 s | ❌ |
| **CLS** | **0** | ≈ 0 | ✅ |
| TBT | 60 – 80 ms | — | — |
| Score performance | 88 – 89 | — | — |

**CLS à 0** : aucun décalage de layout, le critère est tenu franchement.

**LCP hors critère**, et la cause n'est pas celle qu'on attend.

## Pourquoi le LCP est à 3,9 s

**L'élément LCP est le `<h1>` du titre de série, pas une image.** C'est du texte :
il n'est donc pas retardé par le poids des photos, mais par ce qui bloque le
rendu avant lui.

Poids relevé sur cette page :

| Type | Requêtes | Transféré |
|---|---:|---:|
| Scripts | 14 | 214,6 Ko |
| **Polices** | **6** | **123,7 Ko** |
| Images | 4 | 86,6 Ko |
| Feuille de style | 1 | 14,8 Ko |
| **Total** | **26** | **448,9 Ko** |

Deux causes structurelles :

1. **Six fichiers de police pour deux familles utiles.** Les écrans de la refonte
   n'emploient qu'Instrument Serif et IBM Plex Sans. Archivo et Space Mono sont
   chargées parce qu'elles servent aux **anciens** écrans.
2. **214 Ko de JavaScript**, dont le moteur d'animation historique (curseur
   custom, parallaxe, transitions plein écran) — que les pages de la refonte
   n'utilisent pas.

> **Correction (mesure ultérieure).** J'avais attribué ces deux causes au layout
> partagé `(site)`. C'est faux pour les polices : elles sont déclarées dans le
> **layout racine** (`app/layout.tsx`), appliquées à `<html>` pour tout le site.
> Détacher les écrans de la refonte de `(site)` ne pouvait donc pas les réduire —
> et ne les a pas réduites. Voir la section suivante.

## Correction déjà appliquée

L'écran d'ouverture utilisait une `background-image` CSS — invisible au scanner
de préchargement, non prioritisable, sans `srcset`. Remplacée par `<Image priority>`.

**Ça n'a pas déplacé le LCP** (l'élément LCP est le `<h1>`), et c'était prévisible
une fois le diagnostic posé. Le correctif reste juste sur le fond : sur de vraies
photos, une cover lourde peut redevenir l'élément LCP, et elle sera alors
découverte et priorisée correctement.

## Après détachement du layout — mesure et démenti

Les écrans de la refonte ont été sortis de `SiteChrome` et placés dans un groupe
`(refonte)` avec leur propre layout (nav et footer de la maquette, sans le moteur
d'animation historique). Objectif annoncé : corriger d'un coup la fidélité au
design **et** le LCP.

**Le design est corrigé, la performance non.** Mesure après détachement, deux runs
concordants :

| Métrique | Avant détachement | Après |
|---|---|---|
| LCP | 3,8 – 3,9 s | **4,6 – 4,7 s** |
| CLS | 0 | 0 |
| Score | 88 – 89 | 83 |
| Polices | 6 fichiers / 124 Ko | **6 fichiers / 124 Ko** |
| JS | 214 Ko | **237 Ko** |

Les polices n'ont pas bougé — elles viennent du layout racine, pas de `(site)`.
Le JS a légèrement augmenté (nav en composant client, footer, JSON-LD), et le LCP
avec lui. **L'hypothèse « un seul changement corrige les deux » était fausse**, et
la mesure l'a montrée.

## Le vrai levier pour le LCP

L'élément LCP est le `<h1>`, en `--jk-serif`. Il attend donc la police, et six
fichiers (124 Ko) sont téléchargés alors que ces écrans n'en emploient que deux
familles.

Le levier est de **déclarer les polices par groupe de routes** plutôt que sur
`<html>` : Instrument Serif + IBM Plex Sans pour la refonte, Archivo + Space Mono
pour les écrans historiques et l'admin. Cela suppose de toucher le layout racine,
partagé avec l'admin — donc un changement à faire et à mesurer isolément, pas en
passant.

**Recommandation** : le traiter comme un chantier à part, avant ou pendant la
bascule, avec une mesure avant/après. Et refaire la mesure sur données réelles
avec les variantes CDN actives — les deux manquent ici, et les deux jouent en
faveur du LCP.

## Baseline

Le §3 demandait une baseline au Lot 0. Elle n'a pas pu être établie : la preview
était alors derrière le SSO Vercel, et aucune URL n'était accessible. **La
comparaison avant/après demandée au §10 n'est donc pas possible** — ce document
constitue la première mesure du projet, pas une comparaison.

---

## Phase 1 — polices par groupe de routes (bascule terminée)

Le levier ci-dessus a été appliqué **après la bascule**. Trois changements :

- Root layout : `preload: true` pour Instrument Serif et IBM Plex Sans (les deux
  familles de la refonte, sur le chemin critique), `preload: false` pour Archivo
  et Space Mono (désormais **admin uniquement**).
- `ContactForm` restylé aux tokens `--jk-*` : c'était le dernier écran public à
  tirer Archivo / Space Mono et les variables de l'ancien thème.
- Résultat vérifiable sur `/` : **3 polices préchargées au lieu de 5**, et Archivo
  + Space Mono ne sont **plus téléchargées du tout** sur les pages publiques.

### Mesure locale (Lighthouse 12, preset mobile) — et sa limite

| Métrique | main (avant) | Phase 1 (après) |
|---|---|---|
| LCP | 2,4 – 2,6 s | 2,4 – 3,1 s |
| CLS | 0,001 | 0 |
| Score perf | 95 – 97 | 92 – 95 |
| Polices préchargées (/) | 5 | **3** |

**La mesure LCP locale n'est pas représentative de la production.** Deux raisons,
constatées pendant la mesure :

1. **Les images distantes (Unsplash / Supabase) ne se chargent pas** dans le
   Chromium du bac à sable. L'élément LCP retombe donc sur du **texte** (le nom
   du studio de l'intro, puis, intro masquée, le logo de la nav) — alors qu'en
   production, sur un site tout en images plein écran, le LCP sera très
   probablement la **photo du hero**.
2. Le LCP local est donc **borné par le rendu d'un texte en police web (~2,5 s
   sous throttling mobile)**, indépendamment du nombre de préchargements — la
   serif était déjà préchargée sur `main`. D'où un avant/après **neutre en LCP**
   ici, alors que le gain réel (2 familles de police en moins sur le réseau)
   ne se voit que sous contrainte de bande passante réelle.

### Ce que Phase 1 apporte réellement

- Chemin critique allégé pour le **vrai** visiteur : le site public ne télécharge
  plus les polices de l'admin (Archivo 3 graisses + Space Mono 2 graisses).
- Architecture correcte : les polices admin restent à l'admin.
- `ContactForm` cohérent avec les tokens de la refonte (dette technique soldée).

### À vérifier en production (non mesurable ici)

- LCP réel sur le preview Vercel, avec images et CDN actifs — idéalement en
  **données de terrain** (Core Web Vitals / RUM), pas seulement en labo.
- Si le **hero** devient l'élément LCP (probable), les leviers suivants seront
  côté image (AVIF, priorité, taille de la variante servie) — c'est l'objet de
  la Phase 2.

---

## Phase 2 — AVIF sur le chemin next/image

`images.formats = ['image/avif', 'image/webp']` dans `next.config.ts` (le défaut
Next était `['image/webp']` seul). AVIF est préféré quand le navigateur l'accepte,
avec repli WebP puis format d'origine.

Portée :

- **Couvre le hero de l'accueil et les covers de série** — l'élément LCP probable
  en production — ainsi que vignettes, portraits, logos de preuve sociale : tout
  ce qui passe par `next/image`. AVIF ≈ 20 % plus léger que WebP.
- **Ne couvre pas** le défilé immersif (`SeriesScroller`) : ses dérivés WebP sont
  servis directement par le CDN Supabase et contournent `next/image` à dessein
  (pas de consommation du quota de transformations). Ils ne sont pas l'élément
  LCP. Leur passage à l'AVIF supposerait de générer des dérivés AVIF via le
  backfill `sharp` (le canvas navigateur ne sait pas encoder l'AVIF) et un
  élément `<picture>` — chantier distinct, à ouvrir seulement si la mesure
  terrain le justifie.

Compromis assumé (doc Next) : le tout premier accès à une image est ~50 % plus
lent à encoder en AVIF, puis servi depuis le cache. Sur Vercel, l'optimiseur gère
l'en-tête `Accept` et le cache par format nativement.

**À mesurer en prod** (PageSpeed / données terrain) : LCP et poids du hero avant
(WebP) vs après (AVIF). Non mesurable dans ce bac à sable (images distantes non
chargées en local, interstitiel HSTS sur le preview).

### Mesure prod (preview Vercel) — négociation de format vérifiée

Lighthouse reste inaccessible depuis le bac à sable, mais l'optimiseur, lui, est
joignable via `curl` (le proxy porte le CA). Requête de l'URL `/_next/image` du
hero de l'accueil, en faisant varier l'en-tête `Accept` :

| `Accept` | `Content-Type` servi | Poids du hero |
|---|---|---|
| `image/webp` | `image/webp` | 25 842 o |
| `image/avif` | **`image/avif`** | **15 418 o** |

- Réponse `vary: Accept` + `cache-control: public, max-age=31536000` : négociation
  et cache par format corrects.
- **~40 % plus léger** en AVIF qu'en WebP sur l'élément LCP réel — au-delà des
  20 % annoncés par la doc Next pour cette image.

Reste à confirmer l'impact **LCP** (temps, pas seulement poids) en données de
terrain une fois la prod à jour — mais le gain de charge utile sur le hero est
acquis et mesuré.

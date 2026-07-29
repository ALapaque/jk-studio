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

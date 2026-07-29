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

Les deux arrivent par le **layout partagé `(site)`** : les nouvelles routes
héritent de tout le chrome de l'ancien site.

## Correction déjà appliquée

L'écran d'ouverture utilisait une `background-image` CSS — invisible au scanner
de préchargement, non prioritisable, sans `srcset`. Remplacée par `<Image priority>`.

**Ça n'a pas déplacé le LCP** (l'élément LCP est le `<h1>`), et c'était prévisible
une fois le diagnostic posé. Le correctif reste juste sur le fond : sur de vraies
photos, une cover lourde peut redevenir l'élément LCP, et elle sera alors
découverte et priorisée correctement.

## Ce qui reste à faire — décision requise

Descendre sous 2,5 s suppose de **détacher les écrans de la refonte du layout
historique** : leur donner leur propre layout, sans le moteur d'animation ni les
polices qu'ils n'utilisent pas. Cela supprimerait l'essentiel des 214 Ko de JS et
la moitié des 123 Ko de polices.

C'est un changement **architectural**, qui relève de la bascule finale — et le
brief interdit de le décider seul. Il devient naturel au moment où les anciennes
routes disparaissent : le problème se règle alors de lui-même.

**Recommandation** : traiter ce point pendant la bascule, pas avant. Refaire la
mesure ensuite, sur données réelles et avec les variantes CDN actives — les deux
manquent ici, et les deux jouent en faveur du LCP.

## Baseline

Le §3 demandait une baseline au Lot 0. Elle n'a pas pu être établie : la preview
était alors derrière le SSO Vercel, et aucune URL n'était accessible. **La
comparaison avant/après demandée au §10 n'est donc pas possible** — ce document
constitue la première mesure du projet, pas une comparaison.

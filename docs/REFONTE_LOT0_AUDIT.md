# Refonte JKStudio — Lot 0 : audit préalable

> Livrable du Lot 0 (« rapport, pas de code »). Aucune modification fonctionnelle.
> Maquette de référence préservée dans [`legacy/refonte/`](../legacy/refonte/).

---

## 1. Écarts majeurs entre le brief et le repo

**À lire en premier : le brief décrit un point de départ nettement plus pauvre que la réalité.**
Plusieurs livrables des lots 1 et 2 existent déjà.

| # | Le brief affirme | Réalité du repo | Impact |
|---|---|---|---|
| 1 | Table `series` **à créer** (§4) | **Existe** sous le nom **`projects`** — `slug`, `title`, `location`, `period`, `cover_path`, `position`, `published`, `category_id`, `unique(category_id, slug)` | Lot 1 ≈ **50 % déjà fait**. Il s'agit d'une **extension**, pas d'une création |
| 2 | Admin d'édition **à construire** (§5, Lot 2) | **Admin complète livrée** : `/admin` avec auth, CRUD catégories/séries, upload photos, vidéos, textes, apparence, messages | Lot 2 largement **déjà fait** — reste le drag & drop narratif et l'édition des légendes |
| 3 | Routes `/realisations/...` | Routes **`/travaux/...`** | Décision de nommage requise (voir §6) |
| 4 | 3 univers : Nightlife / Mariages / Événements | Données de démo : **portrait, mariage, mode** (+2) | Les catégories réelles sont en base, pas dans le code — à vérifier en prod |
| 5 | « légendes inexistantes en base » | **Exact** — c'est bien le point bloquant confirmé | Lot 1 justifié |

**Conséquence** : le chantier est sensiblement plus court que prévu. Je recommande de
requalifier les lots 1 et 2 en « extension + complément » plutôt qu'en construction.

---

## 2. Arborescence des routes

**Public** (`app/(site)/`) — SSG/ISR, revalidation 1 min :

```
/                                   accueil
/travaux                            index portfolio
/travaux/[categorie]                catégorie
/travaux/[categorie]/[serie]        série  ← deviendra le défilé immersif (Lot 4)
/a-propos
/contact                            + contact/actions.ts (server action)
```

**Admin** (`app/admin/`) — dynamique, protégé : `login`, `(app)/` → dashboard, `categories/[id]`,
`series/[id]`, `contenu`, `apparence`, `messages`, plus `actions.ts`.

**Technique** : `robots.ts`, `sitemap.ts`, `opengraph-image.tsx` (global), `not-found.tsx`.

Build vérifié : **25 routes générées, build vert**.

---

## 3. Schéma Supabase réel

3 migrations : `0001_init.sql`, `0002_covers_hero.sql`, `0003_category_media.sql`.

| Table | Colonnes |
|---|---|
| `categories` | `id` uuid PK · `slug` unique · `title` · `subtitle` · `description` · `location` · `period` · `position` int · `cover_path` *(0002)* · `created_at` |
| `projects` **← les séries** | `id` uuid PK · `category_id` FK cascade · `slug` · `title` · `description` · `location` · `period` · `cover_path` · `position` int · `published` bool=false · `created_at` · `unique(category_id, slug)` |
| `photos` | `id` uuid PK · `project_id` FK **nullable** *(0003)* · `category_id` FK **nullable** *(0003)* · `storage_path` · `alt` · `caption` · `width` · `height` · `position` int · `featured` bool *(0002)* · `featured_position` int *(0002)* · `created_at` · contrainte `photos_one_parent` |
| `videos` | idem photos : `provider` (`youtube`\|`vimeo`) · `video_id` · `title` · `position` |
| `messages` | `name` · `email` · `project_type` · `body` · `read` · `created_at` |
| `site_content` | `key` PK · `value` jsonb |

Index : `projects(category_id)`, `photos(project_id)`, `videos(project_id)`, `projects(published)`.

### Correspondance avec le modèle demandé (§4)

`series` demandé → **`projects` existant**. Déjà présents : `id`, `slug`, `title`, `location`,
`category_id`, `cover_path`, `sort_order` (= `position`), `published`.
**Manquants** : `shot_at` date, `intro` text. *(`period` text joue partiellement le rôle de `shot_at`.)*

`photos` — déjà présents : `series_id` (= `project_id`), `sort_order` (= `position`), `alt`.
**Manquants** : **`subject`**, **`location`**, **`orientation`**, **`blur_data_url`**.

> **Les 4 colonnes manquantes de `photos` sont le vrai cœur du Lot 1.** `subject` + `location`
> conditionnent tout le système de légendes, donc les lots 3 à 6.

### RLS

Activée sur les 6 tables. Lecture publique conditionnée à `published` pour `projects`/`photos`/`videos` ;
lecture publique inconditionnelle pour `categories` et `site_content` ; insertion anonyme sur `messages`
(formulaire) ; écriture réservée à `authenticated`. **Conforme à ce que demande le §4** — rien à refaire.

---

## 4. Pipeline images

- **Bucket `portfolio`, public** (`public: true`), politique `select` ouverte, écriture `authenticated`.
- `publicImageUrl()` construit `/storage/v1/object/public/portfolio/<clé>` ; accepte aussi une URL
  absolue (données de démo Unsplash).
- Rendu via **`next/image`** → passage par **`/_next/image`** (`next.config.ts` autorise Unsplash,
  picsum, ytimg, et l'hôte Supabase). **Pas de CDN d'images dédié.**

### Risques confirmés pour le Lot 4

1. **Aucun `priority` dans tout le codebase.** Le LCP n'est aujourd'hui optimisé nulle part —
   c'est déjà un problème avant même de passer au plein écran.
2. **Aucun `blurDataURL`** → risque de CLS et d'écrans vides au chargement.
3. **Quota `/_next/image` sur Vercel** : le brief a raison de s'en inquiéter. Une page série de
   20 visuels 2000–2500 px en plein écran, multipliée par les variantes de `sizes`, consomme très
   vite le quota d'optimisations du plan.

> **Recommandation (à valider avant toute action, cf. §12 du brief)** : générer les variantes
> **à l'upload** avec `sharp` (plusieurs largeurs stockées dans le bucket, servies directement
> par le CDN Supabase), et sortir les photos de série de `/_next/image`. Je ne toucherai pas au
> pipeline sans ton accord explicite.

---

## 5. Génération des `alt`

Il n'existe **pas** de génération centralisée. Trois cas coexistants :

- `photos.alt` en base, **nullable** et le plus souvent vide ;
- **repli sur un titre** : `alt={s.title}`, `alt={cat.title}`, `alt={it.title}` ;
- **repli sur une chaîne construite** : `components/HeroCards.tsx:112` → `` alt={`Aperçu — ${label}`} `` ;
- `components/MediaGallery.tsx:113` → `alt={cap}`, où `cap` est la légende, pas une description.

**Conclusion a11y** : aucun `alt` n'est réellement descriptif aujourd'hui. Le champ existe déjà en
base — il manque l'interface pour le remplir (Lot 2) et le rendu qui le consomme.

---

## 6. Points bloquants — décisions requises

| # | Sujet | Question |
|---|---|---|
| 1 | **Routes** | `/travaux` (existant, indexé, **en production**) vs `/realisations` (brief). Un renommage impose des **redirections 301** et une reprise du sitemap. **Ma recommandation : garder `/travaux`** — le gain SEO d'un renommage est nul, le risque réel. |
| 2 | **Nommage `projects` → `series`** | Renommer la table serait **interdit par le §12** (« ne pas renommer une colonne existante »). **Ma recommandation : garder `projects` en base**, exposer `Series` côté types/UI. |
| 3 | **Pipeline images** | Variantes à l'upload (sharp + bucket) ou statu quo `/_next/image` ? Impact quota/coût à trancher avant le Lot 4. |
| 4 | **Baseline CWV** | **Non mesurable depuis ce conteneur** : pas d'URL de production connue, pas de `.env.local` (le site retombe sur les données de démo), et une mesure locale ne reflète pas la 4G réelle. → **fournir l'URL de prod** pour une mesure PageSpeed Insights, sinon le critère « LCP < 2,5 s » du Lot 4 sera invérifiable. |

---

## 7. Tokens extraits de la maquette

Valeurs **réelles** relevées dans `legacy/refonte/JKStudio Refonte.dc.html` (section 00).

| Token | Sombre (défaut) | Clair |
|---|---|---|
| `--jk-bg` | `#0E0C0A` | `#F2ECE2` |
| `--jk-surface` | `#141210` | `#E7DFD2` |
| `--jk-ink` | `#EFE9E1` | `#171310` |
| `--jk-ink-mute` | `#9A938A` | `#6B6259` |
| `--jk-brass` | `#B8925A` | `#8A6634` (« laiton AA ») |
| `--jk-rule` | `rgba(239,233,225,.14)` | `rgba(23,19,16,.16)` |
| *(tertiaire)* | `#6E655B` | — |

**Typographie** — `Instrument Serif` (titres, légendes, corps court ; italique utilisée) ·
`IBM Plex Sans` 300/400/500 (nav, labels, numérotation, métadonnées).

**Échelle** : Display 88 (`lh .92`, `ls -.02em`) · Série 52 (`lh 1`) · Corps 21 (`lh 1.6`) ·
Label 10 (`ls .26em`, capitales). Autres tailles relevées : 104, 64, 60, 56, 40, 38, 34, 30, 26, 17.

**Tracking** : `--jk-track-label` `.26em` · `--jk-track-place` `.22em`.

**Motion** : `--jk-ease` `cubic-bezier(.16,1,.3,1)` · `--jk-dur-caption` `600ms` ·
légende fondu + 10 px 600 ms · vignette zoom `1.04` 900 ms · défilé `scroll-snap: proximity` en `100dvh` ·
nav `backdrop-filter: blur(14px)` après 40 px · **tout neutralisé sous `prefers-reduced-motion`**.

**Système de légende** (sujet serif italique — cadratin laiton — lieu capitales espacées) :

| Variante | Sujet | Tiret | Lieu |
|---|---|---|---|
| `thumbnail` | 17 px | 14 px | 9 px / `.22em` |
| `fullscreen` | 26 px | 20 px | 10 px / `.24em` |
| `hero` | 40 px | 28 px | 11 px / `.26em` |

**Props exposées par la maquette** : `theme` (`sombre`\|`clair`), `accent` (couleur),
**`showProof` (booléen)** — correspond exactement au « flag de configuration » du bandeau de
preuve sociale demandé au §8. Logos figurant dans la maquette : Deloitte, Fuse, Bozar, Kanal, C12
(**autorisations à confirmer**, cf. §13 du brief).

---

## 8. État de santé actuel

- `npm run build` : **vert**, 25 routes générées.
- `npm run lint` : **7 erreurs, 9 avertissements**. 5 erreurs en code applicatif
  (4 × `react-hooks/set-state-in-effect`, 1 × `react/no-unescaped-entities`) ; 2 dans `legacy/`,
  qui **ne devrait pas être linté** (dump de maquette, pas du code applicatif).
- Le site fonctionne **sans Supabase** (repli sur `lib/demo-data.ts`).

---

## 9. Plan révisé proposé

| Lot | Statut réel | Reste à faire |
|---|---|---|
| **1** — Modèle | ~50 % fait | Migration `0004` : `+subject`, `+location`, `+orientation`, `+blur_data_url` sur `photos` ; `+shot_at`, `+intro` sur `projects`. Backfill sharp. **Tout nullable, aucune suppression.** |
| **2** — Admin | ~70 % fait | Édition inline `subject`/`location`/`alt` · **drag & drop narratif** · indicateur légendes manquantes |
| **3** — Tokens | à faire | Tokens ci-dessus + `next/font` (Instrument Serif / IBM Plex Sans, self-hosted) + `<Caption>` |
| **4** — Série immersive | à faire | ~50 % de l'effort. Sous-étapes : structure → snap → légendes animées → images |
| **5–7** | à faire | Accueil, index, Tirages, SEO/a11y/mesure |

---

## 10. Questions ouvertes (§13 du brief)

1. **Accès Supabase** — absents du repo (pas de `.env.local`). Nécessaires pour le backfill et pour vérifier les catégories réelles.
2. **Logos clients autorisés** — la maquette montre Deloitte, Fuse, Bozar, Kanal, C12. Lesquels sont contractuellement utilisables ?
3. **Langues du studio** — la maquette indique **FR / EN / NL**. À confirmer.
4. **Formats Tirages/Albums** — la maquette propose : Album fine art 30 × 30 / 40 p · Livre de série 21 × 28 / 24 p · Tirage encadré 40 × 50 chêne clair. À confirmer.
5. **URL de production** — indispensable pour la baseline CWV (cf. §6.4).
6. **Politique de branches** — le brief demande « une branche par lot » ; cette session est contrainte sur `claude/jkstudio-site-impl-zpyz6z`. À arbitrer.

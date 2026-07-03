# JKStudio — Site

Site vitrine d'un studio photo &amp; vidéo bruxellois. Single-page, entièrement
animé (curseur custom, parallaxe 3D, révélations au scroll, transitions plein
écran, lightbox, thème clair/sombre), en français.

Implémentation du design **`JKStudio Site.dc.html`** (Claude Design).

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Le site déployable (point d'entrée web). |
| `JKStudio Site.dc.html` | Le composant de design source (artefact Claude Design, identique au contenu de `index.html`, conservé pour re-synchronisation). |
| `support.js` | Le *runtime* Design Component : charge React/ReactDOM (CDN), compile le template `<x-dc>` et exécute la classe de logique `Component extends DCLogic`. |

`index.html` est un document HTML autonome : il charge `./support.js`, qui
amorce le composant racine défini dans le bloc `<x-dc>` et rend la page avec
React.

## Lancer en local

Servez le dossier via HTTP (le runtime fait des `fetch`, donc `file://` ne
suffit pas) :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/
```

N'importe quel serveur statique convient (`npx serve`, `php -S`, etc.).

## Déploiement

Site 100 % statique — déposez `index.html` et `support.js` (racine) sur
n'importe quel hébergeur statique (GitHub Pages, Netlify, Vercel, Cloudflare
Pages…). Aucune étape de build.

### Dépendances externes (CDN / réseau)

Le runtime et le design chargent, à l'exécution, depuis des CDN :

- React &amp; ReactDOM 18.3.1 (`unpkg.com`)
- Babel standalone (uniquement si un module JSX est importé — non utilisé ici)
- Google Fonts : Instrument Serif, Archivo, Space Mono
- Photos de démonstration : `images.unsplash.com` (repli automatique vers
  `picsum.photos` si une image échoue)
- Vidéos de démonstration : bucket public Google (`ForBigger*.mp4`, etc.)

Une connexion sortante est donc requise au chargement.

## Personnalisation

Le composant expose des props d'apparence (via `data-props` dans
`index.html`) : `theme` (`sombre`/`clair`), `accent` (couleur), `grain`
(bool), `glow` (0–2). Le contenu (catégories, photos, vidéos) est défini dans
le tableau `CATS` de la classe `Component`, dans `index.html`.

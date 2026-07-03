# Mise en ligne — guide complet (de A à Z)

Ce guide te mène de l'état actuel (code prêt, base Supabase vide) jusqu'à un
**site en ligne, sécurisé et rempli avec ton contenu**. Suis les étapes dans
l'ordre. Compte ~45 min la première fois.

Légende : 🟢 = obligatoire · 🔵 = recommandé · ⚪ = optionnel.

---

## Où on en est

- ✅ Le code est développé, testé et poussé sur GitHub
  (`alapaque/jk-studio`, branche `claude/jkstudio-site-impl-5472b1`).
- ✅ Ton projet Supabase existe, le schéma est en place, la base est **vide**.
- ⬜ Il reste : sécuriser les clés → déployer sur Vercel → créer ton compte admin
  → remplir le site.

---

## Étape 1 — 🟢 Sécuriser les clés Supabase

Pendant les tests, des clés ont transité par le chat. On les régénère avant la prod.

1. Va sur **supabase.com** → ton projet.
2. **Project Settings** (roue dentée, en bas à gauche) → **API**.
3. Section **Project API keys** → à côté de `service_role`, clique **Reset** (ou
   **Roll**), confirme. Fais de même pour `anon` si l'option est proposée.
4. **Garde cette page ouverte** : tu vas recopier les nouvelles valeurs à
   l'étape 4 (URL, `anon`, `service_role`).

> Tant que tu n'as pas remis les nouvelles clés dans Vercel (étape 4), le site
> déployé ne pourra pas lire la base — c'est normal, on le fait juste après.

---

## Étape 2 — 🔵 Préparer la branche à déployer

Vercel déploie en général la branche **`main`**. Deux options :

**Option simple (recommandée)** — fusionner le travail dans `main` :
- Sur GitHub : ouvre le dépôt → onglet **Pull requests** → **New pull request**
  → base `main`, compare `claude/jkstudio-site-impl-5472b1` → **Create** →
  **Merge**.
- (Ou demande-moi d'ouvrir la pull request, je peux le faire.)

**Option sans fusion** — déployer directement la branche :
- Tu pourras, dans Vercel (étape 3), choisir cette branche comme *Production
  Branch* (**Settings → Git → Production Branch**).

---

## Étape 3 — 🟢 Créer le projet sur Vercel

1. Va sur **vercel.com** → **Sign Up** / **Log in** (connecte-toi **avec GitHub**,
   c'est le plus simple).
2. Tableau de bord → **Add New…** → **Project**.
3. **Import Git Repository** → autorise Vercel à accéder à GitHub si demandé →
   choisis **`alapaque/jk-studio`** → **Import**.
4. Écran de configuration :
   - **Framework Preset** : `Next.js` (détecté automatiquement — ne change rien).
   - **Build Command**, **Output Directory**, **Install Command** : laisse par défaut.
   - **Root Directory** : laisse `.` (racine).
5. **Ne clique pas encore sur Deploy** — d'abord les variables (étape 4).

---

## Étape 4 — 🟢 Variables d'environnement

Toujours sur l'écran d'import (ou plus tard dans **Settings → Environment
Variables**), déplie **Environment Variables** et ajoute une à une :

| Name (nom exact) | Value (valeur) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | l'URL du projet (ex. `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la clé **anon** (nouvelle) |
| `SUPABASE_SERVICE_ROLE_KEY` | la clé **service_role** (nouvelle, secrète) |
| `RESEND_API_KEY` | ⚪ ta clé Resend (voir étape 7), sinon laisse vide |
| `CONTACT_EMAIL_TO` | ⚪ email où recevoir les messages (ex. `amaury@radyo.be`) |
| `CONTACT_EMAIL_FROM` | ⚪ `onboarding@resend.dev` (par défaut) |
| `NEXT_PUBLIC_SITE_URL` | 🔵 l'URL finale du site (ex. `https://jkstudio.be`) — pour le SEO / le partage |

- Pour chaque variable : **Name**, **Value**, laisse les 3 environnements cochés
  (Production / Preview / Development) → **Add**.
- ⚠️ Ne mets **jamais** la `service_role` dans une variable commençant par
  `NEXT_PUBLIC_` : elle doit rester côté serveur.

---

## Étape 5 — 🟢 Premier déploiement

1. Clique **Deploy**. Le build prend 1–3 min.
2. À la fin, Vercel affiche une URL du type `https://jk-studio-xxxx.vercel.app`.
   Ouvre-la : le site s'affiche (vide pour l'instant, c'est normal).
3. Teste `TON-URL/admin` → tu dois voir l'écran de **connexion** de l'admin.

> Si le site affiche une erreur : **Settings → Environment Variables** →
> vérifie les 3 clés Supabase → onglet **Deployments** → **Redeploy**.

---

## Étape 6 — 🟢 Créer ton compte administrateur

C'est le compte qui te connectera à `/admin`.

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. **Email** : le tien · **Password** : un mot de passe fort.
3. Coche **Auto Confirm User** → **Create user**.
4. 🔵 Empêcher toute inscription publique : **Authentication → Providers →
   Email** → décoche **Enable Sign Ups** → **Save**. (Tu crées les comptes à la
   main ; la connexion reste possible.)
5. Va sur `TON-URL/admin/login`, connecte-toi. Tu arrives sur le tableau de bord. 🎉

---

## Étape 7 — ⚪ Emails du formulaire de contact (Resend)

Sans ça, les messages sont quand même **enregistrés** et visibles dans
`/admin/messages`. Resend ajoute une **notification par email**.

1. Crée un compte sur **resend.com**.
2. **API Keys** → **Create API Key** → copie la clé (`re_...`).
3. Dans Vercel → **Settings → Environment Variables** :
   - `RESEND_API_KEY` = ta clé
   - `CONTACT_EMAIL_TO` = ton email de réception
   - `CONTACT_EMAIL_FROM` = `onboarding@resend.dev` pour commencer.
4. 🔵 Pour un expéditeur pro (`contact@ton-domaine`) : Resend → **Domains** →
   **Add Domain** → ajoute les enregistrements DNS indiqués → une fois vérifié,
   mets `CONTACT_EMAIL_FROM=contact@ton-domaine`.
5. **Redeploy** pour appliquer.

---

## Étape 8 — ⚪ Nom de domaine personnalisé

1. Vercel → ton projet → **Settings → Domains** → **Add** → saisis ton domaine
   (ex. `jkstudio.be`).
2. Suis les instructions DNS de Vercel chez ton registrar (A / CNAME).
3. 🔵 Renseigne l'URL finale pour le SEO / le partage : Vercel → **Settings →
   Environment Variables** → `NEXT_PUBLIC_SITE_URL` = `https://ton-domaine` →
   **Redeploy**. (Le sitemap, le `robots.txt` et l'image de partage l'utilisent
   automatiquement — aucun code à modifier.)

---

## Étape 9 — 🟢 Remplir le site (depuis `/admin`)

Ordre conseillé. Tout se fait dans `TON-URL/admin` (guide détaillé :
[`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md)).

1. **Catégories** → crée tes familles (ex. Portrait, Mariage, Mode, Gaming,
   Vidéo). Titre + description + lieu + période. Réordonne avec ↑/↓.
2. **Séries** → crée une série dans une catégorie (titre, lieu, période).
   Laisse **Publié** décoché tant que ce n'est pas prêt.
3. **Ouvrir** la série → **+ Ajouter des photos** (sélection multiple depuis ton
   ordinateur). Pour chacune : légende, texte **alt**, ↑/↓ pour l'ordre,
   **Couv.** pour l'image de couverture.
4. **Vidéos** (dans la série) : colle une URL **YouTube** ou **Vimeo** →
   **Ajouter**. (Mets tes vidéos non répertoriées sur YouTube/Vimeo au préalable.)
5. Quand la série est prête → coche **Publiée** → **Enregistrer**.
6. **Contenu** → personnalise tous les textes (accueil, À propos, contact,
   pied de page). Rappel : listes = une ligne par entrée ; couples = `clé | valeur`.
7. **Apparence** → couleur d'accent, thème par défaut, grain, halo.

> Chaque enregistrement met le site public à jour **en quelques secondes**
> (pas de reconstruction à lancer).

---

## Étape 10 — 🟢 Vérifications finales (checklist prod)

- [ ] Clés Supabase **régénérées** après les tests (étape 1) et à jour dans Vercel.
- [ ] `RLS` actives (créées par la migration) — les brouillons n'apparaissent pas
      côté public.
- [ ] Compte admin créé ; **Enable Sign Ups** décoché.
- [ ] Bucket `portfolio` en lecture publique (créé par la migration).
- [ ] Les 3 variables d'env présentes en **Production** sur Vercel.
- [ ] `metadataBase` = ton domaine final (si domaine perso).
- [ ] Test réel : créer une série + photo + vidéo, la publier, la voir en ligne ;
      envoyer un message via `/contact` et le retrouver dans `/admin/messages`.
- [ ] Aucune vidéo lourde dans Supabase Storage (uniquement des embeds).

---

## Coûts & quotas (tiers gratuits)

- **Vercel Hobby** : gratuit, largement suffisant pour un portfolio.
- **Supabase Free** : ~500 Mo de base, 1 Go de stockage images, 5 Go de bande
  passante/mois. Le premier palier payant (~25 $/mois) n'arrive qu'en cas de gros
  trafic — jamais à cause de la vidéo (elle est chez YouTube/Vimeo).
- **Resend Free** : ~3 000 emails/mois (bien assez pour un formulaire de contact).
- 🔵 Revérifie ces chiffres au démarrage (ils évoluent).

---

## Mettre à jour le site plus tard

- **Contenu** (photos, textes, séries…) : uniquement via `/admin`, aucune
  intervention technique.
- **Code** (nouvelle fonctionnalité, correctif) : un push sur la branche de
  production → Vercel redéploie automatiquement.

---

## Dépannage (FAQ)

| Problème | Solution |
|---|---|
| `/admin` renvoie sans cesse au login | Clés Supabase erronées dans Vercel, ou cookies bloqués. Vérifie les variables + redeploy. |
| Le site public reste vide | Les séries sont en **brouillon** → publie-les. |
| Une image uploadée ne s'affiche pas | Bucket `portfolio` doit être **public** (recréé par la migration). |
| « violates row-level security » | Session admin expirée → reconnecte-toi. |
| Email de contact non reçu | `RESEND_API_KEY` absent, ou `CONTACT_EMAIL_FROM` sur un domaine non vérifié. Le message reste visible dans `/admin/messages`. |
| Build Vercel échoue | Onglet **Deployments** → ouvre le log ; le plus souvent une variable d'env manquante. |

---

Besoin d'aide sur une étape précise ? Donne-moi le message d'erreur ou une
capture, je te débloque.

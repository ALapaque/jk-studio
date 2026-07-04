# Guide complet — Configuration de Supabase

Ce guide met en place la base de données, le stockage d'images, l'authentification
de l'admin, puis remplit le site avec des données de démonstration.

Durée : ~15 minutes. Aucune carte bancaire requise (tier gratuit).

---

## 1. Créer le projet Supabase

1. Aller sur https://supabase.com → **Sign in** → **New project**.
2. Choisir une organisation, un **nom** (ex. `jkstudio`), un **mot de passe de
   base de données** (à conserver), une **région** proche (ex. *West EU*).
3. Cliquer **Create new project** et patienter ~2 min.

## 2. Récupérer les clés d'API

Dans le projet : **Project Settings** (roue dentée) → **API**. Notez :

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **Project API keys → anon / public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Project API keys → service_role / secret** → `SUPABASE_SERVICE_ROLE_KEY`
  ⚠️ **Secrète** : jamais dans le navigateur ni dans un dépôt public.

## 3. Créer le schéma (tables, RLS, stockage)

1. Dans Supabase : menu **SQL Editor** → **New query**.
2. Exécute les fichiers de `supabase/migrations/` **dans l'ordre** (un par requête, **Run** à chaque fois) :
   - [`0001_init.sql`](../supabase/migrations/0001_init.sql) — tables, RLS, stockage.
   - [`0002_covers_hero.sql`](../supabase/migrations/0002_covers_hero.sql) — couvertures uploadables + photos « à la une ».
   - [`0003_category_media.sql`](../supabase/migrations/0003_category_media.sql) — photos/vidéos rattachées directement à une catégorie (sans passer par une série).

Cela crée les tables (`categories`, `projects`, `photos`, `videos`, `messages`,
`site_content`), active les **politiques RLS** (lecture publique du contenu
publié, écriture réservée aux personnes connectées, insertion anonyme des
messages) et crée le bucket de stockage **`portfolio`** (lecture publique).

> Le script est **idempotent** : on peut le relancer sans risque.

## 4. Créer le compte photographe (admin)

Menu **Authentication** → **Users** → **Add user** → **Create new user** :

- Email : celui du photographe.
- Password : un mot de passe fort.
- Cocher **Auto Confirm User** (sinon l'email doit être confirmé).

C'est le seul compte qui pourra accéder à `/admin`.

> Astuce : pour désactiver toute inscription publique, **Authentication →
> Providers → Email** → décocher *Enable Sign Ups* (on ne crée les comptes qu'à
> la main). La connexion par **lien magique** reste possible pour ce compte.

## 5. Variables d'environnement locales

À la racine du projet, copier `.env.example` en **`.env.local`** et remplir :

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...            # voir docs/DEPLOY_VERCEL.md (facultatif en local)
CONTACT_EMAIL_TO=hello@jkstudio.be
CONTACT_EMAIL_FROM=onboarding@resend.dev
```

`.env.local` est ignoré par git — il ne sera jamais commité.

## 6. Remplir le site avec les données de démo (optionnel)

Pour partir d'un site déjà peuplé (les images pointent vers Unsplash, à
remplacer ensuite par les vraies via l'admin) :

```bash
npm run seed
```

Le script crée les 5 catégories, leurs séries, photos et vidéos de démonstration.
Ré-exécutable sans créer de doublon.

> Sans cette étape, le site démarre vide : tout se crée depuis l'admin.

## 7. Lancer et se connecter

```bash
npm run dev
```

- Site public : http://localhost:3000
- Admin : http://localhost:3000/admin → connexion avec le compte de l'étape 4.

La suite (utilisation de l'admin) : [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md).
Le déploiement en production : [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md).

---

## Dépannage

| Symptôme | Cause probable / correctif |
|---|---|
| `/admin` renvoie vers `/login` en boucle | Cookies bloqués, ou clé anon incorrecte. Vérifier `.env.local`. |
| Le site public reste vide malgré des séries | Les séries sont en **brouillon** → les publier dans l'admin. |
| Les images uploadées ne s'affichent pas | Le bucket `portfolio` doit être **public** (recréé par la migration). |
| « new row violates row-level security » | Écriture tentée sans session valide — se reconnecter à l'admin. |
| Email de contact non reçu | `RESEND_API_KEY` absent, ou `CONTACT_EMAIL_FROM` sur un domaine non vérifié. |

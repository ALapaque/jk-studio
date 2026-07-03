# Déploiement sur Vercel

Le site est une app Next.js standard : Vercel la déploie nativement (rendu
serveur, ISR, optimiseur d'images). Aucune configuration de build particulière.

## 1. Prérequis

- Le dépôt poussé sur GitHub.
- Un projet Supabase opérationnel ([`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)).
- (Facultatif) Un compte [Resend](https://resend.com) pour les emails de contact.

## 2. Importer le projet

1. https://vercel.com → **Add New… → Project** → importer le dépôt GitHub.
2. Framework détecté : **Next.js**. Laisser les réglages par défaut
   (build `next build`, pas d'override).

## 3. Variables d'environnement

Dans **Settings → Environment Variables**, ajouter (pour *Production* et
*Preview*) :

| Nom | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé anon |
| `SUPABASE_SERVICE_ROLE_KEY` | clé service_role (secrète) |
| `RESEND_API_KEY` | clé Resend (si emails) |
| `CONTACT_EMAIL_TO` | destinataire des messages |
| `CONTACT_EMAIL_FROM` | expéditeur (domaine vérifié Resend, sinon `onboarding@resend.dev`) |

Puis **Deploy**.

## 4. Emails (Resend)

1. https://resend.com → **API Keys** → créer une clé → `RESEND_API_KEY`.
2. Pour un expéditeur pro (`hello@votredomaine`), vérifier le domaine dans
   Resend (**Domains**) et régler `CONTACT_EMAIL_FROM` en conséquence.
   Sans domaine vérifié, garder `onboarding@resend.dev` (fonctionne pour tester).

## 5. Domaine personnalisé

**Settings → Domains** → ajouter le domaine et suivre les instructions DNS.
Mettre à jour `metadataBase` dans `app/layout.tsx` avec l'URL finale (pour les
balises Open Graph / SEO).

## 6. Images

L'optimiseur `next/image` de Vercel fonctionne nativement. Les hôtes autorisés
sont déjà déclarés dans `next.config.ts` (`images.remotePatterns`) : Unsplash
(démo), picsum (repli) et l'hôte Supabase (déduit de `NEXT_PUBLIC_SUPABASE_URL`).

## 7. Fraîcheur du contenu

Les pages publiques sont en **ISR** (revalidation 60 s) et les modifications de
l'admin déclenchent une **revalidation à la demande** → le contenu se met à jour
sans reconstruire le site.

## Checklist de mise en production

- [ ] Migration SQL exécutée, **RLS actives** sur toutes les tables.
- [ ] Compte admin créé ; inscription publique désactivée.
- [ ] Variables d'environnement définies sur Vercel (Production + Preview).
- [ ] Bucket `portfolio` en lecture publique.
- [ ] Aucune vidéo dans le stockage (uniquement des embeds YouTube/Vimeo).
- [ ] `metadataBase` = domaine de production.
- [ ] Test : connexion admin, création d'une série, upload d'une photo, envoi
      d'un message de contact, apparition sur le site public.
- [ ] Quotas des tiers gratuits vérifiés (Supabase, Resend, Vimeo).

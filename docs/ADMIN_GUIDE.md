# Guide de l'administration

L'admin est accessible sur **`/admin`** (connexion requise). Tout le contenu du
site s'y gère, sans toucher au code. Les modifications apparaissent sur le site
public en quelques secondes (revalidation automatique).

## Se connecter

`/admin` → email + mot de passe du compte photographe (ou **lien magique**
envoyé par email). Bouton **Déconnexion** en bas de la barre latérale.

## Organisation du contenu

```
Catégorie  (Portrait, Mariage, …)
  └─ Série / projet  (Salomé & Jan, Nora — série soie, …)
       ├─ Photos  (uploadées dans le stockage)
       └─ Vidéos  (liens YouTube / Vimeo)
```

## Catégories

**Catégories** dans le menu : créer, modifier, réordonner (↑/↓), supprimer.
Champs : titre, slug (URL, généré automatiquement si vide), sous-titre,
description, lieu, période. Supprimer une catégorie supprime aussi ses séries.

## Séries

**Séries** : créer une série en choisissant sa catégorie ; définir titre,
description, lieu, période, et **Publié** (une série en *brouillon* n'apparaît
pas sur le site). Réordonner avec ↑/↓. **Ouvrir** une série pour gérer ses médias.

### Photos

Dans une série → **+ Ajouter des photos** : sélection multiple, envoi direct
dans le stockage (les dimensions sont détectées automatiquement pour le bon
cadrage). Pour chaque photo : légende, texte alternatif (**alt**, important pour
le référencement et l'accessibilité), réordonnancement, **Couv.** (définit
l'image de couverture de la série), suppression.

### Vidéos

Coller une **URL YouTube ou Vimeo** → le fournisseur et l'identifiant sont
extraits automatiquement. Ajouter un titre facultatif. Les vidéos apparaissent
dans la galerie de la série avec un bouton lecture ; jamais de fichier vidéo
stocké (l'hébergement reste chez YouTube/Vimeo).

## Contenu éditorial

**Contenu** : tous les textes du site (accueil, « Le studio », À propos, Contact,
pied de page). Conventions :
- listes → **une entrée par ligne** ;
- tableaux clé/valeur → **`clé | valeur`** par ligne.

## Apparence

**Apparence** : couleur d'accent, thème par défaut (sombre/clair), grain
filmique, intensité du halo. S'applique à tout le site public.

## Messages

**Messages** : boîte de réception du formulaire de contact. Marquer lu / non lu,
répondre (clic sur l'email), supprimer. Une notification email est aussi envoyée
si Resend est configuré.

## Publication

Aucune action manuelle : dès qu'on enregistre, le site public se met à jour tout
seul. Pour retirer temporairement une série, la repasser en **brouillon**.

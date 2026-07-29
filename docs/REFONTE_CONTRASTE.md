# Refonte — contrôle de contraste AA

> Livrable du Lot 3 (§6 du brief : « Vérifie le contraste AA sur les deux thèmes
> et signale-moi toute paire qui ne passe pas plutôt que d'ajuster la couleur
> toi-même »).

Ratios calculés selon WCAG 2.1 sur les valeurs réelles de
`legacy/refonte/JKStudio Refonte.dc.html`. **Aucune couleur n'a été modifiée** —
les décisions ci-dessous t'appartiennent.

Seuil retenu : **4.5:1** (AA, texte normal). Les labels en capitales de 9-11 px
ne relèvent pas du « grand texte » au sens WCAG (qui exige ≥ 18,66 px gras ou
≥ 24 px), donc le seuil de 3:1 ne s'applique pas à eux.

## Résultats

| Thème | Paire | Ratio | Verdict |
|---|---|---:|---|
| sombre | `ink` / `bg` | 16.19 | ✅ |
| sombre | `ink` / `surface` | 15.50 | ✅ |
| sombre | `ink-mute` / `bg` | 6.43 | ✅ |
| sombre | `ink-mute` / `surface` | 6.15 | ✅ |
| sombre | `brass` / `bg` | 6.78 | ✅ |
| sombre | `brass` / `surface` | 6.49 | ✅ |
| sombre | **tertiaire `#6E655B` / `bg`** | **3.42** | ❌ |
| clair | `ink` / `bg` | 15.72 | ✅ |
| clair | `ink` / `surface` | 13.97 | ✅ |
| clair | `ink-mute` / `bg` | 5.08 | ✅ |
| clair | `ink-mute` / `surface` | 4.52 | ✅ |
| clair | **`brass` / `bg`** | **4.43** | ❌ |
| clair | **`brass` / `surface`** | **3.94** | ❌ |

Le thème sombre passe partout, sauf le tertiaire.

## Les trois paires à trancher

### 1. Tertiaire `#6E655B` sur fond sombre — 3.42:1

Très présent dans la maquette : libellés « Display / 88 », « Portrait — marges
généreuses », compteurs de série, mentions secondaires.

En attendant ta décision, il est exposé sous le nom `--jk-ink-faint` et
**réservé au décoratif non essentiel**. Toute information que le visiteur doit
pouvoir lire utilise `--jk-ink-mute` (6.43:1, conforme).

Options : l'éclaircir vers ~`#8A8177` (≈ 4.5:1), ou l'assumer en garantissant
qu'il ne porte jamais d'information utile.

### 2 et 3. Laiton clair `#8A6634` — 4.43:1 et 3.94:1

**La maquette étiquette elle-même ce ton « laiton AA »** (écran 00), mais il ne
l'est pas tout à fait : il manque 0.07 sur le fond, et il échoue plus nettement
sur `surface`. C'est vraisemblablement une erreur d'appréciation de la maquette
plutôt qu'un choix délibéré.

L'écart est faible et se corrige d'un cheveu : **`#7F5E2F`** donne ≈ 4.9:1 sur
`bg` et ≈ 4.5:1 sur `surface`, pour une teinte visuellement indistinguable.

C'est mon avis, pas une modification : le laiton est la couleur d'accent de la
marque, et la choisir n'est pas mon rôle.

## Portée

Le laiton sert d'accent (tirets de légende, filets, numérotation, états actifs).
S'il porte uniquement du décor, l'échec est théorique ; dès qu'il porte du texte
lisible — et c'est le cas des numéros de série et des libellés de catégorie dans
la maquette — l'échec est réel en thème clair.

Le thème clair n'est pas un mode secondaire : le §12 interdit de livrer une page
qui ne fonctionne qu'en sombre. Ces deux paires méritent donc une décision avant
le Lot 5.

## Reproduire

Le calcul est scripté et rejouable — les ratios ci-dessus en sont la sortie
directe, pas une estimation. Voir l'historique de la PR du Lot 3 pour le script.

# Upload de médias par le client — conception

**Date :** 2026-06-14
**Statut :** validé (en attente de relecture utilisateur)

## Problème

Le client veut un moyen d'uploader ses propres médias et de les utiliser sur le
site, sans toucher au code. Deux besoins distincts ressortis du cadrage :

1. **Bibliothèque libre d'assets** — déposer des fichiers en vrac, sans créer de
   fiche, et les retrouver pour les réutiliser.
2. **Rendre éditables des visuels aujourd'hui figés dans le code** — en
   particulier la vidéo du hero et l'image de partage social (OG), pilotées
   depuis le CMS / la bibliothèque.

Le site dispose déjà d'un CMS Git-based (Sveltia, `/admin/`) qui gère l'upload
d'images (collection `media`, `blog`) et d'audio (`music`). Le manque porte donc
sur (1) la mise à disposition de la bibliothèque globale et (2) les visuels
globaux non éditables.

## Approche retenue

**Collection « Réglages · Apparence » (singleton).** Un fichier unique
`src/content/settings/site.json`, exposé dans le CMS comme une entrée à fichier
unique (pas de création/suppression). Les composants Astro lisent ces valeurs au
build au lieu des URL codées en dur. Suit le pattern JSON déjà en place
(`services`, `team`, `testimonials`).

Approches écartées :
- **Champs dispersés dans les collections existantes** — le hero n'est pas une
  collection (i18n + code en dur) ; il faudrait quand même une pseudo-collection.
- **Bibliothèque seule, URL collée par un dev** — ne répond pas au besoin
  « emplacements éditables par le client ».

## Périmètre

### Volet 1 — Bibliothèque d'assets (aucun code)

Sveltia expose déjà une bibliothèque d'assets globale câblée sur
`media_folder: public/media` / `public_folder: /media` (config existante). Le
client y dépose et retrouve des fichiers sans créer de fiche, et les champs image
existants (`media.src`, `blog.body`…) peuvent piocher dedans.

Action : **vérifier le fonctionnement** une fois l'auth GitHub/Netlify finalisée
et **documenter** l'usage dans `docs/cms-setup.md`. Pas de changement de code.

### Volet 2 — Collection `settings` (visuels globaux)

Nouveau fichier `src/content/settings/site.json` avec, au départ :

| Champ        | Type          | Rôle |
|--------------|---------------|------|
| `heroVideo`  | string (URL ou chemin uploadé) | Boucle vidéo du hero |
| `ogImage`    | string (URL ou chemin uploadé) | Image de partage social par défaut |

- Champ vidéo hero : upload **ou** URL collée (`widget: file`, `choose_url: true`)
  — souple, et évite d'alourdir Git pour les grosses vidéos.
- Champ OG : `widget: image`, `choose_url: true`.
- Extensible : d'autres visuels globaux (logos, fonds) pourront s'ajouter ici
  sans nouvelle migration.

### Volet 3 — Câblage des composants

- **Schéma** : ajouter une collection `settings` dans `src/content.config.ts`.
  Loader `glob` JSON sur `./src/content/settings` (cohérent avec les autres), ou
  `file` loader sur le fichier unique. Champs `heroVideo` et `ogImage`, tous deux
  optionnels avec `.optional()` / `.default('')`.
- **Type** : `SiteSettings` dans `src/data/` (à côté de `services.ts`).
- **`[lang]/index.astro`** : `getEntry('settings', 'site')`, passé en prop à
  `Hero` (`heroVideo`).
- **`Hero.astro`** : remplace l'URL en dur (`Hero.astro:17`) par
  `heroVideo ?? <URL WordPress actuelle>` (fallback).
- **`BaseLayout.astro`** : lit `getEntry('settings', 'site')` directement ;
  `ogImage` par défaut = réglage si présent, sinon `DEFAULT_OG` (`/og-default.jpg`).

### Volet 4 — Config CMS

Ajouter dans `public/admin/config.yml` une collection `settings` :
- `create: false`, `delete: false`, type fichier unique (`files:` avec une entrée
  `site` → `src/content/settings/site.json`).
- Libellé « Réglages · Apparence ».
- Champs `heroVideo` (file, `choose_url: true`) et `ogImage` (image,
  `choose_url: true`), avec `hint` expliquant upload vs URL.

## Garde-fous

- **Tout champ vide retombe sur la valeur codée en dur actuelle.** Le site ne peut
  pas se retrouver sans hero ni image OG, même si le client vide un champ.
- **Migration sans régression** : `site.json` est créé avec les valeurs actuelles
  (URL WordPress du hero, `/og-default.jpg`) → build identique avant toute édition.

## Hors périmètre (YAGNI)

- Favicons éditables (rarement changés).
- Organisation des assets en sous-dossiers (la bibliothèque plate suffit au départ).
- Stockage vidéo externe type Cloudinary (l'option « URL collée » couvre déjà ce cas).

## Validation

- `npx astro check` — types de la nouvelle collection.
- `npm run build` — passe ; inspecter le `<video src>` du hero et la balise
  `og:image` dans le HTML généré (valeurs = valeurs par défaut avant édition).
- Test CMS local : `npx @sveltia/cms-server` + `npm run dev` → `/admin/` →
  éditer « Réglages · Apparence » → vérifier la mise à jour de `site.json`.

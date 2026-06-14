# CMS — Sveltia (git-based)

Éditeur de contenu accessible sur **`/admin/`** une fois le site déployé
(ex. `https://altitudemusic.be/admin/`). Tout est versionné dans Git : chaque
modification = un commit sur `main` → rebuild Netlify automatique.

- Stack : [Sveltia CMS](https://sveltiacms.app) (successeur de Decap/Netlify CMS).
- Backend : **GitHub** via le provider OAuth natif de Netlify (aucun serveur à héberger).
- Fichiers : `public/admin/index.html` (loader) + `public/admin/config.yml` (config).

## Périmètre

| Collection | Dossier | Notes |
|---|---|---|
| Journal | `src/content/blog` | 1 entrée par langue (voir multilingue ci-dessous) |
| Musiques | `src/content/music` | Titres du portfolio, triés par `sortOrder` |
| Médias | `src/content/media` | Images/vidéos de la grille, upload d'images possible |
| Services & tarifs | `src/content/services` | 6 services figés (création/suppression off), prix + textes multilingues |
| Équipe | `src/content/team` | Crédits « À propos », handles Instagram |
| Témoignages | `src/content/testimonials` | Section « Ils ont signé » |

> **Phase 2 livrée** : `services`, `équipe` et `témoignages` ont été migrés de
> `src/data/*.ts` vers des content collections JSON (`src/content/{services,team,testimonials}`).
> Le texte des services (nom/desc/unité/inclus/longue) ne vit plus dans `src/i18n/*.json` —
> tout est dans la collection `services`, multilingue par champ (fr/en/nl).

## Bibliothèque d'assets (upload libre)

Le bouton **« Assets »** (icône média, en haut du CMS) ouvre une bibliothèque où
l'on peut **déposer des fichiers en vrac** (images surtout) sans créer de fiche,
puis les retrouver et les réutiliser dans n'importe quel champ image. Les fichiers
sont stockés dans `public/media/` (`media_folder` global) et servis sous `/media`.

## Réglages · Apparence (visuels globaux)

L'entrée **« Réglages → Apparence »** édite `src/content/settings/site.json` :

| Champ | Effet |
|---|---|
| Vidéo du hero | Boucle vidéo affichée en haut de la page d'accueil. Upload (.mp4/.webm) **ou** URL collée. |
| Image de partage | Aperçu OpenGraph lors d'un partage de lien (réseaux sociaux). |

> Pour une **grosse vidéo**, préférer l'option URL (héberger ailleurs) plutôt que
> l'upload : Git gère mal les fichiers volumineux. **Un champ laissé vide** fait
> retomber le site sur la valeur par défaut codée — pas de risque de hero ou
> d'image manquants.

## Mise en route (à faire une seule fois)

### 1. Créer le compte éditeur

L'éditeur (le studio) a besoin d'un **compte GitHub** ayant accès au repo
`iq0boy/altitude-music`. Le plus simple : un compte GitHub « studio » unique,
invité comme collaborateur (Settings → Collaborators) avec le rôle **Write**.

### 2. Enregistrer l'OAuth App GitHub et la lier à Netlify

Sveltia réutilise le flux OAuth de Netlify — rien à coder.

1. Sur **GitHub** : Settings → Developer settings → **OAuth Apps** → *New OAuth App*
   - Application name : `Altitude Music CMS`
   - Homepage URL : `https://altitudemusic.be`
   - **Authorization callback URL** : `https://api.netlify.com/auth/done`
   - Génère un **Client secret**, note le **Client ID**.
2. Sur **Netlify** : site `altitude-music` → **Site configuration → Access & security
   → OAuth → Install provider** → *GitHub* → colle le Client ID + Client secret.

C'est tout : `config.yml` pointe déjà sur `backend: github` / `repo: iq0boy/altitude-music`.

### 3. Se connecter

Aller sur `/admin/`, cliquer **Sign in with GitHub**, autoriser → l'interface s'ouvre.

## Multilingue (journal)

Le site utilise un fichier par langue : `src/content/blog/<postSlug>.<lang>.md`.
Dans le CMS, **chaque langue est une entrée distincte**. Pour publier un article
en 3 langues :

1. Créer l'entrée FR : `Langue = Français`, `Identifiant commun = movie-2k25`.
2. Créer une 2ᵉ entrée : `Langue = English`, **même** `Identifiant commun = movie-2k25`.
3. Idem pour `Nederlands`.

Le champ « Identifiant commun » (`postSlug`) doit être identique sur les 3 — c'est
lui qui relie les versions entre elles et construit l'URL `/{lang}/blog/movie-2k25/`.

## Tester en local (optionnel)

`config.yml` a `local_backend: true`. Dans deux terminaux :

```bash
npx @sveltia/cms-server   # proxy d'écriture local
npm run dev               # site Astro
```

Puis ouvrir `http://localhost:4321/admin/` — les modifications écrivent
directement dans les fichiers locaux (pas de commit GitHub).

## Notes

- `index.html` charge Sveltia depuis le CDN en `@latest`. Pour figer une version
  (recommandé en prod), remplace `@latest` par un tag précis.
- `/admin/` est exclu de l'indexation (`robots.txt` + `<meta name="robots" noindex>`).
- Les commits du CMS sont préfixés `cms:` (voir `commit_messages` dans `config.yml`).

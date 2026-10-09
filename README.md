# Altitude Music — site web

Le site du studio **Altitude Music** (Louvain-la-Neuve) : [altitudemusic.be](https://altitudemusic.be).

Ce document explique le projet en un coup d'œil : ce que c'est, comment le modifier
(avec ou sans code), et comment les modifications arrivent en ligne.

---

## 1. Le projet en bref

- **Un site vitrine en trois langues** (FR / EN / NL) : services et tarifs, artistes,
  vidéos, équipe, témoignages, journal (blog), prise de rendez-vous, contact.
- **Tout le contenu est dans ce dossier**, sous forme de fichiers texte, et versionné
  avec Git. Il n'y a pas de base de données ni de serveur : le site est « compilé »
  en pages HTML statiques, ce qui le rend rapide, sûr et gratuit à héberger.
- **Trois outils autour du projet** :

| Outil | Rôle | Où |
|---|---|---|
| **GitHub** | Stocke le code et l'historique de toutes les modifications | `github.com/iq0boy/altitude-music` |
| **Netlify** | Reconstruit et met le site en ligne à chaque modification | tableau de bord Netlify |
| **Cal.com** | Prise de rendez-vous synchronisée avec Google Agenda | `cal.com` (compte du studio) |

Règle d'or : **tout ce qui est poussé sur la branche `main` est en ligne quelques
minutes plus tard.**

---

## 2. Modifier le site

Il y a deux façons, selon ce que tu veux faire.

### 2a. Sans code : l'éditeur en ligne (`/admin/`)

Pour le contenu courant (textes des services, prix, articles du journal, titres,
vidéos, équipe, témoignages, vidéo du hero, image de partage, Cal.com) :

1. Ouvrir **https://altitudemusic.be/admin/** et se connecter avec le compte GitHub du studio.
2. Modifier, puis **Enregistrer** : chaque sauvegarde crée automatiquement une
   modification sur GitHub, et Netlify remet le site en ligne dans les 2–3 minutes.

Guide complet (première connexion, articles multilingues, bibliothèque de médias) :
[`docs/cms-setup.md`](./docs/cms-setup.md).

### 2b. Avec Claude Code : pour tout le reste (design, nouvelles pages, fonctionnalités)

[Claude Code](https://claude.com/claude-code) est un assistant qui lit ce projet,
modifie les fichiers, vérifie que le site se construit, et peut publier les
changements. Il connaît la structure du projet grâce au fichier `CLAUDE.md`.

**Installation sur Windows (une seule fois)**

1. Installer **Git pour Windows** : <https://git-scm.com/download/win> (options par défaut).
2. Installer **Node.js 22** (version LTS) : <https://nodejs.org>.
3. Récupérer le projet : ouvrir **PowerShell**, puis

   ```powershell
   cd $HOME\Documents
   git clone git@github.com:iq0boy/altitude-music.git
   cd altitude-music
   npm install
   ```

   (Le clonage demande une clé SSH ou un identifiant GitHub : GitHub Desktop
   <https://desktop.github.com> fait cela sans configuration si tu préfères.)

4. Installer Claude Code, toujours dans PowerShell :

   ```powershell
   irm https://claude.ai/install.ps1 | iex
   ```

   Il faut un compte Claude (abonnement Pro ou Max). Alternative : l'application
   **Claude** pour Windows a un onglet « Code » qui fait la même chose sans terminal.

**Utilisation au quotidien**

```powershell
cd $HOME\Documents\altitude-music
claude
```

Puis écrire en français ce que tu veux, par exemple :

- « Récupère les dernières modifications, puis lance le site en local pour que je le voie. »
- « Ajoute une section “Matériel du studio” sous la section À propos, dans les trois langues. »
- « Change la couleur d'accent en orange. »
- « Le bouton Réserver ne fonctionne pas sur mobile, corrige-le. »
- « Commite et pousse les changements. »

Claude propose, modifie, construit le site pour vérifier, et te montre le résultat
sur `http://localhost:4321`. Rien n'est en ligne tant que tu ne demandes pas de
**pousser** (voir Git ci-dessous).

---

## 3. Git en trois phrases

Git garde l'historique de chaque modification et synchronise ton dossier avec GitHub.

- **Pull** = récupérer sur ton PC ce qui a changé sur GitHub (par exemple les
  modifications faites via `/admin/`). **Toujours commencer par là.**
- **Commit** = enregistrer un lot de modifications avec un message.
- **Push** = envoyer tes commits sur GitHub → Netlify met le site en ligne.

Avec Claude Code tu n'as pas besoin de connaître les commandes : demande
« fais un pull », « commite », « pousse ». Pour mémoire :

```powershell
git pull            # récupérer
git status          # voir ce qui a changé
git add -A
git commit -m "Description du changement"
git push            # publier
```

La branche **`main`** est le site en ligne. Les modifications faites via `/admin/`
arrivent aussi sur `main`, avec un message commençant par `cms:`.

---

## 4. Netlify : la mise en ligne

- Netlify surveille la branche `main` sur GitHub. **Chaque push déclenche une
  reconstruction** (environ 1 à 3 minutes), puis le site est remplacé par la nouvelle version.
- Si quelque chose casse, le site en ligne **ne change pas** : l'ancienne version
  reste servie et le tableau de bord Netlify affiche l'erreur dans *Deploys → journal*.
- Causes fréquentes d'échec : un champ obligatoire vide dans l'éditeur `/admin/`,
  un texte manquant dans une des trois langues. Claude Code reproduit la même
  erreur en local avec `npm run build`, et peut la corriger.
- Le nom de domaine, le certificat HTTPS et l'authentification de `/admin/`
  sont aussi gérés dans Netlify.

### Formulaires (contact et témoignages)

Les deux formulaires du site passent par **Netlify Forms** : chaque envoi est stocké
dans le tableau de bord Netlify (*Forms*) et notifié par email. Gratuit jusqu'à
100 envois par mois. Réglage, une seule fois, dans Netlify :

1. *Site configuration → Forms → **Enable form detection***, puis redéployer.
2. *Forms → Form notifications → Add notification → Email* : `altitudemusic13@gmail.com`,
   pour les formulaires `contact` et `testimonial`.

Un témoignage reçu n'est pas publié automatiquement : le studio le relit, puis
l'ajoute dans `/admin/` → Témoignages.

### Horaires d'ouverture

Les horaires transmis à Google (données structurées) sont lus sur Cal.com à chaque
déploiement : sans réglage, ils sont déduits des créneaux réellement réservables ;
avec une clé API Cal.com (Settings → Developer → API keys) placée dans Netlify
(*Environment variables → `CAL_API_KEY`*), ce sont exactement les horaires du
planning par défaut. Un changement d'horaires sur Cal.com apparaît donc au
prochain déploiement (toute modification dans `/admin/` en déclenche un).

---

## 5. Cal.com : les rendez-vous

Le calendrier du site (accueil et pages services) est branché sur Cal.com. Chaque réservation :

- apparaît dans **Google Agenda** du studio (`altitudemusic13@gmail.com`) et évite
  les créneaux déjà occupés ;
- envoie un **email de confirmation** au client et au studio, avec rappel ;
- est proposée **par service** (durée et description propres à chaque service).

Mise en place, une seule fois : créer le compte Cal.com avec l'adresse Gmail du
studio, connecter Google Agenda, créer un type d'événement par service, puis
reporter le nom d'utilisateur et les identifiants dans `/admin/`.
Pas à pas : [`docs/cms-setup.md`, section « Réservation en ligne »](./docs/cms-setup.md#réservation-en-ligne-calcom--google-agenda).

---

## 6. Où sont les choses

```
src/content/        tout le contenu éditable (aussi via /admin/)
  blog/             articles du journal, un fichier par langue
  services/         les 6 services (nom, prix, textes FR/EN/NL, événement Cal.com)
  music/            titres du portfolio (synchro Spotify automatique chaque lundi)
  media/            vidéos et photos de la grille
  team/             membres de l'équipe
  testimonials/     témoignages
  settings/         vidéo du hero, image de partage, utilisateur Cal.com
src/i18n/           textes de l'interface (menus, titres, boutons) FR/EN/NL
src/components/     les blocs du site (hero, services, réservation…)
src/styles/         global.css : couleurs, polices, mise en page
public/             fichiers servis tels quels (médias, audio, polices, /admin/)
docs/cms-setup.md   guide de l'éditeur en ligne et de Cal.com
CLAUDE.md           notes techniques lues par Claude Code
```

---

## 7. Référence technique (développeurs)

- Astro 6 (site statique), React 19 pour les îlots interactifs, TypeScript.
  Node ≥ 22.12. Détails d'architecture dans [`CLAUDE.md`](./CLAUDE.md).
- Commandes : `npm run dev` (serveur local), `npm run build` (vérification + build),
  `npm run preview`, `npx astro check`, `npm run sync:music` (réimporte la playlist
  Spotify dans `src/content/music/` en conservant BPM/genre/année/couleur édités).
- La synchro Spotify tourne aussi toute seule chaque lundi matin via GitHub Actions
  (`.github/workflows/sync-music.yml`, lancement manuel possible depuis l'onglet
  *Actions*). Elle pousse sur `main` si la playlist a changé, ce qui redéploie le site.
  Pour changer de playlist : `PLAYLIST_ID` dans `scripts/sync-music.mjs`.
- Un changement de schéma de contenu se fait en trois endroits :
  `src/content.config.ts` (validation), `public/admin/config.yml` (formulaire CMS),
  `src/data/services.ts` (types).
- Hébergement Netlify : `netlify.toml` (commande de build, Node 22, en-têtes de cache
  et de sécurité). Aperçus automatiques sur chaque pull request.

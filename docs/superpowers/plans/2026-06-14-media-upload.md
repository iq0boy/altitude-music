# Upload de médias par le client — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendre la vidéo du hero et l'image de partage (OG) éditables par le client depuis le CMS Sveltia, via une collection « Réglages », avec fallback sur les valeurs actuelles (zéro régression). La bibliothèque d'assets est déjà fournie par Sveltia.

**Architecture:** Nouvelle content collection singleton `settings` (`src/content/settings/site.json`). Les composants Astro (`Hero.astro`, `BaseLayout.astro`) lisent ces valeurs au build via `getEntry('settings','site')`, avec repli sur les URL codées en dur si un champ est vide. Une entrée « fichier unique » est exposée dans `public/admin/config.yml`.

**Tech Stack:** Astro v6 content collections (`glob` loader, Zod), Sveltia CMS (YAML config), TypeScript.

**Validation model:** Pas de framework de test dans ce repo. La vérification se fait via `npx astro check`, `npm run build`, et inspection du HTML généré dans `dist/` avec `grep`.

---

## File Structure

- **Create** `src/content/settings/site.json` — singleton de réglages (valeurs initiales = valeurs actuelles).
- **Modify** `src/content.config.ts` — ajout de la collection `settings`.
- **Modify** `src/data/services.ts` — ajout de l'interface `SiteSettings`.
- **Modify** `src/components/Hero.astro` — prop `heroVideo`, fallback.
- **Modify** `src/pages/[lang]/index.astro` — charge `settings`, passe `heroVideo` à `Hero`.
- **Modify** `src/layouts/BaseLayout.astro` — défaut `ogImage` tiré des réglages.
- **Modify** `public/admin/config.yml` — collection « Réglages · Apparence ».
- **Modify** `docs/cms-setup.md` — documenter Réglages + bibliothèque d'assets.

---

## Task 1 : Collection `settings` (schéma + fichier + type)

**Files:**
- Create: `src/content/settings/site.json`
- Modify: `src/content.config.ts`
- Modify: `src/data/services.ts`

- [ ] **Step 1 : Créer le fichier de réglages avec les valeurs actuelles**

Create `src/content/settings/site.json` :

```json
{
  "heroVideo": "https://altitudemusic.be/wp-content/uploads/2025/08/altitude.webm#t=1",
  "ogImage": "/og-default.jpg"
}
```

- [ ] **Step 2 : Déclarer la collection dans le schéma**

In `src/content.config.ts`, after the `testimonials` collection definition (just before `export const collections = {...}`), add :

```ts
const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    heroVideo: z.string().optional(),   // URL ou /media/<fichier> ; vide = défaut codé
    ogImage: z.string().optional(),     // URL ou /<fichier> ; vide = /og-default.jpg
  }),
});
```

Then update the export line to include `settings` :

```ts
export const collections = { blog, music, media, services, team, testimonials, settings };
```

- [ ] **Step 3 : Ajouter l'interface `SiteSettings`**

In `src/data/services.ts`, append at the end of the file :

```ts
export interface SiteSettings {
  heroVideo?: string;
  ogImage?: string;
}
```

- [ ] **Step 4 : Vérifier le typage**

Run: `npx astro check`
Expected: 0 erreur liée à `settings` (la collection est reconnue). Les éventuels warnings préexistants non liés sont ignorés.

- [ ] **Step 5 : Commit**

```bash
git add src/content/settings/site.json src/content.config.ts src/data/services.ts
git commit -m "feat(cms): collection Réglages (settings) pour visuels globaux"
```

---

## Task 2 : Hero lit `heroVideo` (avec fallback)

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/pages/[lang]/index.astro`

- [ ] **Step 1 : Ajouter la prop `heroVideo` et le fallback dans Hero**

In `src/components/Hero.astro`, replace the frontmatter Props block + the `<video>` tag.

Current frontmatter (lines 3-5) :

```astro
interface Props { t: Translations; heroVariant?: 'video' | 'minimal'; }
const { t, heroVariant = 'video' } = Astro.props;
```

Replace with :

```astro
interface Props { t: Translations; heroVariant?: 'video' | 'minimal'; heroVideo?: string; }
const { t, heroVariant = 'video', heroVideo } = Astro.props;
const HERO_VIDEO_FALLBACK = 'https://altitudemusic.be/wp-content/uploads/2025/08/altitude.webm#t=1';
const heroVideoSrc = heroVideo && heroVideo.trim() !== '' ? heroVideo : HERO_VIDEO_FALLBACK;
```

Current `<video>` tag (lines 14-18) :

```astro
    <video
      class="hero-video"
      autoplay loop muted playsinline
      src="https://altitudemusic.be/wp-content/uploads/2025/08/altitude.webm#t=1"
    />
```

Replace the `src` line so the tag becomes :

```astro
    <video
      class="hero-video"
      autoplay loop muted playsinline
      src={heroVideoSrc}
    />
```

- [ ] **Step 2 : Charger les réglages dans index.astro**

In `src/pages/[lang]/index.astro`, change the content import (line 16) from :

```ts
import { getCollection } from 'astro:content';
```

to :

```ts
import { getCollection, getEntry } from 'astro:content';
```

Then, after the `const t = getTranslations(lang);` line (around line 27), add :

```ts
const siteSettings = await getEntry('settings', 'site');
const heroVideo = siteSettings?.data.heroVideo;
```

- [ ] **Step 3 : Passer la prop au composant Hero**

In `src/pages/[lang]/index.astro` (line 96), change :

```astro
    <Hero t={t} heroVariant="video" />
```

to :

```astro
    <Hero t={t} heroVariant="video" heroVideo={heroVideo} />
```

- [ ] **Step 4 : Build et vérifier la source vidéo générée**

Run: `npm run build`
Expected: build réussit.

Run: `grep -o 'class="hero-video"[^>]*' dist/fr/index.html`
Expected: l'attribut `src` contient `altitude.webm` (valeur du `site.json`, identique à avant).

- [ ] **Step 5 : Commit**

```bash
git add src/components/Hero.astro src/pages/\[lang\]/index.astro
git commit -m "feat(hero): vidéo pilotée par les Réglages, fallback sur l'URL actuelle"
```

---

## Task 3 : OG image par défaut tirée des Réglages

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1 : Charger les réglages et calculer le défaut OG**

In `src/layouts/BaseLayout.astro`, change the import (line 3) from :

```ts
import { getCollection } from 'astro:content';
```

to :

```ts
import { getCollection, getEntry } from 'astro:content';
```

Then, just after `const DEFAULT_OG = '/og-default.jpg';`, add :

```ts
const siteSettings = await getEntry('settings', 'site');
const settingsOg = siteSettings?.data.ogImage;
const ogDefault = settingsOg && settingsOg.trim() !== '' ? settingsOg : DEFAULT_OG;
```

- [ ] **Step 2 : Utiliser ce défaut dans la destructuration des props**

In `src/layouts/BaseLayout.astro`, change the props default (the line `ogImage = DEFAULT_OG,` inside the `const { ... } = Astro.props;` block) to :

```ts
  ogImage = ogDefault,
```

(Une page qui passe explicitement `ogImage` garde la priorité ; sinon on prend la valeur des Réglages, puis `/og-default.jpg`.)

- [ ] **Step 3 : Build et vérifier la balise og:image**

Run: `npm run build`
Expected: build réussit.

Run: `grep -o '<meta property="og:image" content="[^"]*"' dist/fr/index.html`
Expected: contenu = `https://altitudemusic.be/og-default.jpg` (valeur du `site.json`, identique à avant).

- [ ] **Step 4 : Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(seo): image OG par défaut éditable via les Réglages"
```

---

## Task 4 : Exposer « Réglages » dans le CMS

**Files:**
- Modify: `public/admin/config.yml`

- [ ] **Step 1 : Ajouter la collection fichier-unique**

In `public/admin/config.yml`, at the end of the `collections:` list (after the `testimonials` collection block), append :

```yaml
  # ───────────────────────── RÉGLAGES · APPARENCE ─────────────────────────
  # Fichier unique src/content/settings/site.json — visuels globaux du site.
  # Champ vide ⇒ le site retombe sur la valeur codée par défaut (aucun risque
  # de hero ou d'image OG manquants).
  - name: settings
    label: Réglages
    files:
      - name: site
        label: Apparence
        file: src/content/settings/site.json
        description: Visuels globaux du site (vidéo du hero, image de partage).
        fields:
          - name: heroVideo
            label: Vidéo du hero
            widget: file
            required: false
            choose_url: true
            media_folder: "/public/media"
            public_folder: "/media"
            hint: "Upload une vidéo (.mp4/.webm) OU colle une URL hébergée ailleurs. Vide = vidéo par défaut. Astuce : pour une grosse vidéo, préfère une URL."
          - name: ogImage
            label: Image de partage (réseaux sociaux)
            widget: image
            required: false
            choose_url: true
            hint: "Aperçu affiché quand on partage un lien du site (1200×630 recommandé). Vide = image par défaut."
```

- [ ] **Step 2 : Vérifier la validité YAML**

Run: `node -e "const y=require('fs').readFileSync('public/admin/config.yml','utf8'); console.log(y.includes('name: settings') ? 'OK settings présent' : 'MANQUANT'); require('child_process')"`
Expected: affiche `OK settings présent`.

(Note : si `js-yaml` n'est pas dispo dans le repo, la vérité de syntaxe se fait en chargeant `/admin/` en local — voir Task 5. Le check ci-dessus confirme juste l'ajout.)

- [ ] **Step 3 : Commit**

```bash
git add public/admin/config.yml
git commit -m "feat(cms): entrée « Réglages · Apparence » (vidéo hero + image OG)"
```

---

## Task 5 : Documentation + vérification CMS locale

**Files:**
- Modify: `docs/cms-setup.md`

- [ ] **Step 1 : Documenter la bibliothèque d'assets et les Réglages**

In `docs/cms-setup.md`, add a new section after the « Périmètre » table (before « Mise en route ») :

```markdown
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
```

- [ ] **Step 2 : Vérifier le CMS en local**

Run (deux terminaux) :

```bash
npx @sveltia/cms-server   # terminal 1
npm run dev               # terminal 2
```

Ouvrir `http://localhost:4321/admin/`, vérifier que **« Réglages »** apparaît dans
la barre latérale, ouvrir **Apparence**, modifier un champ, sauvegarder.
Expected: `src/content/settings/site.json` est mis à jour sur le disque.

(Si l'auth/local backend n'est pas configurable dans l'environnement, sauter ce
step manuel ; la validité de la config est confirmée au prochain build.)

- [ ] **Step 3 : Build final de non-régression**

Run: `npm run build`
Expected: build réussit, sitemap généré.

- [ ] **Step 4 : Commit**

```bash
git add docs/cms-setup.md
git commit -m "docs(cms): bibliothèque d'assets + Réglages Apparence"
```

---

## Self-Review (effectué)

- **Couverture spec :** Volet 1 (bibliothèque) → Task 5 (doc + vérif, aucun code). Volet 2 (`settings`) → Task 1. Volet 3 (câblage Hero/BaseLayout) → Tasks 2-3. Volet 4 (config CMS) → Task 4. Garde-fous (fallback champ vide) → Tasks 2-3 (`heroVideoSrc`, `ogDefault`). ✔
- **Placeholders :** aucun TBD/TODO ; tout le code et toutes les commandes sont explicites. ✔
- **Cohérence des types :** `heroVideo` / `ogImage` (string optionnels) cohérents entre `site.json`, le schéma Zod, `SiteSettings`, les props Hero/BaseLayout et `config.yml`. `getEntry('settings','site')` utilise l'id `site` = nom de fichier `site.json` (glob loader). ✔

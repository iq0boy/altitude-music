import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const SERVICE_KEYS = ['rec', 'mix', 'cover', 'prod', 'coach', 'book'] as const;
const tri = z.object({ fr: z.string(), en: z.string(), nl: z.string() });
const triList = z.object({ fr: z.array(z.string()), en: z.array(z.string()), nl: z.array(z.string()) });

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.string(),
    readMin: z.number(),
    lang: z.enum(['fr', 'en', 'nl']),
    postSlug: z.string(),
    excerpt: z.string().optional(),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/music' }),
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    duration: z.string(),
    bpm: z.number(),
    genre: z.string(),
    year: z.string(),
    color: z.string(),
    sortOrder: z.number(),
    spotifyUrl: z.string().optional(),
    spotifyTrackId: z.string().optional(),
    audioSrc: z.string(),                       // /audio/<slug>.mp3
    previewDuration: z.number().default(30),    // seconds — Spotify previews are 30s
  }),
});

const media = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/media' }),
  schema: z.object({
    type: z.enum(['video', 'image']),
    src: z.string(),                    // e.g. /media/clip-01.mp4
    poster: z.string().optional(),       // optional poster for videos
    title: z.string().optional(),
    kind: z.string(),                    // CLIP / SESSION / BTS / etc.
    aspect: z.string().default('9/16'),
    sortOrder: z.number(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
  schema: z.object({
    key: z.enum(SERVICE_KEYS),
    sortOrder: z.number(),
    price: z.number(),                    // 0 = gratuit, -1 = sur devis
    popular: z.boolean().default(false),
    name: tri,
    unit: tri,
    desc: tri,
    long: tri,
    includes: triList,
    gallery: z.tuple([z.string(), z.string(), z.string()]),  // 3 couleurs de la galerie
    video: z.string().default(''),                            // id YouTube, '' = aucune
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    handle: z.string(),
    instagram: z.string(),
    color: z.string(),
    sortOrder: z.number(),
    role: tri,
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    service: z.enum(SERVICE_KEYS),
    rating: z.number(),
    sortOrder: z.number(),
    text: tri,
  }),
});

export const collections = { blog, music, media, services, team, testimonials };

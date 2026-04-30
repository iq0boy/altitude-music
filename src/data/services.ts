export const SERVICE_KEYS = ['rec', 'mix', 'cover', 'prod', 'coach', 'book'] as const;
export type ServiceKey = typeof SERVICE_KEYS[number];

export const DEFAULT_PRICES: Record<ServiceKey, number> = {
  rec: 60, mix: 90, cover: 120, prod: 150, coach: 200, book: 0,
};

export const SERVICE_GALLERY: Record<ServiceKey, [string, string, string]> = {
  rec:   ['#fd5f2e', '#3206b8', '#000000'],
  mix:   ['#3206b8', '#fd5f2e', '#a0d4e6'],
  cover: ['#ffbdff', '#ffff00', '#fd5f2e'],
  prod:  ['#3206b8', '#000000', '#ffff00'],
  coach: ['#3aa022', '#ffff00', '#fd5f2e'],
  book:  ['#a0d4e6', '#ffbdff', '#3206b8'],
};

export const SERVICE_VIDEOS: Record<ServiceKey, string | null> = {
  rec:   '9bZkp7q19f0',
  mix:   'kJQP7kiw5Fk',
  cover: null,
  prod:  'OPf0YbXqDm0',
  coach: 'dQw4w9WgXcQ',
  book:  null,
};

export const SERVICE_LONG: Record<ServiceKey, { fr: string; en: string; nl: string }> = {
  rec: {
    fr: "Sept jours sur sept, sur rendez-vous. Cabine traitée acoustiquement, chaîne micro Neumann/AKG, préamp à lampes. On capte ta voix avec la couleur que tu veux : intime, hi-fi, brut. Sessions de 4h ou journée complète, ingé son inclus, prises directes ou multi-pistes.",
    en: "Seven days a week, by appointment. Acoustically treated booth, Neumann/AKG mic chain, tube preamp. We capture your voice with the color you want: intimate, hi-fi, raw. 4-hour sessions or full day, engineer included, direct or multitrack tracking.",
    nl: "Zeven dagen per week, op afspraak. Akoestisch behandelde cabine, Neumann/AKG microfoonketen, buisvoorversterker. We vangen je stem in de kleur die je wil: intiem, hi-fi, ruw. Sessies van 4u of een volle dag, technicus inbegrepen, direct of multitrack.",
  },
  mix: {
    fr: "Mix hybride analogique/numérique pour profondeur et caractère. Mastering loudness-aware adapté streaming, vinyle, broadcast. Deux révisions incluses, livrables WAV/MP3/stems. Délai standard : 5 jours ouvrables.",
    en: "Hybrid analog/digital mix for depth and character. Loudness-aware mastering adapted to streaming, vinyl, broadcast. Two revisions included, WAV/MP3/stems delivered. Standard turnaround: 5 working days.",
    nl: "Hybride analoge/digitale mix voor diepte en karakter. Loudness-aware mastering aangepast aan streaming, vinyl, broadcast. Twee revisies inbegrepen, WAV/MP3/stems geleverd. Standaard doorlooptijd: 5 werkdagen.",
  },
  cover: {
    fr: "Direction artistique complète : moodboard, shooting, retouche, typographie. On construit une identité qui se lit en miniature comme en 3000×3000. Single, EP, album — adaptés DSP et réseaux.",
    en: "Full art direction: moodboard, shoot, retouching, typography. We build an identity that reads at thumbnail as well as 3000×3000. Single, EP, album — DSP and social adaptations.",
    nl: "Volledige art direction: moodboard, shoot, retouchering, typografie. We bouwen een identiteit die zowel als thumbnail als op 3000×3000 leesbaar is. Single, EP, album — aangepast voor DSP en socials.",
  },
  prod: {
    fr: "Beats sur-mesure, instrumentaux, arrangements, toplines. Briefs en studio ou à distance. On compose autour de ta voix et de ta direction, jamais l'inverse. Stems livrés.",
    en: "Custom beats, instrumentals, arrangements, toplines. Briefs in studio or remote. We compose around your voice and direction, never the other way around. Stems delivered.",
    nl: "Beats op maat, instrumentalen, arrangementen, toplines. Briefings in de studio of op afstand. We componeren rond jouw stem en richting, nooit andersom. Stems geleverd.",
  },
  coach: {
    fr: "Forfait mensuel : stratégie release, distribution, performance scénique, identité. On t'accompagne sur la durée, du premier single au premier festival. Une session par semaine.",
    en: "Monthly plan: release strategy, distribution, stage performance, identity. We support you long-term, from first single to first festival. One session per week.",
    nl: "Maandelijks pakket: releasestrategie, distributie, podiumprestatie, identiteit. We begeleiden je op lange termijn, van eerste single tot eerste festival. Eén sessie per week.",
  },
  book: {
    fr: "Visite gratuite du studio. Tu écoutes le matériel, on parle de ton projet, on prend un café. Aucune obligation, aucun engagement.",
    en: "Free studio visit. You listen to the gear, we talk about your project, we have a coffee. No obligation, no commitment.",
    nl: "Gratis studiobezoek. Je luistert naar het materiaal, we praten over je project, we drinken koffie. Geen verplichtingen, geen engagement.",
  },
};

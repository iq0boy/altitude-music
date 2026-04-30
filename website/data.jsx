// data.jsx — Static content (portfolio, team, videos, testimonials)

const TRACKS = [
  { id: 1, title: "Skyline", artist: "NAWAH", duration: "3:24", bpm: 92, genre: "Hip-Hop", year: "2025", color: "#fd5f2e" },
  { id: 2, title: "Verre Cassé", artist: "LIO-K", duration: "2:51", bpm: 140, genre: "Drill", year: "2025", color: "#3206b8" },
  { id: 3, title: "Plus Haut", artist: "ZAYD & TIM", duration: "4:02", bpm: 88, genre: "R&B", year: "2024", color: "#ffff00" },
  { id: 4, title: "Néon", artist: "MARA", duration: "3:15", bpm: 120, genre: "Pop", year: "2025", color: "#ffbdff" },
  { id: 5, title: "Sous la Pluie", artist: "KEYZ", duration: "3:48", bpm: 76, genre: "Soul", year: "2024", color: "#a0d4e6" },
  { id: 6, title: "Tempête", artist: "OURO", duration: "2:33", bpm: 150, genre: "Drill", year: "2025", color: "#3aa022" },
  { id: 7, title: "Lampadaire", artist: "JIN-X", duration: "3:09", bpm: 95, genre: "Hip-Hop", year: "2024", color: "#fd5f2e" },
  { id: 8, title: "À l'Aube", artist: "NAWAH", duration: "4:21", bpm: 70, genre: "R&B", year: "2025", color: "#ffbdff" },
  { id: 9, title: "Béton", artist: "SVNDY", duration: "2:48", bpm: 145, genre: "Drill", year: "2025", color: "#3206b8" }
];

const TEAM = [
  { name: "Sami", role: { fr: "Ingé son / Mix", en: "Sound Engineer / Mix", nl: "Geluidstechnicus / Mix" }, color: "#fd5f2e" },
  { name: "Iliès", role: { fr: "Production", en: "Production", nl: "Productie" }, color: "#3206b8" },
  { name: "Yass", role: { fr: "Direction artistique", en: "Art Director", nl: "Art Director" }, color: "#ffff00" },
  { name: "Léo", role: { fr: "Vidéaste / Clips", en: "Videographer / Clips", nl: "Videograaf / Clips" }, color: "#3aa022" }
];

const VIDEOS = [
  { id: "dQw4w9WgXcQ", title: { fr: "NAWAH — Skyline (Clip officiel)", en: "NAWAH — Skyline (Official video)", nl: "NAWAH — Skyline (Officiële clip)" }, type: "CLIP" },
  { id: "9bZkp7q19f0", title: { fr: "Live Session — LIO-K dans la cabine", en: "Live Session — LIO-K in the booth", nl: "Live Session — LIO-K in de cabine" }, type: "SESSION" },
  { id: "kJQP7kiw5Fk", title: { fr: "Behind the scenes — Mix de l'EP", en: "Behind the scenes — Mixing the EP", nl: "Behind the scenes — De EP mixen" }, type: "BTS" },
  { id: "OPf0YbXqDm0", title: { fr: "MARA — Néon (Clip)", en: "MARA — Néon (Video)", nl: "MARA — Néon (Clip)" }, type: "CLIP" }
];

const TESTIMONIALS = [
  { name: "Nawah", role: "Artiste / Hip-Hop", service: "rec", text: { fr: "L'équipe a tout compris dès la première session. Ils m'ont poussé à aller plus loin, et le résultat est exactement ce que j'imaginais — en mieux.", en: "The team got it from the first session. They pushed me further, and the result is exactly what I imagined — but better.", nl: "Het team begreep het vanaf de eerste sessie. Ze duwden me verder, en het resultaat is precies wat ik me voorstelde — maar beter." }, rating: 5 },
  { name: "Lio-K", role: "Drill / LLN", service: "mix", text: { fr: "Studio propre, oreille affutée, vrai feeling. C'est devenu mon spot par défaut.", en: "Clean studio, sharp ears, real feel. It's become my go-to spot.", nl: "Propere studio, scherp gehoor, echt gevoel. Mijn vaste plek geworden." }, rating: 5 },
  { name: "Mara", role: "Pop / Vocaliste", service: "mix", text: { fr: "Ils ont mixé mon EP en 4 jours. Sans compromis sur la qualité. Recommandé à 100%.", en: "They mixed my EP in 4 days. No compromise on quality. 100% recommend.", nl: "Ze mixten mijn EP in 4 dagen. Geen compromis op kwaliteit. 100% aanbevolen." }, rating: 5 },
  { name: "Zayd", role: "Producteur", service: "prod", text: { fr: "Le mastering envoie. Mes prods sonnent comme à la radio. Mission accomplie.", en: "The mastering hits. My beats sound radio-ready. Mission accomplished.", nl: "De mastering knalt. Mijn beats klinken radioklaar. Missie volbracht." }, rating: 5 },
  { name: "Keyz", role: "Soul / Songwriter", service: "cover", text: { fr: "La pochette qu'ils ont faite a fait passer mon EP au niveau supérieur. Direction artistique au top.", en: "The cover art they made took my EP to the next level. Top-notch art direction.", nl: "De cover die ze maakten tilde mijn EP naar een hoger niveau. Topniveau art direction." }, rating: 5 },
  { name: "Ouro", role: "Drill / LLN", service: "coach", text: { fr: "Six mois d'accompagnement, et j'ai signé chez un label. Ils savent où ils vont.", en: "Six months of coaching, and I signed with a label. They know where they're going.", nl: "Zes maanden begeleiding, en ik tekende bij een label. Ze weten waar ze heen gaan." }, rating: 5 }
];

const SERVICE_GALLERY = {
  rec:  ['#fd5f2e', '#3206b8', '#000000'],
  mix:  ['#3206b8', '#fd5f2e', '#a0d4e6'],
  cover:['#ffbdff', '#ffff00', '#fd5f2e'],
  prod: ['#3206b8', '#000000', '#ffff00'],
  coach:['#3aa022', '#ffff00', '#fd5f2e'],
  book: ['#a0d4e6', '#ffbdff', '#3206b8']
};

const SERVICE_VIDEOS = {
  rec:  '9bZkp7q19f0',
  mix:  'kJQP7kiw5Fk',
  cover:null,
  prod: 'OPf0YbXqDm0',
  coach:'dQw4w9WgXcQ',
  book: null
};

const SERVICE_LONG = {
  rec: {
    fr: "Sept jours sur sept, sur rendez-vous. Cabine traitée acoustiquement, chaîne micro Neumann/AKG, préamp à lampes. On capte ta voix avec la couleur que tu veux : intime, hi-fi, brut. Sessions de 4h ou journée complète, ingé son inclus, prises directes ou multi-pistes.",
    en: "Seven days a week, by appointment. Acoustically treated booth, Neumann/AKG mic chain, tube preamp. We capture your voice with the color you want: intimate, hi-fi, raw. 4-hour sessions or full day, engineer included, direct or multitrack tracking.",
    nl: "Zeven dagen per week, op afspraak. Akoestisch behandelde cabine, Neumann/AKG microfoonketen, buisvoorversterker. We vangen je stem in de kleur die je wil: intiem, hi-fi, ruw. Sessies van 4u of een volle dag, technicus inbegrepen, direct of multitrack."
  },
  mix: {
    fr: "Mix hybride analogique/numérique pour profondeur et caractère. Mastering loudness-aware adapté streaming, vinyle, broadcast. Deux révisions incluses, livrables WAV/MP3/stems. Délai standard : 5 jours ouvrables.",
    en: "Hybrid analog/digital mix for depth and character. Loudness-aware mastering adapted to streaming, vinyl, broadcast. Two revisions included, WAV/MP3/stems delivered. Standard turnaround: 5 working days.",
    nl: "Hybride analoge/digitale mix voor diepte en karakter. Loudness-aware mastering aangepast aan streaming, vinyl, broadcast. Twee revisies inbegrepen, WAV/MP3/stems geleverd. Standaard doorlooptijd: 5 werkdagen."
  },
  cover: {
    fr: "Direction artistique complète : moodboard, shooting, retouche, typographie. On construit une identité qui se lit en miniature comme en 3000×3000. Single, EP, album — adaptés DSP et réseaux.",
    en: "Full art direction: moodboard, shoot, retouching, typography. We build an identity that reads at thumbnail as well as 3000×3000. Single, EP, album — DSP and social adaptations.",
    nl: "Volledige art direction: moodboard, shoot, retouchering, typografie. We bouwen een identiteit die zowel als thumbnail als op 3000×3000 leesbaar is. Single, EP, album — aangepast voor DSP en socials."
  },
  prod: {
    fr: "Beats sur-mesure, instrumentaux, arrangements, toplines. Briefs en studio ou à distance. On compose autour de ta voix et de ta direction, jamais l'inverse. Stems livrés.",
    en: "Custom beats, instrumentals, arrangements, toplines. Briefs in studio or remote. We compose around your voice and direction, never the other way around. Stems delivered.",
    nl: "Beats op maat, instrumentalen, arrangementen, toplines. Briefings in de studio of op afstand. We componeren rond jouw stem en richting, nooit andersom. Stems geleverd."
  },
  coach: {
    fr: "Forfait mensuel : stratégie release, distribution, performance scénique, identité. On t'accompagne sur la durée, du premier single au premier festival. Une session par semaine.",
    en: "Monthly plan: release strategy, distribution, stage performance, identity. We support you long-term, from first single to first festival. One session per week.",
    nl: "Maandelijks pakket: releasestrategie, distributie, podiumprestatie, identiteit. We begeleiden je op lange termijn, van eerste single tot eerste festival. Eén sessie per week."
  },
  book: {
    fr: "Visite gratuite du studio. Tu écoutes le matériel, on parle de ton projet, on prend un café. Aucune obligation, aucun engagement.",
    en: "Free studio visit. You listen to the gear, we talk about your project, we have a coffee. No obligation, no commitment.",
    nl: "Gratis studiobezoek. Je luistert naar het materiaal, we praten over je project, we drinken koffie. Geen verplichtingen, geen engagement."
  }
};

window.ALT_DATA = { TRACKS, TEAM, VIDEOS, TESTIMONIALS, SERVICE_GALLERY, SERVICE_VIDEOS, SERVICE_LONG };

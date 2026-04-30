// i18n.jsx — Full FR/EN/NL translations for Altitude Music
const I18N = {
  fr: {
    nav: { work: "Travaux", services: "Services", about: "À propos", blog: "Journal", contact: "Contact", book: "Prendre RDV" },
    hero: {
      tag: "STUDIO // LOUVAIN-LA-NEUVE // EST. 2018",
      title: "Le son qui te ressemble.",
      sub: "Studio d'enregistrement, mix, mastering et production sur-mesure. On capture ton univers, on le pousse plus haut.",
      cta1: "Réserver une session",
      cta2: "Écouter le portfolio",
      live: "EN DIRECT DU STUDIO",
      meta: "ALTITUDE.MUSIC // V.026"
    },
    sections: {
      services: "Services & Tarifs",
      servicesSub: "Forfaits clairs, devis sur mesure pour les projets ambitieux.",
      portfolio: "Portfolio",
      portfolioSub: "La playlist Altitude — des projets qu'on a portés du démo au master.",
      videos: "Vidéos",
      videosSub: "Sessions, clips, behind the scenes.",
      about: "À propos",
      aboutSub: "Un collectif, un studio, une mission.",
      testimonials: "Ils ont signé",
      testimonialsSub: "Ce que disent les artistes qu'on accompagne.",
      blog: "Journal",
      blogSub: "Notes du studio — tips, sorties, sessions.",
      booking: "Prendre rendez-vous",
      bookingSub: "Choisis ton créneau. Synchronisé au calendrier du studio.",
      contact: "Contact",
      contactSub: "On répond dans les 24h. WhatsApp pour le plus rapide."
    },
    services: {
      rec: { name: "Enregistrement", desc: "Voix, instruments, sessions live. Cabine traitée, micros condensateurs et rubans.", unit: "/ session 4h" },
      mix: { name: "Mix & Master", desc: "Mix analogique-hybride, mastering loudness-aware. Révisions incluses.", unit: "/ titre" },
      cover: { name: "Pochettes", desc: "Direction artistique, photo, design. Du single à l'EP, on construit ton image.", unit: "/ artwork" },
      prod: { name: "Prod sur-mesure", desc: "Beats, instrumentaux, arrangements. On compose autour de ta voix.", unit: "/ instru" },
      coach: { name: "Accompagnement", desc: "Stratégie release, distribution, performance scénique. On te suit sur la durée.", unit: "/ mois" },
      book: { name: "Prendre RDV", desc: "Visite du studio, écoute, brief de projet. Café offert.", unit: "gratuit" }
    },
    servicesUI: { from: "À partir de", quote: "Sur devis", cta: "Réserver", popular: "POPULAIRE" },
    portfolio: {
      filter: "Filtrer",
      all: "Tout",
      play: "PLAY",
      pause: "PAUSE",
      open: "Ouvrir dans Spotify",
      duration: "DURÉE",
      bpm: "BPM",
      genre: "GENRE"
    },
    testi: {
      formTitle: "Laisse ton témoignage",
      name: "Ton nom / Alias",
      role: "Projet / Rôle",
      service: "Service utilisé",
      message: "Ton retour",
      rating: "Note",
      submit: "Envoyer",
      thanks: "Merci ! On valide et on publie.",
      filterAll: "Tout",
      ratedFor: "À propos de"
    },
    serviceDetail: {
      back: "← Retour aux services",
      gallery: "Galerie",
      video: "Vidéo",
      pricing: "Tarification",
      whatYouGet: "Ce que tu obtiens",
      reviews: "Avis sur ce service",
      noReviews: "Pas encore d'avis pour ce service.",
      bookNow: "Réserver maintenant",
      learnMore: "En savoir plus →",
      includes: "Inclus",
      cta: "Discutons de ton projet"
    },
    serviceIncludes: {
      rec: ["Cabine traitée acoustique", "Ingé son inclus", "Multi-pistes WAV 24-bit", "Sauvegarde projet 30 jours"],
      mix: ["Mix hybride analogique", "Mastering inclus", "2 révisions", "Stems livrés"],
      cover: ["Moodboard & DA", "Shooting photo", "Adaptations DSP", "3 révisions"],
      prod: ["Beat exclusif", "Stems WAV", "Crédits négociables", "Toplines optionnelles"],
      coach: ["1 session/semaine", "Stratégie release", "Distribution incluse", "Suivi WhatsApp 7/7"],
      book: ["Visite du studio", "Écoute du matériel", "Brief de projet", "Café offert"]
    },
    contactForm: {
      name: "Nom",
      email: "Email",
      project: "Type de projet",
      message: "Message",
      send: "Envoyer",
      whatsapp: "Ouvrir WhatsApp",
      sent: "Message envoyé. À très vite.",
      types: ["Enregistrement", "Mix & Master", "Production", "Pochette", "Autre"]
    },
    booking: {
      pickDate: "Choisis une date",
      pickTime: "Choisis un créneau",
      duration: "Durée",
      service: "Service",
      confirm: "Confirmer le RDV",
      booked: "RDV confirmé. Confirmation par email.",
      tz: "Heure de Bruxelles",
      slots: ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"],
      durations: ["1h", "2h", "4h", "Journée"]
    },
    blog: { read: "Lire", min: "min", posts: [
      { tag: "TIPS", title: "5 erreurs de mix qu'on entend tout le temps", date: "12 AVR 2026", read: 6 },
      { tag: "SESSION", title: "Behind the scenes — l'EP de Nawah", date: "28 MAR 2026", read: 4 },
      { tag: "GEAR", title: "Pourquoi on est passés au Neumann TLM 49", date: "15 MAR 2026", read: 3 },
      { tag: "RELEASE", title: "Trois sorties à écouter ce mois-ci", date: "02 MAR 2026", read: 2 }
    ]},
    chat: {
      title: "Studio Altitude",
      online: "En ligne",
      placeholder: "Écris ton message...",
      whatsapp: "Continuer sur WhatsApp",
      open: "Discuter avec nous"
    },
    footer: { rights: "Tous droits réservés", made: "Conçu et masterisé à Louvain-la-Neuve" },
    about: {
      story: "À propos",
      storyText: "Altitude Music a été fondée en 2023 en tant qu'asbl, mais le collectif existe depuis 2018. Depuis lors, nous sommes un acteur clé de la scène musicale de Louvain-la-Neuve. Notre mission est de soutenir et de développer le potentiel artistique des jeunes, en mettant en avant la musique hip-hop comme moyen d'expression artistique.",
      team: "L'équipe",
      teamText: "Prod, mix, master, pochette, clip… Notre équipe réunit tout pour faire avancer ton projet, du son à l'image.",
      stats: [
        { n: "200+", l: "Titres masterisés" },
        { n: "07", l: "Ans d'activité" },
        { n: "40+", l: "Artistes accompagnés" },
        { n: "24/7", l: "Studio dispo" }
      ]
    }
  },
  en: {
    nav: { work: "Work", services: "Services", about: "About", blog: "Journal", contact: "Contact", book: "Book" },
    hero: {
      tag: "STUDIO // LOUVAIN-LA-NEUVE // EST. 2018",
      title: "Sound that sounds like you.",
      sub: "Recording, mixing, mastering, custom production. We capture your world and push it higher.",
      cta1: "Book a session",
      cta2: "Listen to the work",
      live: "LIVE FROM THE STUDIO",
      meta: "ALTITUDE.MUSIC // V.026"
    },
    sections: {
      services: "Services & Pricing",
      servicesSub: "Clear packages, custom quotes for ambitious projects.",
      portfolio: "Portfolio",
      portfolioSub: "The Altitude playlist — projects we took from demo to master.",
      videos: "Videos",
      videosSub: "Sessions, clips, behind the scenes.",
      about: "About",
      aboutSub: "A collective, a studio, a mission.",
      testimonials: "They signed up",
      testimonialsSub: "What the artists we work with have to say.",
      blog: "Journal",
      blogSub: "Studio notes — tips, releases, sessions.",
      booking: "Book a slot",
      bookingSub: "Pick your time. Synced with the studio calendar.",
      contact: "Contact",
      contactSub: "We reply within 24h. WhatsApp for the fastest answer."
    },
    services: {
      rec: { name: "Recording", desc: "Vocals, instruments, live sessions. Treated booth, condenser and ribbon mics.", unit: "/ 4h session" },
      mix: { name: "Mix & Master", desc: "Hybrid analog mix, loudness-aware mastering. Revisions included.", unit: "/ track" },
      cover: { name: "Cover Art", desc: "Art direction, photo, design. From single to EP, we build your visual.", unit: "/ artwork" },
      prod: { name: "Custom Production", desc: "Beats, instrumentals, arrangements. We build around your voice.", unit: "/ beat" },
      coach: { name: "Artist Coaching", desc: "Release strategy, distribution, stage performance. Long-term support.", unit: "/ month" },
      book: { name: "Studio Tour", desc: "Visit the studio, listen, brief the project. Coffee on us.", unit: "free" }
    },
    servicesUI: { from: "From", quote: "On request", cta: "Book", popular: "POPULAR" },
    portfolio: {
      filter: "Filter",
      all: "All",
      play: "PLAY",
      pause: "PAUSE",
      open: "Open in Spotify",
      duration: "DURATION",
      bpm: "BPM",
      genre: "GENRE"
    },
    testi: {
      formTitle: "Drop a testimonial",
      name: "Name / Alias",
      role: "Project / Role",
      service: "Service used",
      message: "Your feedback",
      rating: "Rating",
      submit: "Submit",
      thanks: "Thanks! We'll review and publish.",
      filterAll: "All",
      ratedFor: "About"
    },
    serviceDetail: {
      back: "← Back to services",
      gallery: "Gallery",
      video: "Video",
      pricing: "Pricing",
      whatYouGet: "What you get",
      reviews: "Reviews for this service",
      noReviews: "No reviews yet for this service.",
      bookNow: "Book now",
      learnMore: "Learn more →",
      includes: "Includes",
      cta: "Let's talk about your project"
    },
    serviceIncludes: {
      rec: ["Acoustically treated booth", "Engineer included", "Multitrack WAV 24-bit", "30-day project backup"],
      mix: ["Hybrid analog mix", "Mastering included", "2 revisions", "Stems delivered"],
      cover: ["Moodboard & art direction", "Photo shoot", "DSP adaptations", "3 revisions"],
      prod: ["Exclusive beat", "WAV stems", "Negotiable credits", "Optional toplines"],
      coach: ["1 session/week", "Release strategy", "Distribution included", "WhatsApp support 7/7"],
      book: ["Studio tour", "Gear listening", "Project brief", "Coffee on us"]
    },
    contactForm: {
      name: "Name",
      email: "Email",
      project: "Project type",
      message: "Message",
      send: "Send",
      whatsapp: "Open WhatsApp",
      sent: "Message sent. Talk soon.",
      types: ["Recording", "Mix & Master", "Production", "Cover Art", "Other"]
    },
    booking: {
      pickDate: "Pick a date",
      pickTime: "Pick a slot",
      duration: "Duration",
      service: "Service",
      confirm: "Confirm booking",
      booked: "Booking confirmed. Email confirmation sent.",
      tz: "Brussels time",
      slots: ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"],
      durations: ["1h", "2h", "4h", "Full day"]
    },
    blog: { read: "Read", min: "min", posts: [
      { tag: "TIPS", title: "5 mixing mistakes we hear all the time", date: "12 APR 2026", read: 6 },
      { tag: "SESSION", title: "Behind the scenes — Nawah's EP", date: "28 MAR 2026", read: 4 },
      { tag: "GEAR", title: "Why we switched to the Neumann TLM 49", date: "15 MAR 2026", read: 3 },
      { tag: "RELEASE", title: "Three releases to listen to this month", date: "02 MAR 2026", read: 2 }
    ]},
    chat: {
      title: "Altitude Studio",
      online: "Online",
      placeholder: "Type a message...",
      whatsapp: "Continue on WhatsApp",
      open: "Chat with us"
    },
    footer: { rights: "All rights reserved", made: "Designed and mastered in Louvain-la-Neuve" },
    about: {
      story: "About",
      storyText: "Altitude Music was founded in 2023 as a non-profit, but the collective has been around since 2018. Since then, we've been a key player in the Louvain-la-Neuve music scene. Our mission is to support and develop the artistic potential of young creators, putting hip-hop music forward as a means of artistic expression.",
      team: "The team",
      teamText: "Production, mix, master, cover art, music videos… Our team brings everything together to move your project forward, from sound to image.",
      stats: [
        { n: "200+", l: "Tracks mastered" },
        { n: "07", l: "Years active" },
        { n: "40+", l: "Artists supported" },
        { n: "24/7", l: "Studio available" }
      ]
    }
  },
  nl: {
    nav: { work: "Werk", services: "Diensten", about: "Over ons", blog: "Journaal", contact: "Contact", book: "Boeken" },
    hero: {
      tag: "STUDIO // LOUVAIN-LA-NEUVE // EST. 2018",
      title: "Geluid dat op jou lijkt.",
      sub: "Opname, mix, mastering en productie op maat. We vangen jouw wereld en tillen die hoger.",
      cta1: "Sessie boeken",
      cta2: "Luister naar het werk",
      live: "LIVE UIT DE STUDIO",
      meta: "ALTITUDE.MUSIC // V.026"
    },
    sections: {
      services: "Diensten & Tarieven",
      servicesSub: "Heldere pakketten, offertes op maat voor ambitieuze projecten.",
      portfolio: "Portfolio",
      portfolioSub: "De Altitude-playlist — projecten van demo tot master.",
      videos: "Video's",
      videosSub: "Sessies, clips, behind the scenes.",
      about: "Over ons",
      aboutSub: "Een collectief, een studio, een missie.",
      testimonials: "Zij tekenden",
      testimonialsSub: "Wat de artiesten waarmee we werken zeggen.",
      blog: "Journaal",
      blogSub: "Studionotities — tips, releases, sessies.",
      booking: "Afspraak maken",
      bookingSub: "Kies je moment. Gesynchroniseerd met de studiokalender.",
      contact: "Contact",
      contactSub: "We antwoorden binnen 24u. WhatsApp voor het snelste antwoord."
    },
    services: {
      rec: { name: "Opname", desc: "Zang, instrumenten, live sessies. Behandelde cabine, condensator- en lintmicrofoons.", unit: "/ sessie 4u" },
      mix: { name: "Mix & Master", desc: "Hybride analoge mix, loudness-aware mastering. Revisies inbegrepen.", unit: "/ track" },
      cover: { name: "Cover Art", desc: "Art direction, foto, design. Van single tot EP — wij bouwen je beeld.", unit: "/ artwork" },
      prod: { name: "Productie op maat", desc: "Beats, instrumentalen, arrangementen. We bouwen rond jouw stem.", unit: "/ beat" },
      coach: { name: "Begeleiding", desc: "Releasestrategie, distributie, podiumprestatie. Langetermijnsteun.", unit: "/ maand" },
      book: { name: "Studio Tour", desc: "Bezoek de studio, luister, brief je project. Koffie van het huis.", unit: "gratis" }
    },
    servicesUI: { from: "Vanaf", quote: "Op aanvraag", cta: "Boeken", popular: "POPULAIR" },
    portfolio: {
      filter: "Filter",
      all: "Alles",
      play: "PLAY",
      pause: "PAUZE",
      open: "Open in Spotify",
      duration: "DUUR",
      bpm: "BPM",
      genre: "GENRE"
    },
    testi: {
      formTitle: "Laat je getuigenis achter",
      name: "Naam / Alias",
      role: "Project / Rol",
      service: "Gebruikte dienst",
      message: "Jouw feedback",
      rating: "Score",
      submit: "Versturen",
      thanks: "Bedankt! We bekijken het en publiceren.",
      filterAll: "Alles",
      ratedFor: "Over"
    },
    serviceDetail: {
      back: "← Terug naar diensten",
      gallery: "Galerij",
      video: "Video",
      pricing: "Tarief",
      whatYouGet: "Wat je krijgt",
      reviews: "Beoordelingen voor deze dienst",
      noReviews: "Nog geen beoordelingen voor deze dienst.",
      bookNow: "Nu boeken",
      learnMore: "Meer info →",
      includes: "Inbegrepen",
      cta: "Laten we over je project praten"
    },
    serviceIncludes: {
      rec: ["Akoestisch behandelde cabine", "Technicus inbegrepen", "Multitrack WAV 24-bit", "30 dagen projectbackup"],
      mix: ["Hybride analoge mix", "Mastering inbegrepen", "2 revisies", "Stems geleverd"],
      cover: ["Moodboard & art direction", "Fotoshoot", "DSP-aanpassingen", "3 revisies"],
      prod: ["Exclusieve beat", "WAV stems", "Onderhandelbare credits", "Optionele toplines"],
      coach: ["1 sessie/week", "Releasestrategie", "Distributie inbegrepen", "WhatsApp support 7/7"],
      book: ["Studio tour", "Gear beluisteren", "Projectbriefing", "Koffie van het huis"]
    },
    contactForm: {
      name: "Naam",
      email: "Email",
      project: "Type project",
      message: "Bericht",
      send: "Versturen",
      whatsapp: "WhatsApp openen",
      sent: "Bericht verzonden. Tot snel.",
      types: ["Opname", "Mix & Master", "Productie", "Cover Art", "Andere"]
    },
    booking: {
      pickDate: "Kies een datum",
      pickTime: "Kies een tijdslot",
      duration: "Duur",
      service: "Dienst",
      confirm: "Boeking bevestigen",
      booked: "Boeking bevestigd. Bevestiging per email.",
      tz: "Brusselse tijd",
      slots: ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"],
      durations: ["1u", "2u", "4u", "Volle dag"]
    },
    blog: { read: "Lezen", min: "min", posts: [
      { tag: "TIPS", title: "5 mixfouten die we voortdurend horen", date: "12 APR 2026", read: 6 },
      { tag: "SESSIE", title: "Behind the scenes — de EP van Nawah", date: "28 MRT 2026", read: 4 },
      { tag: "GEAR", title: "Waarom we overgestapt zijn op de Neumann TLM 49", date: "15 MRT 2026", read: 3 },
      { tag: "RELEASE", title: "Drie releases om deze maand te beluisteren", date: "02 MRT 2026", read: 2 }
    ]},
    chat: {
      title: "Altitude Studio",
      online: "Online",
      placeholder: "Typ een bericht...",
      whatsapp: "Verder op WhatsApp",
      open: "Chat met ons"
    },
    footer: { rights: "Alle rechten voorbehouden", made: "Ontworpen en gemasterd in Louvain-la-Neuve" },
    about: {
      story: "Over ons",
      storyText: "Altitude Music werd in 2023 opgericht als vzw, maar het collectief bestaat sinds 2018. Sindsdien zijn we een sleutelspeler in de muziekscene van Louvain-la-Neuve. Onze missie is het artistieke potentieel van jongeren te ondersteunen en te ontwikkelen, met hiphop als middel van artistieke expressie.",
      team: "Het team",
      teamText: "Productie, mix, master, cover art, clips… Ons team brengt alles samen om je project vooruit te helpen, van geluid tot beeld.",
      stats: [
        { n: "200+", l: "Tracks gemasterd" },
        { n: "07", l: "Jaren actief" },
        { n: "40+", l: "Artiesten begeleid" },
        { n: "24/7", l: "Studio beschikbaar" }
      ]
    }
  }
};

window.I18N = I18N;

import fr from './fr.json';
import en from './en.json';
import nl from './nl.json';

export type Lang = 'fr' | 'en' | 'nl';
export type Translations = typeof fr;

const map = { fr, en, nl } as const;

export function getTranslations(lang: string): Translations {
  return map[lang as Lang] ?? fr;
}

export const LANGS: Lang[] = ['fr', 'en', 'nl'];

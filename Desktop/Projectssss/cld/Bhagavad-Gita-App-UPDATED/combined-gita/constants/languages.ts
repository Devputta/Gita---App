export const SUPPORTED_LANGUAGES = ["SANSKRIT", "KANNADA", "HINDI", "ENGLISH"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  SANSKRIT: "संस्कृतम्",
  KANNADA: "ಕನ್ನಡ",
  HINDI: "हिन्दी",
  ENGLISH: "English",
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  SANSKRIT: "Sanskrit",
  KANNADA: "Kannada",
  HINDI: "Hindi",
  ENGLISH: "English",
};

export const TRANSLATION_LANGUAGES = ["KANNADA", "HINDI", "ENGLISH"] as const;
export type TranslationLanguage = (typeof TRANSLATION_LANGUAGES)[number];

export const LANGUAGE_LOCALES: Record<Language, string> = {
  SANSKRIT: "sa-IN",
  KANNADA: "kn-IN",
  HINDI: "hi-IN",
  ENGLISH: "en-IN",
};

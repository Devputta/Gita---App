import type { Language, TranslationLanguage } from "@/constants/languages";

export type ReviewStatus =
  | "DRAFT"
  | "AI_GENERATED"
  | "REVIEW_REQUIRED"
  | "HUMAN_REVIEWED"
  | "PUBLISHED";

export type SourceKind =
  | "ORIGINAL_SANSKRIT"
  | "TRANSLATION"
  | "COMMENTARY"
  | "AI_EXPLANATION"
  | "AUDIO";

export interface Book {
  id: string;
  title: string;
  titleSanskrit: string;
  attribution: string;
  description: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  titleSanskrit: string | null;
  titleKannada: string | null;
  titleHindi: string | null;
  titleEnglish: string | null;
  description: string | null;
  verseCount: number | null;
}

export interface Verse {
  id: string;
  chapterId: string;
  verseNumber: number;
  sanskrit: string | null;
  transliteration: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Translation {
  id: string;
  verseId: string;
  language: TranslationLanguage;
  text: string | null;
  source: string | null;
  translator: string | null;
  publisher: string | null;
  license: string | null;
  sourceUrl: string | null;
  notes: string | null;
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SourceMetadata {
  id: string;
  kind: SourceKind;
  title: string;
  creator: string | null;
  publisher: string | null;
  license: string | null;
  sourceUrl: string | null;
  notes: string | null;
}

export interface ReaderContent {
  language: Language;
  label: string;
  text: string | null;
  status: "AVAILABLE" | "COMING_SOON";
}

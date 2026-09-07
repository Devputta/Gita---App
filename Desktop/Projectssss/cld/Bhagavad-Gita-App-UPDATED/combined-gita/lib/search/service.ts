import { getChapters, getChapterVerses, getTranslations } from "@/lib/content/service";
import type { Language } from "@/constants/languages";

export type SearchResult = { chapterNumber: number; verseNumber: number; language: Language; text: string };

export interface SearchRepository { search(query: string): Promise<SearchResult[]>; }

// PostgreSQL-ready boundary. Production can replace this implementation with a server
// endpoint using tsvector/GIN indexes without changing the UI.
export const postgresSearchRepository: SearchRepository = {
  async search() { throw new Error("PostgreSQL search endpoint is not configured in this client build."); },
};

const TRANSLATION_LANGUAGES = ["KANNADA", "HINDI", "ENGLISH"] as const;
export const localSearchRepository: SearchRepository = {
  async search(query) {
    const q = query.trim().toLocaleLowerCase(); if (!q) return [];
    const chapters = await getChapters(); const results: SearchResult[] = [];
    for (const chapter of chapters) {
      const verses = await getChapterVerses(chapter.chapterNumber);
      for (const verse of verses) {
        if (verse.sanskrit?.toLocaleLowerCase().includes(q)) results.push({ chapterNumber: chapter.chapterNumber, verseNumber: verse.verseNumber, language: "SANSKRIT", text: verse.sanskrit });
        for (const language of TRANSLATION_LANGUAGES) {
          const translations = await getTranslations(verse.id, language);
          for (const translation of translations) if (translation.text?.toLocaleLowerCase().includes(q)) results.push({ chapterNumber: chapter.chapterNumber, verseNumber: verse.verseNumber, language, text: translation.text });
        }
      }
    }
    return results.slice(0, 100);
  },
};

export const searchRepository = localSearchRepository;

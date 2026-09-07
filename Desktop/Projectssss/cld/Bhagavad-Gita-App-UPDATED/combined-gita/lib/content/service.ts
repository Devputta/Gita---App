import type { TranslationLanguage } from "@/constants/languages";
import { contentRepository } from "@/lib/content/repository";

export const getBook = () => contentRepository.getBook();
export const getChapters = () => contentRepository.getChapters();
export const getChapter = (chapterNumber: number) => contentRepository.getChapter(chapterNumber);
export const getChapterVerses = (chapterNumber: number) => contentRepository.getChapterVerses(chapterNumber);
export const getVerse = (chapterNumber: number, verseNumber: number) =>
  contentRepository.getVerse(chapterNumber, verseNumber);
export const getTranslations = (verseId: string, language: TranslationLanguage) =>
  contentRepository.getTranslations(verseId, language);

import type { Book, Chapter } from "@/types/gita";
import { APP_NAME, APP_SANSKRIT_NAME, ATTRIBUTION, DESCRIPTION } from "@/constants/app";

export const BOOK: Book = {
  id: "gita-001",
  title: APP_NAME,
  titleSanskrit: APP_SANSKRIT_NAME,
  attribution: ATTRIBUTION,
  description: DESCRIPTION,
};

export const CHAPTERS: Chapter[] = Array.from({ length: 18 }, (_, index) => {
  const chapterNumber = index + 1;
  return {
    id: `gita-001-chapter-${chapterNumber}`,
    bookId: BOOK.id,
    chapterNumber,
    titleSanskrit: null,
    titleKannada: null,
    titleHindi: null,
    titleEnglish: null,
    description: null,
    verseCount: [
      47, 72, 43, 42, 29, 47, 30, 28, 34,
      42, 55, 20, 34, 27, 20, 24, 28, 78,
    ][index] ?? null,
  };
});

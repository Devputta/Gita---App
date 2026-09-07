import { BOOK, CHAPTERS } from "@/lib/content/seed";
import type { Chapter, Translation, Verse } from "@/types/gita";
import type { TranslationLanguage } from "@/constants/languages";
import { validateChapterNumber, validateVerseNumber } from "@/lib/content/validation";
import { getManagedPublishedTranslation } from "@/lib/content/adminTranslations";
import sanskritData from "@/data/sanskrit/verses.json";
import kannadaData from "@/data/translations/kannada.json";
import hindiData from "@/data/translations/hindi.json";
import englishData from "@/data/translations/english.json";

type LocalVerseRecord = {
  chapterNumber: number;
  verseNumber: number;
  sanskrit: string;
  transliteration: string | null;
};

export interface ContentRepository {
  getBook(): Promise<typeof BOOK>;
  getChapters(): Promise<Chapter[]>;
  getChapter(chapterNumber: number): Promise<Chapter | null>;
  getVerse(chapterNumber: number, verseNumber: number): Promise<Verse | null>;
  getChapterVerses(chapterNumber: number): Promise<Verse[]>;
  getTranslations(verseId: string, language: TranslationLanguage): Promise<Translation[]>;
}

const translationData = {
  KANNADA: kannadaData,
  HINDI: hindiData,
  ENGLISH: englishData,
} as const;

type LocalTranslationRecord = Omit<Translation, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

function toTranslation(record: LocalTranslationRecord): Translation {
  const now = new Date().toISOString();
  return {
    ...record,
    createdAt: record.createdAt ?? now,
    updatedAt: record.updatedAt ?? now,
  };
}

const localVerses = sanskritData as LocalVerseRecord[];

function toVerse(record: LocalVerseRecord): Verse {
  const now = new Date().toISOString();
  return {
    id: `gita-001-chapter-${String(record.chapterNumber).padStart(2, "0")}-verse-${String(record.verseNumber).padStart(3, "0")}`,
    chapterId: `gita-001-chapter-${record.chapterNumber}`,
    verseNumber: record.verseNumber,
    sanskrit: record.sanskrit,
    transliteration: record.transliteration,
    createdAt: now,
    updatedAt: now,
  };
}

export const localContentRepository: ContentRepository = {
  async getBook() {
    return BOOK;
  },

  async getChapters() {
    return CHAPTERS;
  },

  async getChapter(chapterNumber) {
    if (!validateChapterNumber(chapterNumber)) return null;
    return CHAPTERS.find((chapter) => chapter.chapterNumber === chapterNumber) ?? null;
  },

  async getVerse(chapterNumber, verseNumber) {
    if (!validateChapterNumber(chapterNumber) || !validateVerseNumber(verseNumber)) {
      return null;
    }

    const record = localVerses.find(
      (verse) =>
        verse.chapterNumber === chapterNumber &&
        verse.verseNumber === verseNumber,
    );

    return record ? toVerse(record) : null;
  },

  async getChapterVerses(chapterNumber) {
    if (!validateChapterNumber(chapterNumber)) return [];

    return localVerses
      .filter((verse) => verse.chapterNumber === chapterNumber)
      .sort((a, b) => a.verseNumber - b.verseNumber)
      .map(toVerse);
  },

  async getTranslations(verseId, language) {
    const managed = await getManagedPublishedTranslation(verseId, language);
    if (managed) return [managed];
    const records = translationData[language] as readonly LocalTranslationRecord[];
    return records
      .filter((record) => record.verseId === verseId && record.language === language && record.reviewStatus === "PUBLISHED")
      .map(toTranslation);
  },
};

export const contentRepository = localContentRepository;

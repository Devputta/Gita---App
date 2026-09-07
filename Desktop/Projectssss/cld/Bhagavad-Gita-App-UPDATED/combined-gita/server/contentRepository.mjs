import { PrismaClient, LanguageCode } from "@prisma/client";

const prisma = new PrismaClient();

export async function getBook() {
  return prisma.book.findUnique({ where: { id: "gita-001" } });
}

export async function getChapters() {
  return prisma.chapter.findMany({
    where: { bookId: "gita-001" },
    orderBy: { chapterNumber: "asc" },
  });
}

export async function getChapter(chapterNumber) {
  return prisma.chapter.findUnique({
    where: {
      bookId_chapterNumber: {
        bookId: "gita-001",
        chapterNumber,
      },
    },
    include: { verses: { orderBy: { verseNumber: "asc" } } },
  });
}

export async function getVerse(chapterNumber, verseNumber) {
  return prisma.verse.findFirst({
    where: {
      chapter: { bookId: "gita-001", chapterNumber },
      verseNumber,
    },
    include: {
      translations: {
        where: { language: { in: [LanguageCode.KANNADA, LanguageCode.HINDI, LanguageCode.ENGLISH] } },
      },
      commentaries: true,
      audio: true,
    },
  });
}

export async function getTranslations(verseId, language) {
  return prisma.translation.findMany({
    where: { verseId, language },
  });
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

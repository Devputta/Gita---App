import { PrismaClient, LanguageCode } from "@prisma/client";

const prisma = new PrismaClient();

const EXPECTED_VERSE_COUNTS = [
  47, 72, 43, 42, 29, 47, 30, 28, 34,
  42, 55, 20, 34, 27, 20, 24, 28, 78,
];

const languages = [
  { code: LanguageCode.SANSKRIT, displayName: "Sanskrit", nativeName: "संस्कृतम्" },
  { code: LanguageCode.KANNADA, displayName: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: LanguageCode.HINDI, displayName: "Hindi", nativeName: "हिन्दी" },
  { code: LanguageCode.ENGLISH, displayName: "English", nativeName: "English" },
];

async function main() {
  for (const language of languages) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: language,
      create: language,
    });
  }

  const book = await prisma.book.upsert({
    where: { id: "gita-001" },
    update: {},
    create: {
      id: "gita-001",
      title: "Bhagavad Gita",
      titleSanskrit: "श्रीमद्भगवद्गीता",
      attribution: "Traditionally attributed to Maharshi Vedavyasa",
      description: "A dialogue between Bhagavan Sri Krishna and Arjuna.",
    },
  });

  for (let chapterNumber = 1; chapterNumber <= 18; chapterNumber += 1) {
    await prisma.chapter.upsert({
      where: { bookId_chapterNumber: { bookId: book.id, chapterNumber } },
      update: { verseCount: EXPECTED_VERSE_COUNTS[chapterNumber - 1] },
      create: {
        bookId: book.id,
        chapterNumber,
        verseCount: EXPECTED_VERSE_COUNTS[chapterNumber - 1],
      },
    });
  }

  console.log("Structural seed complete: 1 book, 18 chapters, 4 languages.");
  console.log("No Sanskrit verses or translations were inserted by this seed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());

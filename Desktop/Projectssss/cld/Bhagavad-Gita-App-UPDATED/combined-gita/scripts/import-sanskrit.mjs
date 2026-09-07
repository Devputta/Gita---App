import { PrismaClient } from "@prisma/client";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SOURCE_URL =
  "https://raw.githubusercontent.com/gita/gita/main/data/verse.json";

const EXPECTED_COUNTS = [
  47, 72, 43, 42, 29, 47, 30, 28, 34,
  42, 55, 20, 34, 27, 20, 24, 28, 78,
];

const prisma = new PrismaClient();

function normalizeText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\s+$/u, "")
    .trim();
}

function stripSourceVerseMarker(text) {
  // Keep all Devanagari content and punctuation; only remove the trailing
  // source numbering marker such as ।।2.47।।.
  return normalizeText(text).replace(/(?:\s*)[॥|।]{1,2}\s*\d+\.\d+\s*[॥|।]{1,2}\s*$/u, "");
}

function normalizeSourceVerses(source) {
  if (!Array.isArray(source)) {
    throw new Error("Source data is not an array.");
  }

  const normalized = [];

  for (const item of source) {
    if (
      typeof item?.chapter_number !== "number" ||
      typeof item?.verse_number !== "number" ||
      typeof item?.text !== "string"
    ) {
      throw new Error("Source contains a malformed verse record.");
    }

    let verseNumber = item.verse_number;

    // The selected public dataset contains an optional Chapter 13.1.
    // The standard 700-verse edition omits it.
    if (item.chapter_number === 13 && item.verse_number === 1) {
      continue;
    }

    if (item.chapter_number === 13 && item.verse_number > 1) {
      verseNumber -= 1;
    }

    normalized.push({
      chapterNumber: item.chapter_number,
      verseNumber,
      sanskrit: stripSourceVerseMarker(item.text),
      transliteration:
        typeof item.transliteration === "string"
          ? normalizeText(item.transliteration)
          : null,
    });
  }

  return normalized;
}

function validateVerses(verses) {
  if (verses.length !== 700) {
    throw new Error(`Expected 700 verses after normalization; got ${verses.length}.`);
  }

  const chapterNumbers = [...new Set(verses.map((v) => v.chapterNumber))].sort(
    (a, b) => a - b,
  );
  if (chapterNumbers.length !== 18 || chapterNumbers.some((n, i) => n !== i + 1)) {
    throw new Error("Expected exactly chapters 1 through 18.");
  }

  const seen = new Set();

  for (const verse of verses) {
    if (!Number.isInteger(verse.chapterNumber) || verse.chapterNumber < 1 || verse.chapterNumber > 18) {
      throw new Error(`Invalid chapter number: ${verse.chapterNumber}`);
    }
    if (!Number.isInteger(verse.verseNumber) || verse.verseNumber < 1) {
      throw new Error(`Invalid verse number: ${verse.chapterNumber}.${verse.verseNumber}`);
    }
    if (!verse.sanskrit.trim()) {
      throw new Error(`Missing Sanskrit for ${verse.chapterNumber}.${verse.verseNumber}`);
    }

    const key = `${verse.chapterNumber}.${verse.verseNumber}`;
    if (seen.has(key)) {
      throw new Error(`Duplicate verse: ${key}`);
    }
    seen.add(key);
  }

  for (let chapter = 1; chapter <= 18; chapter += 1) {
    const chapterVerses = verses
      .filter((v) => v.chapterNumber === chapter)
      .sort((a, b) => a.verseNumber - b.verseNumber);

    const expectedCount = EXPECTED_COUNTS[chapter - 1];
    if (chapterVerses.length !== expectedCount) {
      throw new Error(
        `Chapter ${chapter}: expected ${expectedCount} verses; got ${chapterVerses.length}.`,
      );
    }

    chapterVerses.forEach((verse, index) => {
      const expectedNumber = index + 1;
      if (verse.verseNumber !== expectedNumber) {
        throw new Error(
          `Chapter ${chapter}: expected verse ${expectedNumber}, got ${verse.verseNumber}.`,
        );
      }
    });
  }

  return true;
}

async function fetchSource() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Unable to download source: HTTP ${response.status}`);
  }
  return response.json();
}

async function main() {
  const source = await fetchSource();
  const verses = normalizeSourceVerses(source);
  validateVerses(verses);

  const dataPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../data/sanskrit/verses.json",
  );
  await writeFile(dataPath, `${JSON.stringify(verses, null, 2)}\n`, "utf8");

  const book = await prisma.book.findUnique({ where: { id: "gita-001" } });
  if (!book) {
    throw new Error('Book "gita-001" is missing. Run "npm run db:seed" first.');
  }

  await prisma.$transaction(
    async (tx) => {
      for (let chapterNumber = 1; chapterNumber <= 18; chapterNumber += 1) {
      const chapter = await tx.chapter.findUnique({
        where: {
          bookId_chapterNumber: {
            bookId: book.id,
            chapterNumber,
          },
        },
      });

      if (!chapter) {
        throw new Error(`Chapter ${chapterNumber} is missing. Run "npm run db:seed".`);
      }

      const chapterVerses = verses.filter(
        (verse) => verse.chapterNumber === chapterNumber,
      );

      await tx.chapter.update({
        where: { id: chapter.id },
        data: { verseCount: chapterVerses.length },
      });

      for (const verse of chapterVerses) {
        const stableId = `gita-001-chapter-${String(chapterNumber).padStart(2, "0")}-verse-${String(verse.verseNumber).padStart(3, "0")}`;

        await tx.verse.upsert({
          where: { id: stableId },
          update: {
            chapterId: chapter.id,
            verseNumber: verse.verseNumber,
            sanskrit: verse.sanskrit,
            transliteration: verse.transliteration,
          },
          create: {
            id: stableId,
            chapterId: chapter.id,
            verseNumber: verse.verseNumber,
            sanskrit: verse.sanskrit,
            transliteration: verse.transliteration,
          },
        });
      }
      }
    },
    { timeout: 120_000, maxWait: 20_000 },
  );

  console.log("Sanskrit import completed successfully.");
  console.log("Validated: 18 chapters / 700 verses / no duplicates / no gaps.");
  console.log("No translations were imported.");
}

main()
  .catch((error) => {
    console.error("Sanskrit import failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

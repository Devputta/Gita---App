CREATE TYPE "LanguageCode" AS ENUM ('SANSKRIT', 'KANNADA', 'HINDI', 'ENGLISH');
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'AI_GENERATED', 'REVIEW_REQUIRED', 'HUMAN_REVIEWED', 'PUBLISHED');
CREATE TYPE "SourceKind" AS ENUM ('ORIGINAL_SANSKRIT', 'TRANSLATION', 'COMMENTARY', 'AI_EXPLANATION', 'AUDIO');

CREATE TABLE "Source" (
  "id" TEXT NOT NULL,
  "kind" "SourceKind" NOT NULL,
  "title" TEXT NOT NULL,
  "creator" TEXT,
  "publisher" TEXT,
  "license" TEXT,
  "sourceUrl" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Language" (
  "code" "LanguageCode" NOT NULL,
  "displayName" TEXT NOT NULL,
  "nativeName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Language_pkey" PRIMARY KEY ("code")
);

CREATE TABLE "Book" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "titleSanskrit" TEXT NOT NULL,
  "attribution" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Chapter" (
  "id" TEXT NOT NULL,
  "bookId" TEXT NOT NULL,
  "chapterNumber" INTEGER NOT NULL,
  "titleSanskrit" TEXT,
  "titleKannada" TEXT,
  "titleHindi" TEXT,
  "titleEnglish" TEXT,
  "description" TEXT,
  "verseCount" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Verse" (
  "id" TEXT NOT NULL,
  "chapterId" TEXT NOT NULL,
  "verseNumber" INTEGER NOT NULL,
  "sanskrit" TEXT NOT NULL,
  "transliteration" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Verse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Translation" (
  "id" TEXT NOT NULL,
  "verseId" TEXT NOT NULL,
  "language" "LanguageCode" NOT NULL,
  "text" TEXT NOT NULL,
  "source" TEXT,
  "translator" TEXT,
  "publisher" TEXT,
  "license" TEXT,
  "sourceUrl" TEXT,
  "notes" TEXT,
  "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Commentary" (
  "id" TEXT NOT NULL,
  "verseId" TEXT NOT NULL,
  "language" "LanguageCode" NOT NULL,
  "text" TEXT NOT NULL,
  "source" TEXT,
  "author" TEXT,
  "license" TEXT,
  "sourceUrl" TEXT,
  "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Commentary_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Audio" (
  "id" TEXT NOT NULL,
  "verseId" TEXT NOT NULL,
  "language" "LanguageCode" NOT NULL,
  "uri" TEXT NOT NULL,
  "durationMs" INTEGER,
  "source" TEXT,
  "license" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "externalAuthId" TEXT,
  "email" TEXT,
  "displayName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Bookmark" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "verseId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReadingProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "verseId" TEXT,
  "chapterId" TEXT,
  "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Chapter_bookId_chapterNumber_key" ON "Chapter"("bookId","chapterNumber");
CREATE INDEX "Chapter_chapterNumber_idx" ON "Chapter"("chapterNumber");
CREATE UNIQUE INDEX "Verse_chapterId_verseNumber_key" ON "Verse"("chapterId","verseNumber");
CREATE INDEX "Verse_chapterId_idx" ON "Verse"("chapterId");
CREATE INDEX "Verse_verseNumber_idx" ON "Verse"("verseNumber");
CREATE UNIQUE INDEX "Translation_verseId_language_key" ON "Translation"("verseId","language");
CREATE INDEX "Translation_language_idx" ON "Translation"("language");
CREATE INDEX "Translation_verseId_idx" ON "Translation"("verseId");
CREATE INDEX "Commentary_verseId_idx" ON "Commentary"("verseId");
CREATE INDEX "Commentary_language_idx" ON "Commentary"("language");
CREATE INDEX "Audio_verseId_idx" ON "Audio"("verseId");
CREATE INDEX "Audio_language_idx" ON "Audio"("language");
CREATE UNIQUE INDEX "User_externalAuthId_key" ON "User"("externalAuthId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Bookmark_userId_verseId_key" ON "Bookmark"("userId","verseId");
CREATE INDEX "Bookmark_verseId_idx" ON "Bookmark"("verseId");
CREATE UNIQUE INDEX "ReadingProgress_userId_chapterId_key" ON "ReadingProgress"("userId","chapterId");
CREATE INDEX "ReadingProgress_verseId_idx" ON "ReadingProgress"("verseId");

ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Verse" ADD CONSTRAINT "Verse_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_language_fkey" FOREIGN KEY ("language") REFERENCES "Language"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Commentary" ADD CONSTRAINT "Commentary_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Audio" ADD CONSTRAINT "Audio_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Translation" ADD CONSTRAINT "Translation_language_not_sanskrit_chk" CHECK ("language" <> 'SANSKRIT');

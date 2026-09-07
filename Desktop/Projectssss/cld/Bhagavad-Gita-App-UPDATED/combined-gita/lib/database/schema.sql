-- Day 3 structural schema for Supabase/PostgreSQL.
-- No scripture or translation text is seeded here.

create table if not exists books (
  id text primary key,
  title text not null,
  title_sanskrit text not null,
  attribution text not null,
  description text not null
);

create table if not exists chapters (
  id text primary key,
  book_id text not null references books(id) on delete cascade,
  chapter_number integer not null check (chapter_number between 1 and 18),
  title_sanskrit text,
  title_kannada text,
  title_hindi text,
  title_english text,
  description text,
  verse_count integer,
  unique (book_id, chapter_number)
);

create table if not exists verses (
  id text primary key,
  chapter_id text not null references chapters(id) on delete cascade,
  verse_number integer not null check (verse_number > 0),
  sanskrit text,
  transliteration text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapter_id, verse_number)
);

create table if not exists translations (
  id text primary key,
  verse_id text not null references verses(id) on delete cascade,
  language text not null check (language in ('KANNADA', 'HINDI', 'ENGLISH')),
  text text,
  source text,
  translator text,
  publisher text,
  license text,
  source_url text,
  notes text,
  review_status text not null default 'DRAFT'
    check (review_status in ('DRAFT', 'AI_GENERATED', 'REVIEW_REQUIRED', 'HUMAN_REVIEWED', 'PUBLISHED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (verse_id, language)
);

create table if not exists sources (
  id text primary key,
  kind text not null check (kind in ('ORIGINAL_SANSKRIT', 'TRANSLATION', 'COMMENTARY', 'AI_EXPLANATION', 'AUDIO')),
  title text not null,
  creator text,
  publisher text,
  license text,
  source_url text,
  notes text
);

create index if not exists chapters_chapter_number_idx on chapters(chapter_number);
create index if not exists verses_chapter_id_idx on verses(chapter_id);
create index if not exists verses_verse_number_idx on verses(verse_number);
create index if not exists translations_language_idx on translations(language);
create index if not exists translations_verse_id_idx on translations(verse_id);

-- Day 16 PostgreSQL full-text search foundation.
-- When translations are populated, expose a server search endpoint that indexes
-- Sanskrit + published translations and queries this tsvector with a GIN index.
-- The Expo client currently uses the same repository interface with a local fallback.
-- Example production shape:
--   ALTER TABLE "Verse" ADD COLUMN search_document tsvector;
--   CREATE INDEX verse_search_document_gin ON "Verse" USING GIN (search_document);
-- Populate search_document from verse.sanskrit and PUBLISHED Translation.text.

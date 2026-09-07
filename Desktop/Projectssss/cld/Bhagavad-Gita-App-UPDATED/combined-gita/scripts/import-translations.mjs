/**
 * Bulk-imports translation records into data/translations/<language>.json,
 * the same local content source the app reads from at runtime.
 *
 * This does NOT publish anything by default. New/updated records land at
 * reviewStatus "REVIEW_REQUIRED" so a human still has to move them to
 * "HUMAN_REVIEWED" and then "PUBLISHED" (via the app's own workflow rules,
 * mirrored below) before readers ever see them -- consistent with
 * PRODUCTION-CHECKLIST.md ("Every published translation has source, license
 * and review status").
 *
 * Usage:
 *   node scripts/import-translations.mjs <english|hindi|kannada> <input.json> [--publish]
 *
 * Input file: a JSON array of records shaped like:
 *   {
 *     "chapterNumber": 2,
 *     "verseNumber": 47,
 *     "text": "...",
 *     "translator": "Jane Doe",
 *     "source": "Sacred Books of the East, vol. 8 (1882)",
 *     "license": "Public domain",
 *     "sourceUrl": "https://...",        // optional
 *     "notes": "..."                     // optional
 *   }
 *
 * text, translator, source and license are required and must be non-empty --
 * this is a deliberate guard rail so nothing untraceable slips into the app.
 * Pass --publish only after you have actually reviewed the content; without
 * it, records are written as REVIEW_REQUIRED and stay invisible to readers.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const LANGUAGES = ["english", "hindi", "kannada"];
const LANGUAGE_CODE = { english: "ENGLISH", hindi: "HINDI", kannada: "KANNADA" };

function verseId(chapterNumber, verseNumber) {
  return `gita-001-chapter-${String(chapterNumber).padStart(2, "0")}-verse-${String(verseNumber).padStart(3, "0")}`;
}

function requireNonEmptyString(value, field, where) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${where}: "${field}" is required and must be a non-empty string.`);
  }
  return value.trim();
}

async function loadSanskritIndex(repoRoot) {
  const raw = await readFile(path.join(repoRoot, "data/sanskrit/verses.json"), "utf8");
  const verses = JSON.parse(raw);
  const valid = new Set(verses.map((v) => `${v.chapterNumber}.${v.verseNumber}`));
  return valid;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const publish = args.includes("--publish");
  const positional = args.filter((a) => a !== "--publish");
  const [language, inputPath] = positional;
  if (!language || !LANGUAGES.includes(language)) {
    throw new Error(`First argument must be one of: ${LANGUAGES.join(", ")}`);
  }
  if (!inputPath) {
    throw new Error("Second argument must be a path to the input JSON file.");
  }
  return { language, inputPath, publish };
}

async function main() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const { language, inputPath, publish } = parseArgs(process.argv);
  const languageCode = LANGUAGE_CODE[language];

  const validVerseKeys = await loadSanskritIndex(repoRoot);

  const inputRaw = await readFile(path.resolve(inputPath), "utf8");
  const input = JSON.parse(inputRaw);
  if (!Array.isArray(input)) throw new Error("Input file must contain a JSON array.");

  const outputPath = path.join(repoRoot, `data/translations/${language}.json`);
  const existingRaw = await readFile(outputPath, "utf8").catch(() => "[]");
  const existing = JSON.parse(existingRaw);
  const byKey = new Map(existing.map((rec) => [`${rec.verseId}|${rec.language}`, rec]));

  const now = new Date().toISOString();
  let created = 0;
  let updated = 0;
  const touchedChapters = new Set();
  const seenInThisFile = new Set();

  for (const [i, record] of input.entries()) {
    const where = `Record #${i + 1}`;
    if (!Number.isInteger(record.chapterNumber) || record.chapterNumber < 1 || record.chapterNumber > 18) {
      throw new Error(`${where}: "chapterNumber" must be an integer 1-18.`);
    }
    if (!Number.isInteger(record.verseNumber) || record.verseNumber < 1) {
      throw new Error(`${where}: "verseNumber" must be a positive integer.`);
    }
    const key = `${record.chapterNumber}.${record.verseNumber}`;
    if (!validVerseKeys.has(key)) {
      throw new Error(`${where}: no Sanskrit verse ${key} exists in data/sanskrit/verses.json.`);
    }
    if (seenInThisFile.has(key)) {
      throw new Error(`${where}: duplicate verse ${key} within the input file.`);
    }
    seenInThisFile.add(key);

    const text = requireNonEmptyString(record.text, "text", where);
    const translator = requireNonEmptyString(record.translator, "translator", where);
    const source = requireNonEmptyString(record.source, "source", where);
    const license = requireNonEmptyString(record.license, "license", where);

    const id = verseId(record.chapterNumber, record.verseNumber);
    const mapKey = `${id}|${languageCode}`;
    const prior = byKey.get(mapKey);

    const next = {
      id: prior?.id ?? `${language}-${id}`,
      verseId: id,
      language: languageCode,
      text,
      translator,
      source,
      publisher: typeof record.publisher === "string" ? record.publisher.trim() || null : null,
      license,
      sourceUrl: typeof record.sourceUrl === "string" ? record.sourceUrl.trim() || null : null,
      notes: typeof record.notes === "string" ? record.notes.trim() || null : null,
      reviewStatus: publish ? "PUBLISHED" : "REVIEW_REQUIRED",
      createdAt: prior?.createdAt ?? now,
      updatedAt: now,
    };

    if (prior) updated += 1; else created += 1;
    byKey.set(mapKey, next);
    touchedChapters.add(record.chapterNumber);
  }

  const merged = [...byKey.values()].sort((a, b) => a.verseId.localeCompare(b.verseId));
  await writeFile(outputPath, `${JSON.stringify(merged, null, 2)}\n`, "utf8");

  console.log(`Imported into ${path.relative(repoRoot, outputPath)}`);
  console.log(`  ${created} new, ${updated} updated, ${merged.length} total ${language} records.`);
  console.log(`  Status: ${publish ? "PUBLISHED (visible to readers immediately)" : "REVIEW_REQUIRED (not yet visible to readers)"}`);
  console.log(`  Chapters touched: ${[...touchedChapters].sort((a, b) => a - b).join(", ")}`);
  if (!publish) {
    console.log('  Next step: review each record, then re-run with the app\'s admin workflow');
    console.log('  (or re-run this script with --publish once you have reviewed the content).');
  }
}

main().catch((error) => {
  console.error("Translation import failed:", error.message);
  process.exitCode = 1;
});

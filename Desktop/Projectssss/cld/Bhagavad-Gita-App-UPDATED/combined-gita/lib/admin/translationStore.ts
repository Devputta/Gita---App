import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Language } from "@/constants/languages";
import type { ReviewStatus, Translation } from "@/types/gita";

export type ManagedTranslation = Translation & { reviewStatus: ReviewStatus; sourceUrl?: string | null };
const KEY = "admin.translations.v1";

async function read(): Promise<ManagedTranslation[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as ManagedTranslation[]; } catch { return []; }
}
async function write(items: ManagedTranslation[]) { await AsyncStorage.setItem(KEY, JSON.stringify(items)); }

export async function getManagedTranslation(verseId: string, language: Language): Promise<ManagedTranslation | null> {
  return (await read()).find((item) => item.verseId === verseId && item.language === language) ?? null;
}
export async function listManagedTranslations(): Promise<ManagedTranslation[]> { return read(); }
export async function saveManagedTranslation(input: Omit<ManagedTranslation, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<ManagedTranslation> {
  const now = new Date().toISOString(); const items = await read();
  const existingIndex = items.findIndex((item) => item.verseId === input.verseId && item.language === input.language);
  const next: ManagedTranslation = { ...input, id: input.id ?? `local-translation-${input.verseId}-${input.language}`, createdAt: existingIndex >= 0 ? items[existingIndex]!.createdAt : now, updatedAt: now };
  if (existingIndex >= 0) items[existingIndex] = next; else items.push(next);
  await write(items); return next;
}
export async function updateTranslationStatus(verseId: string, language: Language, status: ReviewStatus): Promise<ManagedTranslation | null> {
  const current = await getManagedTranslation(verseId, language); if (!current) return null;
  if (status === "PUBLISHED" && current.reviewStatus !== "HUMAN_REVIEWED") throw new Error("Only Human Reviewed translations can be published.");
  return saveManagedTranslation({ ...current, reviewStatus: status });
}

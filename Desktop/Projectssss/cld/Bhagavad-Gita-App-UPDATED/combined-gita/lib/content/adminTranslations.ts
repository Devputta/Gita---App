import { getManagedTranslation } from "@/lib/admin/translationStore";
import type { Language } from "@/constants/languages";
import type { Translation } from "@/types/gita";
export async function getManagedPublishedTranslation(verseId: string, language: Language): Promise<Translation | null> {
  const item = await getManagedTranslation(verseId, language);
  return item?.reviewStatus === "PUBLISHED" ? item : null;
}

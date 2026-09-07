import AsyncStorage from "@react-native-async-storage/async-storage";

export type ReadingProgressRecord = { chapterNumber: number; verseNumber: number; updatedAt: string };
const KEY = "gita.readingProgress.v1";

export const readingProgressStore = {
  async get(): Promise<ReadingProgressRecord | null> {
    const raw = await AsyncStorage.getItem(KEY); if (!raw) return null;
    try { return JSON.parse(raw) as ReadingProgressRecord; } catch { return null; }
  },
  async set(chapterNumber: number, verseNumber: number) {
    await AsyncStorage.setItem(KEY, JSON.stringify({ chapterNumber, verseNumber, updatedAt: new Date().toISOString() }));
  },
};

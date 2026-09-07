import AsyncStorage from "@react-native-async-storage/async-storage";
export type ReaderPreferences = { fontSize: number; lineHeight: number; letterSpacing: number; highContrast: boolean; };
export const DEFAULT_READER_PREFERENCES: ReaderPreferences = { fontSize: 20, lineHeight: 34, letterSpacing: 0, highContrast: false };
const KEY = "settings.readerPreferences";
export async function getReaderPreferences(): Promise<ReaderPreferences> { const raw = await AsyncStorage.getItem(KEY); if (!raw) return DEFAULT_READER_PREFERENCES; try { return { ...DEFAULT_READER_PREFERENCES, ...(JSON.parse(raw) as Partial<ReaderPreferences>) }; } catch { return DEFAULT_READER_PREFERENCES; } }
export async function saveReaderPreferences(value: ReaderPreferences) { await AsyncStorage.setItem(KEY, JSON.stringify(value)); }

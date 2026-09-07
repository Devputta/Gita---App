import AsyncStorage from "@react-native-async-storage/async-storage";

export type BookmarkRecord = {
  id: string;
  userId: string;
  verseId: string;
  chapterNumber: number;
  verseNumber: number;
  language: "SANSKRIT" | "KANNADA" | "HINDI" | "ENGLISH";
  createdAt: string;
};

const KEY = "gita.bookmarks.v1";
const ANONYMOUS_USER = "anonymous-local-user";

async function read(): Promise<BookmarkRecord[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as BookmarkRecord[]; } catch { return []; }
}
async function write(items: BookmarkRecord[]) { await AsyncStorage.setItem(KEY, JSON.stringify(items)); }

export const bookmarkStore = {
  async list() { return (await read()).sort((a,b) => b.createdAt.localeCompare(a.createdAt)); },
  async isBookmarked(verseId: string) { return (await read()).some(x => x.userId === ANONYMOUS_USER && x.verseId === verseId); },
  async add(input: Omit<BookmarkRecord, "id" | "userId" | "createdAt">) {
    const items = await read();
    if (items.some(x => x.userId === ANONYMOUS_USER && x.verseId === input.verseId)) return;
    items.push({ ...input, id: `bookmark-${Date.now()}-${Math.random().toString(36).slice(2)}`, userId: ANONYMOUS_USER, createdAt: new Date().toISOString() });
    await write(items);
  },
  async remove(verseId: string) { await write((await read()).filter(x => !(x.userId === ANONYMOUS_USER && x.verseId === verseId))); },
};

export const BOOKMARK_STORAGE_USER_ID = ANONYMOUS_USER;

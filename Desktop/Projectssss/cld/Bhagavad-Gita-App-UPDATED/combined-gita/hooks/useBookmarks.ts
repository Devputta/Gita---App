import { useCallback, useEffect, useState } from "react";
import { bookmarkStore, type BookmarkRecord } from "@/lib/bookmarks/store";
export function useBookmarks(verseId?: string) {
  const [bookmarked, setBookmarked] = useState(false);
  const refresh = useCallback(async () => { if (verseId) setBookmarked(await bookmarkStore.isBookmarked(verseId)); }, [verseId]);
  useEffect(() => { void refresh(); }, [refresh]);
  const toggle = useCallback(async (input?: Omit<BookmarkRecord, "id"|"userId"|"createdAt">) => { if (!verseId || !input) return; if (await bookmarkStore.isBookmarked(verseId)) await bookmarkStore.remove(verseId); else await bookmarkStore.add(input); await refresh(); }, [verseId, refresh]);
  return { bookmarked, toggle, refresh };
}

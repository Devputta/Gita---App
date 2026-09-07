
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";

import { AppHeader } from "@/components/layout/AppHeader";
import { ChapterCard } from "@/components/chapter/ChapterCard";
import { Screen } from "@/components/layout/Screen";
import { getChapters } from "@/lib/content/service";
import type { Chapter } from "@/types/gita";
import { colors, spacing, typography } from "@/constants/theme";

export default function ChaptersScreen() {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    void getChapters().then(setChapters);
  }, []);

  return (
    <Screen scroll={false}>
      <AppHeader
        title="18 Chapters"
        subtitle="One Bhagavad Gita · structural content only"
      />

      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChapterCard
            chapter={item}
            onPress={() =>
              router.push(`/gita/chapter/${item.chapterNumber}`)
            }
          />
        )}
        ListFooterComponent={
          <Text style={styles.footer}>
            Chapter names and verse counts remain pending source
            verification.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  footer: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 20,
    marginTop: spacing.md,
  },
});


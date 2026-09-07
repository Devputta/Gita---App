import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Chapter } from "@/types/gita";
import { colors, radii, spacing, typography } from "@/constants/theme";

export function ChapterCard({ chapter, onPress }: { chapter: Chapter; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open Chapter ${chapter.chapterNumber}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.number}>
        <Text style={styles.numberText}>{chapter.chapterNumber}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Chapter {chapter.chapterNumber}</Text>
        <Text style={styles.meta}>
          {chapter.verseCount == null ? "Verse count pending verification" : `${chapter.verseCount} verses`}
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 82,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  number: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.purple,
    alignItems: "center", justifyContent: "center",
  },
  numberText: { color: colors.gold, fontSize: 18, fontWeight: "800" },
  body: { flex: 1 },
  title: { color: colors.ink, fontSize: typography.body, fontWeight: "700" },
  meta: { color: colors.muted, fontSize: typography.small, marginTop: 4 },
  arrow: { color: colors.gold, fontSize: 30 },
});

import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";

export function ReaderHeader({ chapterNumber, verseNumber, chapterTitle }: {
  chapterNumber: number;
  verseNumber: number;
  chapterTitle?: string | null;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>BHAGAVAD GITA · READER</Text>
      <Text style={styles.title}>Chapter {chapterNumber}</Text>
      <Text style={styles.chapterTitle}>{chapterTitle ?? `Chapter ${chapterNumber}`}</Text>
      <Text style={styles.verse}>Verse {verseNumber}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  eyebrow: { color: colors.saffron, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: typography.h1, fontWeight: "800", marginTop: 5 },
  chapterTitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 3 },
  verse: { color: colors.saffron, fontSize: 15, fontWeight: "700", marginTop: spacing.sm },
});

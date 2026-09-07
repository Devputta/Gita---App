import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "@/constants/theme";

export function VerseCard() {
  return (
    <View style={styles.card} accessible accessibilityLabel="Sample reader preview. Not scripture.">
      <View style={styles.badge}>
        <Text style={styles.badgeText}>SAMPLE / DEMO</Text>
      </View>
      <Text style={styles.heading}>Chapter 2 · Verse 47</Text>
      <Text style={styles.sample}>
        Reader preview only. Verified Sanskrit and translation content will be added after source verification.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.navy, borderRadius: radii.lg, padding: spacing.lg },
  badge: {
    alignSelf: "flex-start", paddingHorizontal: spacing.sm, paddingVertical: 5,
    borderRadius: radii.pill, backgroundColor: colors.saffron,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  heading: { color: colors.gold, fontSize: typography.h2, fontWeight: "700", marginTop: spacing.md },
  sample: { color: colors.ivory, fontSize: typography.body, lineHeight: 25, marginTop: spacing.sm },
});

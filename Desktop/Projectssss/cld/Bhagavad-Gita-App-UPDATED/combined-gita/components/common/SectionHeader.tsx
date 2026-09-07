import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";

export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  title: { color: colors.ink, fontSize: typography.h2, fontWeight: "700" },
  line: { height: 1, backgroundColor: colors.border, flex: 1 },
});

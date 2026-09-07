import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.container} accessible accessibilityLabel={`${title}. ${message}`}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, alignItems: "center" },
  title: { fontSize: typography.h2, fontWeight: "700", color: colors.ink, marginBottom: spacing.sm },
  message: { color: colors.muted, fontSize: typography.body, textAlign: "center", lineHeight: 24 },
});

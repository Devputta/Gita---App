import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@/constants/theme";

export type ReaderMode = "SINGLE" | "PARALLEL";

export function ReaderModeSelector({ value, onChange }: {
  value: ReaderMode;
  onChange: (mode: ReaderMode) => void;
}) {
  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {(["SINGLE", "PARALLEL"] as const).map((mode) => {
        const selected = value === mode;
        return (
          <Pressable key={mode} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => onChange(mode)} style={[styles.option, selected && styles.selected]}>
            <Text style={[styles.text, selected && styles.selectedText]}>
              {mode === "SINGLE" ? "Single Language" : "Parallel"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: spacing.xs, marginTop: spacing.sm },
  option: { minHeight: 42, paddingHorizontal: spacing.md, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.paper, justifyContent: "center" },
  selected: { backgroundColor: colors.navy, borderColor: colors.navy },
  text: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  selectedText: { color: colors.ivory },
});

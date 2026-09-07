import { Pressable, StyleSheet, Text, View } from "react-native";
import type { AppearancePreference } from "@/hooks/useThemePreference";
import { colors, radii, spacing } from "@/constants/theme";

const options: AppearancePreference[] = ["light", "dark", "system"];

export function ThemeSelector({ value, onChange }: { value: AppearancePreference; onChange: (value: AppearancePreference) => void }) {
  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`Appearance ${option}`}
            onPress={() => onChange(option)}
            style={[styles.option, selected && styles.selected]}
          >
            <Text style={[styles.text, selected && styles.selectedText]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", gap: spacing.sm },
  option: { minHeight: 44, paddingHorizontal: spacing.md, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, justifyContent: "center" },
  selected: { backgroundColor: colors.navy, borderColor: colors.navy },
  text: { color: colors.ink },
  selectedText: { color: colors.ivory, fontWeight: "700" },
});

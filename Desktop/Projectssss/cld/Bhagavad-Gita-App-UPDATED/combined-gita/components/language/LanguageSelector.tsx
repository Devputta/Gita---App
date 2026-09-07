import { Pressable, StyleSheet, Text, View } from "react-native";
import { LANGUAGE_LABELS, type Language, SUPPORTED_LANGUAGES } from "@/constants/languages";
import { colors, radii, spacing } from "@/constants/theme";

interface Props {
  value: Language;
  onChange: (language: Language) => void;
}

export function LanguageSelector({ value, onChange }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="radiogroup">
      {SUPPORTED_LANGUAGES.map((language) => {
        const selected = value === language;
        return (
          <Pressable
            key={language}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`Language ${LANGUAGE_LABELS[language]}`}
            onPress={() => onChange(language)}
            style={({ pressed }) => [
              styles.option,
              selected && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.text, selected && styles.selectedText]}>
              {LANGUAGE_LABELS[language]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  option: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    justifyContent: "center",
  },
  selected: { backgroundColor: colors.navy, borderColor: colors.navy },
  pressed: { opacity: 0.75 },
  text: { color: colors.ink, fontSize: 14 },
  selectedText: { color: colors.ivory, fontWeight: "700" },
});

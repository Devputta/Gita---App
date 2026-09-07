import { Pressable, StyleSheet, Text, View } from "react-native";
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type Language } from "@/constants/languages";
import { colors, radii, spacing } from "@/constants/theme";

export function LanguageSelector({ value, onChange }: {
  value: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <View accessibilityRole="radiogroup" style={styles.container}>
      {SUPPORTED_LANGUAGES.map((language) => {
        const selected = language === value;
        return (
          <Pressable key={language} accessibilityRole="radio"
            accessibilityState={{ selected }} onPress={() => onChange(language)}
            style={[styles.option, selected && styles.selected]}>
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
  container: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.md },
  option: { minHeight: 42, paddingHorizontal: spacing.md, borderRadius: radii.pill,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.paper, justifyContent: "center" },
  selected: { backgroundColor: colors.navy, borderColor: colors.navy },
  text: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  selectedText: { color: colors.ivory },
});

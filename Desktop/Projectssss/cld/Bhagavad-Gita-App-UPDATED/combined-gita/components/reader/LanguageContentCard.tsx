import { StyleSheet, Text, View } from "react-native";
import { LANGUAGE_LABELS, type Language } from "@/constants/languages";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { useReaderPreferences } from "@/hooks/useReaderPreferences";
import type { Translation } from "@/types/gita";

export function LanguageContentCard({ language, sanskrit, translation }: {
  language: Language;
  sanskrit: string;
  translation: Translation | null;
}) {
  const { value: prefs } = useReaderPreferences();
  const text = language === "SANSKRIT" ? sanskrit : translation?.text ?? null;
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{LANGUAGE_LABELS[language]}</Text>
      {text ? (
        <Text style={[styles.text, language === "SANSKRIT" && styles.sanskrit, language === "KANNADA" && styles.kannada, language === "HINDI" && styles.hindi, { fontSize: prefs.fontSize, lineHeight: prefs.lineHeight, letterSpacing: prefs.letterSpacing }]}>
          {text}
        </Text>
      ) : (
        <Text style={styles.empty}>No published {LANGUAGE_LABELS[language]} translation is available yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.saffron, fontSize: typography.small, fontWeight: "800", marginBottom: spacing.md },
  text: { color: colors.ink, fontSize: 18, lineHeight: 30 },
  sanskrit: { fontFamily: "Noto Sans Devanagari", fontSize: 23, lineHeight: 42, textAlign: "center" },
  kannada: { fontFamily: "Noto Sans Kannada", lineHeight: 34 },
  hindi: { fontFamily: "Noto Sans Devanagari", lineHeight: 32 },
  empty: { color: colors.muted, fontSize: typography.body, lineHeight: 23 },
});

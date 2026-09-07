import { StyleSheet, Text, View } from "react-native";
import type { Translation } from "@/types/gita";
import { LANGUAGE_LABELS, type Language } from "@/constants/languages";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { useReaderPreferences } from "@/hooks/useReaderPreferences";

export function TranslationPanel({ language, translation }: {
  language: Language;
  translation: Translation | null;
}) {
  const { value: prefs } = useReaderPreferences();
  if (language === "SANSKRIT") return null;
  const label = LANGUAGE_LABELS[language];
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      {translation?.text ? (
        <>
          <Text accessibilityRole="text" style={[styles.text, language === "KANNADA" ? styles.kannada : language === "HINDI" ? styles.hindi : null, { fontSize: prefs.fontSize, lineHeight: prefs.lineHeight, letterSpacing: prefs.letterSpacing }]}>
            {translation.text}
          </Text>
          <Text style={styles.meta}>
            Source: {translation.source ?? "Not specified"} · Translator: {translation.translator ?? "Not specified"}
          </Text>
        </>
      ) : (
        <Text style={styles.empty}>
          No published {label} translation is available for this verse yet.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.md, padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.saffron, fontSize: typography.small, fontWeight: "800", marginBottom: spacing.sm },
  text: { color: colors.ink, fontSize: 19, lineHeight: 32 },
  kannada: { fontFamily: "Noto Sans Kannada", fontSize: 19, lineHeight: 34 },
  hindi: { fontFamily: "Noto Sans Devanagari", fontSize: 19, lineHeight: 32 },
  meta: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: spacing.sm },
  empty: { color: colors.muted, fontSize: typography.body, lineHeight: 24 },
});

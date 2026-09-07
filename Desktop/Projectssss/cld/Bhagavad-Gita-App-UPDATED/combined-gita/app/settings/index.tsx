import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { AppHeader } from "@/components/layout/AppHeader";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useLocalSetting } from "@/hooks/useLocalSetting";
import { useThemePreference } from "@/hooks/useThemePreference";
import type { Language } from "@/constants/languages";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { APP_NAME, APP_SANSKRIT_NAME, ATTRIBUTION, DESCRIPTION } from "@/constants/app";

export default function SettingsScreen() {
  const [language, setLanguage] = useLocalSetting<Language>("settings.language", "SANSKRIT");
  const { preference, setPreference } = useThemePreference();

  return (
    <Screen>
      <AppHeader title="Settings" subtitle="Local preferences for this device" />

      <SectionHeader title="Language" />
      <LanguageSelector value={language} onChange={setLanguage} />

      <View style={styles.section}>
        <SectionHeader title="Appearance" />
        <ThemeSelector value={preference} onChange={setPreference} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="About Bhagavad Gita" />
        <View style={styles.about}>
          <Text style={styles.sanskrit}>{APP_SANSKRIT_NAME}</Text>
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.attribution}>{ATTRIBUTION}</Text>
          <Text style={styles.description}>{DESCRIPTION}</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl },
  about: { padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.border },
  sanskrit: { color: colors.purple, fontSize: 24, fontWeight: "700" },
  title: { color: colors.ink, fontSize: typography.h2, fontWeight: "800", marginTop: 4 },
  attribution: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: spacing.md },
  description: { color: colors.ink, fontSize: typography.body, lineHeight: 24, marginTop: spacing.sm },
});

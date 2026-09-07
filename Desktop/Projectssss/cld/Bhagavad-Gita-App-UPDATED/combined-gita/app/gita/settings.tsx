import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { AppHeader } from "@/components/layout/AppHeader";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useLocalSetting } from "@/hooks/useLocalSetting";
import { useThemePreference } from "@/hooks/useThemePreference";
import type { Language } from "@/constants/languages";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth/AuthProvider";
import { APP_NAME, APP_SANSKRIT_NAME, ATTRIBUTION, DESCRIPTION } from "@/constants/app";

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [language, setLanguage] = useLocalSetting<Language>("settings.language", "SANSKRIT");
  const { preference, setPreference } = useThemePreference();

  return (
    <Screen>
      <Pressable accessibilityRole="button" onPress={() => router.push(user ? "/gita/profile" : "/auth/login")} style={styles.account}><Text style={styles.accountText}>{user ? `Account · ${user.displayName}` : "Sign in / Create account"}</Text></Pressable>
      <AppHeader title="Settings" subtitle="Language and reading preferences" />

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
  account: { minHeight: 50, paddingHorizontal: spacing.md, borderRadius: radii.pill, backgroundColor: colors.navy, justifyContent: "center", alignItems: "center", marginBottom: spacing.lg },
  accountText: { color: colors.ivory, fontWeight: "800" },
  section: { marginTop: spacing.xl },
  about: { padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.border },
  sanskrit: { color: colors.purple, fontSize: 24, fontWeight: "700" },
  title: { color: colors.ink, fontSize: typography.h2, fontWeight: "800", marginTop: 4 },
  attribution: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: spacing.md },
  description: { color: colors.ink, fontSize: typography.body, lineHeight: 24, marginTop: spacing.sm },
});

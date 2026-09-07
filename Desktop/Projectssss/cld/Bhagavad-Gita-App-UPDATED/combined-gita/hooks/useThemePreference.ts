import { useColorScheme } from "react-native";
import { useLocalSetting } from "@/hooks/useLocalSetting";

export type AppearancePreference = "light" | "dark" | "system";

export function useThemePreference() {
  const systemScheme = useColorScheme();
  const [preference, setPreference, loaded] = useLocalSetting<AppearancePreference>(
    "settings.appearance",
    "system",
  );
  const isDark = preference === "dark" || (preference === "system" && systemScheme === "dark");
  return { preference, setPreference, isDark, loaded };
}

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, radii, spacing } from "@/constants/theme";

export function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <View style={styles.box}><Ionicons name="search" size={20} color={colors.muted} /><TextInput value={value} onChangeText={onChange} placeholder="Search Sanskrit, Kannada, Hindi, English" placeholderTextColor={colors.muted} style={styles.input} autoCapitalize="none" returnKeyType="search" /></View>;
}
const styles = StyleSheet.create({ box: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.paper, borderRadius: radii.pill, paddingHorizontal: spacing.md, minHeight: 48 }, input: { flex: 1, color: colors.ink, fontSize: 15 } });

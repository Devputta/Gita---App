import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radii, spacing, typography } from "@/constants/theme";

interface Props {
  label: string;
  onPress: () => void;
}

export function SecondaryButton({ label, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.72 },
  text: { color: colors.gold, fontSize: typography.button, fontWeight: "600" },
});

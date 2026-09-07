import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radii, spacing, typography } from "@/constants/theme";

interface Props {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function PrimaryButton({ label, onPress, accessibilityLabel }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
  text: { color: colors.navy, fontSize: typography.button, fontWeight: "700" },
});

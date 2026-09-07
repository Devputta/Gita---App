import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LANGUAGE_LABELS, type Language } from "@/constants/languages";
import { colors, radii, spacing } from "@/constants/theme";
import { useAudio } from "@/components/audio/AudioProvider";

export function AudioPlayer({ chapterNumber, verseNumber, language, text, onPrevious, onNext }: {
  chapterNumber: number;
  verseNumber: number;
  language: Language;
  text: string;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const { setTrack, play } = useAudio();
  useEffect(() => {
    if (text) setTrack({ chapterNumber, verseNumber, language, text });
  }, [chapterNumber, verseNumber, language, setTrack, text]);

  if (!text) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Audio ready</Text>
      <Text style={styles.meta}>{LANGUAGE_LABELS[language]} · persistent player · voice/provider abstraction</Text>
      <View style={styles.row}>
        <Button label="Previous" onPress={onPrevious} />
        <Button label="Play" onPress={() => void play()} />
        <Button label="Next" onPress={onNext} />
      </View>
    </View>
  );
}
function Button({ label, onPress }: { label: string; onPress?: () => void }) {
  return <Pressable disabled={!onPress} onPress={onPress} style={[styles.button, !onPress && styles.disabled]}><Text style={styles.buttonText}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({
  card: { marginTop: spacing.lg, padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.ink, fontSize: 17, fontWeight: "800" },
  meta: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  button: { minHeight: 42, paddingHorizontal: spacing.md, borderRadius: radii.pill, backgroundColor: colors.navy, justifyContent: "center", alignItems: "center" },
  disabled: { opacity: 0.35 },
  buttonText: { color: colors.ivory, fontSize: 13, fontWeight: "800" },
});

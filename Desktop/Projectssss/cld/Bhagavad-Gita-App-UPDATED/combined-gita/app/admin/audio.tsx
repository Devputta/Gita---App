import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type Language } from "@/constants/languages";
import { colors, radii, spacing } from "@/constants/theme";
import { buildAudioRequest, createServerGenerationProvider, type AudioProviderName } from "@/lib/audio/service";

const PROVIDERS: Exclude<AudioProviderName, "browser-web-speech" | "expo-speech">[] = ["sarvam-ai", "google-cloud", "azure-speech", "elevenlabs"];

export default function AdminAudioScreen() {
  const [chapter, setChapter] = useState("1");
  const [verse, setVerse] = useState("1");
  const [language, setLanguage] = useState<Language>("SANSKRIT");
  const [provider, setProvider] = useState<(typeof PROVIDERS)[number]>("sarvam-ai");
  const [approved, setApproved] = useState(false);
  const [status, setStatus] = useState("Waiting for administrator approval.");

  const generate = async () => {
    if (!approved) {
      Alert.alert("Approval required", "An administrator must explicitly approve audio generation before a provider is called.");
      return;
    }
    setStatus("Generation request prepared. Connect the selected server-side provider to store the resulting file.");
    try {
      const service = createServerGenerationProvider(provider);
      await service.generate(buildAudioRequest("", language));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Server-side audio generation is not configured.");
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Admin · Audio Generation</Text>
      <Text style={styles.description}>Explicit approval is required. Provider credentials must remain on the server and never be bundled into the Expo client.</Text>
      <Field label="Chapter" value={chapter} onChangeText={setChapter} />
      <Field label="Verse" value={verse} onChangeText={setVerse} />
      <Text style={styles.label}>Language</Text>
      <View style={styles.row}>{SUPPORTED_LANGUAGES.map((item) => <Choice key={item} selected={language === item} label={LANGUAGE_LABELS[item]} onPress={() => setLanguage(item)} />)}</View>
      <Text style={styles.label}>Provider</Text>
      <View style={styles.row}>{PROVIDERS.map((item) => <Choice key={item} selected={provider === item} label={item} onPress={() => setProvider(item)} />)}</View>
      <Pressable onPress={() => setApproved((value) => !value)} style={[styles.approval, approved && styles.approved]}>
        <Text style={styles.approvalText}>{approved ? "✓ Administrator approval granted" : "I approve this audio generation"}</Text>
      </Pressable>
      <Pressable onPress={() => void generate()} style={styles.generate}><Text style={styles.generateText}>Generate / Regenerate Audio</Text></Pressable>
      <Text style={styles.status}>{status}</Text>
      <Text style={styles.metadata}>The production workflow should retrieve the verified verse, generate audio on the server, store the audio file, save provider/voice/language metadata, and link it to the verse. Never auto-generate or auto-publish.</Text>
    </Screen>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} keyboardType="number-pad" style={styles.input} /></View>;
}
function Choice({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.choice, selected && styles.choiceSelected]}><Text style={[styles.choiceText, selected && styles.choiceSelectedText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  title: { color: colors.ink, fontSize: 28, fontWeight: "800" },
  description: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: spacing.sm, marginBottom: spacing.lg },
  label: { color: colors.ink, fontSize: 13, fontWeight: "800", marginTop: spacing.md, marginBottom: spacing.xs },
  input: { minHeight: 46, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: spacing.md, backgroundColor: colors.paper, color: colors.ink },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  choice: { minHeight: 40, paddingHorizontal: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, justifyContent: "center", backgroundColor: colors.paper },
  choiceSelected: { backgroundColor: colors.navy, borderColor: colors.navy },
  choiceText: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  choiceSelectedText: { color: colors.ivory },
  approval: { marginTop: spacing.xl, minHeight: 50, borderRadius: radii.md, borderWidth: 1, borderColor: colors.saffron, justifyContent: "center", alignItems: "center", paddingHorizontal: spacing.md },
  approved: { backgroundColor: colors.saffron },
  approvalText: { color: colors.ink, fontWeight: "800" },
  generate: { marginTop: spacing.sm, minHeight: 52, borderRadius: radii.pill, backgroundColor: colors.navy, justifyContent: "center", alignItems: "center" },
  generateText: { color: colors.ivory, fontWeight: "800" },
  status: { color: colors.muted, marginTop: spacing.lg, lineHeight: 21 },
  metadata: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: spacing.lg },
});

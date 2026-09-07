import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { colors, radii, spacing } from "@/constants/theme";
export function VerseActions({ sanskrit, verseReference, bookmarked, onBookmark }: { sanskrit: string; verseReference: string; bookmarked: boolean; onBookmark: () => void }) {
  const copySanskrit = async () => { await Clipboard.setStringAsync(sanskrit); Alert.alert("Copied", "The Sanskrit verse was copied to your clipboard."); };
  const shareVerse = async () => { await Share.share({ title: `Bhagavad Gita ${verseReference}`, message: `${verseReference}\n\n${sanskrit}` }); };
  return <View style={styles.container}><Pressable onPress={() => void copySanskrit()} style={styles.button}><Text style={styles.buttonText}>Copy Sanskrit</Text></Pressable><Pressable onPress={() => void shareVerse()} style={styles.button}><Text style={styles.buttonText}>Share Verse</Text></Pressable><Pressable onPress={onBookmark} style={[styles.button, bookmarked && styles.active]}><Text style={styles.buttonText}>{bookmarked ? "Remove Bookmark" : "Bookmark"}</Text></Pressable></View>;
}
const styles = StyleSheet.create({ container: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.lg }, button: { minHeight: 46, paddingHorizontal: spacing.md, borderRadius: radii.pill, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" }, active: { backgroundColor: colors.gold }, buttonText: { color: colors.ivory, fontSize: 14, fontWeight: "800" } });

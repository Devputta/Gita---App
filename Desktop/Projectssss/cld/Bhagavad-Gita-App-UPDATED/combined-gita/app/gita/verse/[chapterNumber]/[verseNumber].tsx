import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { EmptyState } from "@/components/common/EmptyState";
import { ReaderHeader } from "@/components/reader/ReaderHeader";
import { ReaderModeSelector, type ReaderMode } from "@/components/reader/ReaderModeSelector";
import { LanguageSelector } from "@/components/reader/LanguageSelector";
import { TranslationPanel } from "@/components/reader/TranslationPanel";
import { LanguageContentCard } from "@/components/reader/LanguageContentCard";
import { VerseActions } from "@/components/reader/VerseActions";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { useLocalSetting } from "@/hooks/useLocalSetting";
import { getChapter, getTranslations, getVerse } from "@/lib/content/service";
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, type Language } from "@/constants/languages";
import { colors, radii, spacing, typography } from "@/constants/theme";
import type { Chapter, Translation, Verse } from "@/types/gita";
import { validateChapterNumber, validateVerseNumber } from "@/lib/content/validation";
import { useBookmarks } from "@/hooks/useBookmarks";
import { readingProgressStore } from "@/lib/progress/store";
import { useReaderPreferences } from "@/hooks/useReaderPreferences";
import { VerseShare } from "@/components/verse/VerseShare";
import { applyWebSeo, verseSeo } from "@/lib/seo";

export default function VerseReaderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ chapterNumber?: string; verseNumber?: string }>();
  const chapterNumber = Number(params.chapterNumber);
  const verseNumber = Number(params.verseNumber);
  const [verse, setVerse] = useState<Verse | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [translations, setTranslations] = useState<Partial<Record<Language, Translation | null>>>({});
  const [language, setLanguage] = useLocalSetting<Language>("settings.language", "SANSKRIT");
  const [mode, setMode] = useLocalSetting<ReaderMode>("settings.readerMode", "SINGLE");
  const { bookmarked, toggle } = useBookmarks(verse?.id);
  const { value: readerPrefs, update: updateReaderPrefs } = useReaderPreferences();

  useEffect(() => {
    if (!validateChapterNumber(chapterNumber) || !validateVerseNumber(verseNumber)) return;
    void Promise.all([getVerse(chapterNumber, verseNumber), getChapter(chapterNumber)]).then(([nextVerse, nextChapter]) => {
      setVerse(nextVerse);
      setChapter(nextChapter);
    });
  }, [chapterNumber, verseNumber]);

  useEffect(() => {
    if (!verse) return;
    let active = true;
    void Promise.all(
      (["KANNADA", "HINDI", "ENGLISH"] as const).map(async (lang) => [lang, (await getTranslations(verse.id, lang))[0] ?? null] as const),
    ).then((items) => {
      if (!active) return;
      setTranslations(Object.fromEntries(items));
    });
    return () => { active = false; };
  }, [verse]);

  const chapterVerseNumbers = [verseNumber - 1, verseNumber + 1];
  const openVerse = (targetVerse: number) => router.replace(`/gita/verse/${chapterNumber}/${targetVerse}`);
  const swipeResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 24 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -60 && verseNumber < (chapter?.verseCount ?? 0)) openVerse(verseNumber + 1);
      if (gesture.dx > 60 && verseNumber > 1) openVerse(verseNumber - 1);
    },
  }), [chapter?.verseCount, openVerse, verseNumber]);
  useEffect(() => { if (verse) void readingProgressStore.set(chapterNumber, verseNumber); }, [chapterNumber, verse, verseNumber]);
  useEffect(() => { if (verse) { const m=verseSeo(verse, chapterNumber); applyWebSeo({ ...m, structuredData: { "@context":"https://schema.org", "@type":"Article", headline:m.title, description:m.description, url:m.canonical } }); } }, [verse, chapterNumber]);

  if (!validateChapterNumber(chapterNumber) || !validateVerseNumber(verseNumber)) {
    return <Screen><EmptyState title="Invalid verse" message="The chapter must be 1–18 and the verse number must be positive." /></Screen>;
  }
  if (!verse) return <Screen><EmptyState title="Verse not found" message="This verse is not available in the verified Sanskrit dataset." /></Screen>;

  const currentVerse = verse.sanskrit ?? "";
  const selectedTranslation = language === "SANSKRIT" ? null : translations[language] ?? null;
  const audioText = language === "SANSKRIT" ? currentVerse : selectedTranslation?.text ?? "";

  return (
    <Screen>
      <View {...swipeResponder.panHandlers}>
      <ReaderHeader chapterNumber={chapterNumber} verseNumber={verseNumber} chapterTitle={chapter?.titleSanskrit ?? `Bhagavad Gita — Chapter ${chapterNumber}`} />
      <View style={styles.referenceRow}>
        <Text style={styles.reference}>Bhagavad Gita {chapterNumber}.{verseNumber}</Text>
        <Pressable onPress={() => router.push(`/gita/chapter/${chapterNumber}`)} style={styles.chapterButton}>
          <Text style={styles.chapterButtonText}>Chapter navigation</Text>
        </Pressable>
      </View>

      <View style={styles.modeSection}>
        <Text style={styles.heading}>Reading mode</Text>
        <ReaderModeSelector value={mode} onChange={(next) => void setMode(next)} />
      </View>

      {mode === "SINGLE" ? (
        <>
          <View style={styles.controlsCard}><Text style={styles.heading}>Reader controls</Text><View style={styles.controlRow}><Pressable accessibilityRole="button" accessibilityLabel="Decrease font size" onPress={() => updateReaderPrefs({fontSize: Math.max(16, readerPrefs.fontSize - 1)})} style={styles.control}><Text>−</Text></Pressable><Text accessibilityRole="text" style={styles.controlValue}>Text {readerPrefs.fontSize}</Text><Pressable accessibilityRole="button" accessibilityLabel="Increase font size" onPress={() => updateReaderPrefs({fontSize: Math.min(34, readerPrefs.fontSize + 1)})} style={styles.control}><Text>+</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Toggle high contrast" onPress={() => updateReaderPrefs({highContrast: !readerPrefs.highContrast})} style={styles.control}><Text>Contrast</Text></Pressable></View></View>
          <View style={[styles.sanskritCard, readerPrefs.highContrast && styles.highContrastCard]}>
            <Text style={styles.sectionLabel}>Sanskrit</Text>
            <Text accessibilityRole="text" style={[styles.sanskrit, {fontSize: readerPrefs.fontSize + 4, lineHeight: readerPrefs.lineHeight, letterSpacing: readerPrefs.letterSpacing}]}>{currentVerse}</Text>
          </View>
          <View style={styles.languageSection}>
            <Text style={styles.heading}>Translation language</Text>
            <LanguageSelector value={language} onChange={(next) => void setLanguage(next)} />
          </View>
          <TranslationPanel language={language} translation={selectedTranslation} />
          {audioText ? <AudioPlayer chapterNumber={chapterNumber} verseNumber={verseNumber} language={language} text={audioText} onPrevious={verseNumber > 1 ? () => openVerse(chapterVerseNumbers[0]!) : undefined} onNext={verseNumber < (chapter?.verseCount ?? 0) ? () => openVerse(chapterVerseNumbers[1]!) : undefined} /> : null}
        </>
      ) : (
        <View style={styles.parallelGrid}>
          {SUPPORTED_LANGUAGES.map((item) => (
            <LanguageContentCard key={item} language={item} sanskrit={currentVerse} translation={item === "SANSKRIT" ? null : translations[item] ?? null} />
          ))}
        </View>
      )}

      <VerseActions sanskrit={currentVerse} verseReference={`Bhagavad Gita ${chapterNumber}.${verseNumber}`} bookmarked={bookmarked} onBookmark={() => void toggle({ verseId: verse.id, chapterNumber, verseNumber, language })} />
      <VerseShare chapter={chapterNumber} verse={verseNumber} sanskrit={currentVerse} translation={selectedTranslation?.text} />
      <Text style={styles.note}>Languages supported by this app: {SUPPORTED_LANGUAGES.map((item) => LANGUAGE_NAMES[item]).join(" · ")}. Swipe left/right to move between verses.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  referenceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, marginTop: spacing.md },
  reference: { color: colors.muted, fontSize: 14, fontWeight: "700" },
  chapterButton: { minHeight: 42, paddingHorizontal: spacing.md, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.paper, justifyContent: "center" },
  chapterButtonText: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  modeSection: { marginTop: spacing.xl },
  heading: { color: colors.ink, fontSize: typography.h2, fontWeight: "800" },
  sanskritCard: { marginTop: spacing.md, paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.border },
  sectionLabel: { color: colors.saffron, fontSize: typography.small, fontWeight: "800", marginBottom: spacing.lg, textAlign: "center" },
  sanskrit: { color: colors.ink, fontFamily: "Noto Sans Devanagari", fontSize: 24, lineHeight: 44, textAlign: "center" },
  languageSection: { marginTop: spacing.xl },
  parallelGrid: { marginTop: spacing.lg, gap: spacing.md },
  controlsCard: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.border },
  controlRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.sm },
  control: { minHeight: 42, minWidth: 42, paddingHorizontal: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, justifyContent: "center", alignItems: "center", backgroundColor: colors.white },
  controlValue: { color: colors.ink, fontWeight: "800", paddingHorizontal: spacing.sm },
  highContrastCard: { backgroundColor: colors.white, borderColor: colors.black },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: spacing.lg },
});

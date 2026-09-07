import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { BrowserWebSpeechController } from "@/lib/audio/browserWebSpeech";
import { LANGUAGE_LABELS, type Language } from "@/constants/languages";
import { PLAYBACK_SPEEDS, type PlaybackSpeed } from "@/lib/audio/service";
import { colors, radii, spacing } from "@/constants/theme";

type Track = { chapterNumber: number; verseNumber: number; language: Language; text: string };
type AudioContextValue = {
  track: Track | null; queue: Track[]; queueIndex: number; playing: boolean; paused: boolean; speed: PlaybackSpeed;
  setTrack: (track: Track | null) => void; play: () => Promise<void>; pause: () => Promise<void>; resume: () => Promise<void>; replay: () => Promise<void>; stop: () => Promise<void>;
  setSpeed: (speed: PlaybackSpeed) => void; playQueue: (tracks: Track[], startIndex?: number) => Promise<void>; previous: () => Promise<void>; next: () => Promise<void>;
};
const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: PropsWithChildren) {
  const controller = useMemo(() => new BrowserWebSpeechController(), []);
  const [track, setTrackState] = useState<Track | null>(null); const [queue, setQueue] = useState<Track[]>([]); const [queueIndex, setQueueIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const queueRef = useRef<Track[]>([]); const queueIndexRef = useRef(0); const [paused, setPaused] = useState(false); const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const speak = useCallback(async (nextTrack: Track) => {
    await controller.play({ text: nextTrack.text, language: nextTrack.language, speed }, () => {
      const items = queueRef.current; const current = queueIndexRef.current;
      if (items.length && current < items.length - 1) { const i = current + 1; queueIndexRef.current = i; setQueueIndex(i); void speak(items[i]!); }
      else { setPlaying(false); setPaused(false); }
    });
    setTrackState(nextTrack); setPlaying(true); setPaused(false);
  }, [controller, speed]);
  const setTrack = useCallback((next: Track | null) => { void controller.stop(); setTrackState(next); setQueue([]); setQueueIndex(0); setPlaying(false); setPaused(false); }, [controller]);
  const play = useCallback(async () => { if (!track) return; try { await speak(track); } catch (e) { Alert.alert("Audio unavailable", e instanceof Error ? e.message : "The audio provider is unavailable."); } }, [speak, track]);
  const pause = useCallback(async () => { await controller.pause(); setPaused(true); }, [controller]);
  const resume = useCallback(async () => { await controller.resume(); setPaused(false); setPlaying(true); }, [controller]);
  const replay = useCallback(async () => { if (!track) return; await speak(track); }, [speak, track]);
  const stop = useCallback(async () => { await controller.stop(); setPlaying(false); setPaused(false); }, [controller]);
  const playQueue = useCallback(async (tracks: Track[], startIndex = 0) => { if (!tracks.length) return; const index = Math.max(0, Math.min(startIndex, tracks.length - 1)); queueRef.current = tracks; queueIndexRef.current = index; setQueue(tracks); setQueueIndex(index); await speak(tracks[index]!); }, [speak]);
  const next = useCallback(async () => { if (queue.length && queueIndex < queue.length - 1) { const i = queueIndex + 1; queueIndexRef.current = i; setQueueIndex(i); await speak(queue[i]!); } else { await stop(); } }, [queue, queueIndex, speak, stop]);
  const previous = useCallback(async () => { if (queue.length && queueIndex > 0) { const i = queueIndex - 1; queueIndexRef.current = i; setQueueIndex(i); await speak(queue[i]!); } }, [queue, queueIndex, speak]);

  useEffect(() => { controller.setOnEnded?.(() => { setPlaying(false); setPaused(false); }); }, [controller]);
  const value = useMemo(() => ({ track, queue, queueIndex, playing, paused, speed, setTrack, play, pause, resume, replay, stop, setSpeed, playQueue, previous, next }), [track, queue, queueIndex, playing, paused, speed, setTrack, play, pause, resume, replay, stop, playQueue, previous, next]);
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
export function useAudio() { const value = useContext(AudioContext); if (!value) throw new Error("useAudio must be used inside AudioProvider"); return value; }
export function PersistentAudioPlayer() {
  const { track, playing, paused, speed, play, pause, resume, replay, stop, setSpeed, previous, next, queue, queueIndex } = useAudio();
  if (!track) return null;
  return <View style={styles.bar}><View style={styles.info}><Text style={styles.title}>🔊 {LANGUAGE_LABELS[track.language]}</Text><Text style={styles.meta}>Chapter {track.chapterNumber} · Verse {track.verseNumber}{queue.length ? ` · ${queueIndex + 1}/${queue.length}` : ""}</Text></View><View style={styles.controls}><SmallButton label="Previous" onPress={() => void previous()} /><SmallButton label={playing && !paused ? "Pause" : "Play"} onPress={() => void (playing && !paused ? pause() : paused ? resume() : play())} /><SmallButton label="Next" onPress={() => void next()} /><SmallButton label="Replay" onPress={() => void replay()} /><SmallButton label="Stop" onPress={() => void stop()} />{PLAYBACK_SPEEDS.map(item => <SmallButton key={item} label={`${item}x`} selected={speed === item} onPress={() => setSpeed(item)} />)}</View></View>;
}
function SmallButton({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) { return <Pressable onPress={onPress} style={[styles.button, selected && styles.selected]}><Text style={[styles.buttonText, selected && styles.selectedText]}>{label}</Text></Pressable>; }
const styles = StyleSheet.create({ bar: { position: "absolute", left: spacing.sm, right: spacing.sm, bottom: spacing.sm, zIndex: 20, padding: spacing.sm, borderRadius: radii.lg, backgroundColor: colors.navy, borderWidth: 1, borderColor: colors.purple, flexDirection: "row", alignItems: "center", gap: spacing.sm, elevation: 8, maxWidth: 900, alignSelf: "center", width: "96%" }, info: { flex: 1, minWidth: 130 }, title: { color: colors.ivory, fontSize: 13, fontWeight: "800" }, meta: { color: "#E5DECF", fontSize: 11, marginTop: 2 }, controls: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, justifyContent: "flex-end", maxWidth: 620 }, button: { minHeight: 34, paddingHorizontal: spacing.sm, borderRadius: radii.pill, backgroundColor: colors.paper, justifyContent: "center" }, selected: { backgroundColor: colors.gold }, buttonText: { color: colors.ink, fontSize: 11, fontWeight: "800" }, selectedText: { color: colors.navy } });

import { LANGUAGE_LOCALES, type Language } from "@/constants/languages";

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export type AudioProviderName =
  | "sarvam-ai"
  | "google-cloud"
  | "azure-speech"
  | "elevenlabs"
  | "browser-web-speech"
  | "expo-speech";

export interface AudioRequest {
  text: string;
  language: Language;
  voice?: string;
  speed?: PlaybackSpeed;
}

export interface GeneratedAudio {
  uri: string;
  durationMs?: number;
  provider: AudioProviderName;
  voice: string;
  language: Language;
}

export interface AudioPlaybackController {
  play(request: AudioRequest, onEnded?: () => void): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  replay(): Promise<void>;
  stop(): Promise<void>;
}

export interface AudioGenerationProvider {
  readonly name: AudioProviderName;
  generate(request: AudioRequest): Promise<GeneratedAudio>;
}

export const DEFAULT_VOICES: Record<Language, string> = {
  SANSKRIT: "default-sanskrit",
  KANNADA: "default-kannada",
  HINDI: "default-hindi",
  ENGLISH: "default-english",
};

export function buildAudioRequest(text: string, language: Language, speed: PlaybackSpeed = 1): AudioRequest {
  return {
    text,
    language,
    voice: DEFAULT_VOICES[language],
    speed,
  };
}

export function getLanguageLocale(language: Language): string {
  return LANGUAGE_LOCALES[language];
}

export function createServerGenerationProvider(name: Exclude<AudioProviderName, "browser-web-speech" | "expo-speech">): AudioGenerationProvider {
  return {
    name,
    async generate() {
      throw new Error(
        `${name} is server-side only. Configure the backend provider and keep its credentials outside the Expo client.`,
      );
    },
  };
}

import { LANGUAGE_LOCALES, type Language } from "@/constants/languages";
import type { AudioPlaybackController, AudioRequest } from "@/lib/audio/service";
export class BrowserWebSpeechController implements AudioPlaybackController {
  private currentRequest: AudioRequest | null = null; private paused = false; private onEnded: (() => void) | undefined;
  setOnEnded(cb?: () => void) { this.onEnded = cb; }
  async play(request: AudioRequest, onEnded?: () => void): Promise<void> {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) throw new Error("Browser Web Speech API is not available on this device.");
    window.speechSynthesis.cancel(); this.currentRequest = request; this.paused = false; if (onEnded) this.onEnded = onEnded;
    const utterance = new SpeechSynthesisUtterance(request.text); utterance.lang = LANGUAGE_LOCALES[request.language]; utterance.rate = request.speed ?? 1; utterance.onend = () => this.onEnded?.(); window.speechSynthesis.speak(utterance);
  }
  async pause() { if (typeof window !== "undefined" && "speechSynthesis" in window) { window.speechSynthesis.pause(); this.paused = true; } }
  async resume() { if (typeof window !== "undefined" && "speechSynthesis" in window) { if (this.paused) window.speechSynthesis.resume(); this.paused = false; } }
  async replay() { if (this.currentRequest) await this.play(this.currentRequest); }
  async stop() { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); this.paused = false; }
}
export function createBrowserSpeechController(_language?: Language): AudioPlaybackController { return new BrowserWebSpeechController(); }

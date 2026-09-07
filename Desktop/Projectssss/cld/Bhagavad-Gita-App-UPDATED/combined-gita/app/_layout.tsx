import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AudioProvider, PersistentAudioPlayer } from "@/components/audio/AudioProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { PwaRegistration } from "@/components/pwa/PwaRegistration";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AudioProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
        <PersistentAudioPlayer />
        <PwaRegistration />
      </AudioProvider>
    </AuthProvider>
  );
}

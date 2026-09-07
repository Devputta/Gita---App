import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "USER" | "ADMIN";
export type SessionUser = { id: string; email: string; displayName: string; role: UserRole; provider: "email" | "google" };

const KEY = "auth.session.v1";

export async function getSessionUser(): Promise<SessionUser | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as SessionUser; } catch { await AsyncStorage.removeItem(KEY); return null; }
}

export async function signInWithEmail(email: string, displayName?: string): Promise<SessionUser> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) throw new Error("Enter a valid email address.");
  const adminEmail = (process.env.EXPO_PUBLIC_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const user: SessionUser = {
    id: `local-${encodeURIComponent(normalized)}`,
    email: normalized,
    displayName: displayName?.trim() || normalized.split("@")[0] || "Gita reader",
    role: adminEmail && normalized === adminEmail ? "ADMIN" : "USER",
    provider: "email",
  };
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

/**
 * Used only when EXPO_PUBLIC_GOOGLE_CLIENT_ID is not set, so local development
 * still has a working "Continue with Google" button. Once a real client ID is
 * configured, useGoogleAuthRequest() drives an actual OAuth flow instead and
 * this function is not called — see lib/auth/googleAuth.ts.
 */
export async function signInWithGooglePlaceholder(email: string): Promise<SessionUser> {
  const user = await signInWithEmail(email, email.split("@")[0]);
  return { ...user, provider: "google" };
}

export async function signInWithGoogleProfile(profile: {
  sub: string;
  email: string;
  name?: string;
}): Promise<SessionUser> {
  const normalized = profile.email.trim().toLowerCase();
  const adminEmail = (process.env.EXPO_PUBLIC_ADMIN_EMAIL ?? "").trim().toLowerCase();
  const user: SessionUser = {
    id: `google-${profile.sub}`,
    email: normalized,
    displayName: profile.name?.trim() || normalized.split("@")[0] || "Gita reader",
    role: adminEmail && normalized === adminEmail ? "ADMIN" : "USER",
    provider: "google",
  };
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export async function signOut(): Promise<void> { await AsyncStorage.removeItem(KEY); }

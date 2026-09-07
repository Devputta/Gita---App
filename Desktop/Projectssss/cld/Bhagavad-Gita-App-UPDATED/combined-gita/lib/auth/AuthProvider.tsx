import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { getSessionUser, signInWithEmail, signInWithGooglePlaceholder, signInWithGoogleProfile, signOut, type SessionUser } from "@/lib/auth/session";
import { isGoogleSignInConfigured } from "@/lib/auth/googleAuth";

type AuthValue = {
  user: SessionUser | null;
  loading: boolean;
  googleConfigured: boolean;
  loginEmail: (email: string, name?: string) => Promise<SessionUser>;
  loginGoogleDemo: (email: string) => Promise<SessionUser>;
  loginGoogleProfile: (profile: { sub: string; email: string; name?: string }) => Promise<SessionUser>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { void getSessionUser().then(setUser).finally(() => setLoading(false)); }, []);
  const loginEmail = useCallback(async (email: string, name?: string) => { const next = await signInWithEmail(email, name); setUser(next); return next; }, []);
  const loginGoogleDemo = useCallback(async (email: string) => { const next = await signInWithGooglePlaceholder(email); setUser(next); return next; }, []);
  const loginGoogleProfile = useCallback(async (profile: { sub: string; email: string; name?: string }) => { const next = await signInWithGoogleProfile(profile); setUser(next); return next; }, []);
  const logout = useCallback(async () => { await signOut(); setUser(null); }, []);
  const value = useMemo(
    () => ({ user, loading, googleConfigured: isGoogleSignInConfigured(), loginEmail, loginGoogleDemo, loginGoogleProfile, logout }),
    [user, loading, loginEmail, loginGoogleDemo, loginGoogleProfile, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }

import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useGoogleAuthRequest, exchangeGoogleCode, type GoogleProfile } from "@/lib/auth/googleAuth";
import { colors, radii, spacing, typography } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { user, loginEmail, loginGoogleDemo, loginGoogleProfile, googleConfigured, logout } = useAuth();
  const [email, setEmail] = useState(""); const [name, setName] = useState("");
  const { request, response, promptAsync, redirectUri, clientId } = useGoogleAuthRequest();

  useEffect(() => {
    if (!googleConfigured || !response || !clientId) return;
    if (response.type !== "success") return;
    const codeVerifier = request?.codeVerifier;
    const code = response.params.code;
    if (!codeVerifier || !code) return;
    (async () => {
      try {
        const profile: GoogleProfile = await exchangeGoogleCode({ code, clientId, redirectUri, codeVerifier });
        await loginGoogleProfile({ sub: profile.sub, email: profile.email, name: profile.name });
        router.replace("/gita/profile");
      } catch (e) {
        Alert.alert("Google sign-in failed", e instanceof Error ? e.message : "Please try again.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  if (user) return <Screen><Text style={styles.title}>Your account</Text><Text style={styles.muted}>{user.displayName} · {user.email}</Text><Text style={styles.role}>{user.role === "ADMIN" ? "Administrator" : "Reader"}</Text><Pressable accessibilityRole="button" onPress={() => void logout()} style={styles.button}><Text style={styles.buttonText}>Sign out</Text></Pressable><Pressable accessibilityRole="button" onPress={() => router.replace("/gita/profile")} style={styles.link}><Text style={styles.linkText}>Open profile</Text></Pressable></Screen>;

  const signInEmail = async () => { try { await loginEmail(email, name); router.replace("/gita/profile"); } catch (e) { Alert.alert("Sign in failed", e instanceof Error ? e.message : "Please try again."); } };
  const signInGoogle = async () => {
    if (!googleConfigured) { try { await loginGoogleDemo(email || "demo@example.com"); router.replace("/gita/profile"); } catch (e) { Alert.alert("Sign in failed", e instanceof Error ? e.message : "Please try again."); } return; }
    try { await promptAsync(); } catch (e) { Alert.alert("Google sign-in failed", e instanceof Error ? e.message : "Please try again."); }
  };

  return <Screen><View style={styles.card}><Text style={styles.sanskrit}>श्रीमद्भगवद्गीता</Text><Text style={styles.title}>Sign in</Text><Text style={styles.muted}>Save bookmarks, reading progress and preferences across sessions.</Text><Text style={styles.label}>Name (optional)</Text><TextInput accessibilityLabel="Name" value={name} onChangeText={setName} style={styles.input} autoCapitalize="words" /><Text style={styles.label}>Email</Text><TextInput accessibilityLabel="Email address" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} /><Pressable accessibilityRole="button" onPress={() => void signInEmail()} style={styles.button}><Text style={styles.buttonText}>Continue with email</Text></Pressable><Pressable accessibilityRole="button" disabled={googleConfigured && !request} onPress={() => void signInGoogle()} style={styles.google}><Text style={styles.googleText}>Continue with Google</Text></Pressable><Text style={styles.note}>{googleConfigured ? "Google sign-in uses a real OAuth flow (Authorization Code + PKCE). No client secret is stored in this app." : "Email sign-in is stored locally for this Expo build. Set EXPO_PUBLIC_GOOGLE_CLIENT_ID in .env to enable real Google sign-in \u2014 see README-PRODUCTION.md. Admin authorization must be server-enforced before production."}</Text></View></Screen>;
}
const styles = StyleSheet.create({ card:{padding:spacing.xl,borderRadius:radii.lg,backgroundColor:colors.paper,borderWidth:1,borderColor:colors.border}, sanskrit:{fontSize:24,fontWeight:"700",color:colors.purple,textAlign:"center"}, title:{fontSize:typography.title,fontWeight:"800",color:colors.ink,marginTop:spacing.md}, muted:{color:colors.muted,fontSize:15,lineHeight:23,marginTop:spacing.sm}, role:{marginTop:spacing.md,color:colors.saffron,fontWeight:"800"}, label:{color:colors.ink,fontWeight:"800",fontSize:13,marginTop:spacing.lg,marginBottom:spacing.xs}, input:{minHeight:50,borderWidth:1,borderColor:colors.border,borderRadius:radii.md,paddingHorizontal:spacing.md,backgroundColor:colors.white,color:colors.ink}, button:{minHeight:52,borderRadius:radii.pill,backgroundColor:colors.navy,alignItems:"center",justifyContent:"center",marginTop:spacing.lg}, buttonText:{color:colors.ivory,fontSize:16,fontWeight:"800"}, google:{minHeight:52,borderRadius:radii.pill,borderWidth:1,borderColor:colors.navy,alignItems:"center",justifyContent:"center",marginTop:spacing.sm}, googleText:{color:colors.navy,fontSize:16,fontWeight:"800"}, link:{padding:spacing.md,alignItems:"center"},linkText:{color:colors.purpleSoft,fontWeight:"800"},note:{color:colors.muted,fontSize:12,lineHeight:18,marginTop:spacing.lg}
});

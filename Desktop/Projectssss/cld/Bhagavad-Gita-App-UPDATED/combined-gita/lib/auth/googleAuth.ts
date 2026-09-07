import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

// Completes the auth session popup/redirect flow correctly on web.
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export type GoogleProfile = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

export function getGoogleClientId(): string | null {
  const id = (process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? "").trim();
  return id.length > 0 ? id : null;
}

export function isGoogleSignInConfigured(): boolean {
  return getGoogleClientId() !== null;
}

/**
 * Hook that returns a request/response pair plus a `promptAsync` function.
 * Uses Authorization Code + PKCE, which is the flow Google requires for
 * public (mobile/web) clients — no client secret is ever embedded in the app.
 *
 * Setup (see README-PRODUCTION.md "Google Sign-In" section):
 *   1. Create an OAuth 2.0 Client ID in Google Cloud Console
 *      (type: Web application for Expo web / Expo Go, or the matching
 *      iOS/Android type for standalone native builds).
 *   2. Add the redirect URI printed by `npx expo start` (or your production
 *      domain) to "Authorized redirect URIs" in the Google Cloud Console.
 *   3. Set EXPO_PUBLIC_GOOGLE_CLIENT_ID in your .env file.
 */
export function useGoogleAuthRequest() {
  const clientId = getGoogleClientId();
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "bhagavadgita",
    path: Platform.OS === "web" ? undefined : "auth",
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId ?? "unconfigured",
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    GOOGLE_DISCOVERY,
  );

  return { request, response, promptAsync, redirectUri, clientId };
}

/**
 * Exchanges the authorization code for tokens, then fetches the user's
 * profile from Google's userinfo endpoint. This token exchange step calls
 * Google directly from the client because no client secret is required for
 * a PKCE public-client flow — for stricter production setups, proxy this
 * exchange through your own backend instead and never trust the client
 * with anything beyond the profile it receives back.
 */
export async function exchangeGoogleCode(params: {
  code: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<GoogleProfile> {
  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: params.clientId,
      code: params.code,
      redirectUri: params.redirectUri,
      extraParams: { code_verifier: params.codeVerifier },
    },
    GOOGLE_DISCOVERY,
  );

  const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
  });

  if (!userInfoResponse.ok) {
    throw new Error("Could not fetch Google profile after sign-in.");
  }

  return (await userInfoResponse.json()) as GoogleProfile;
}

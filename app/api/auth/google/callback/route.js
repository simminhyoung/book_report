import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens, fetchGoogleUserInfo } from "@/lib/googleAuth";
import { findOrCreateGoogleUser, createSession } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = cookies().get("google_oauth_state")?.value;

  cookies().delete("google_oauth_state");

  // state가 안 맞으면 CSRF 공격 가능성이 있으니 바로 중단
  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/login?error=google", SITE_URL));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const profile = await fetchGoogleUserInfo(tokens.access_token);

    if (!profile.email || !profile.email_verified) {
      return NextResponse.redirect(new URL("/login?error=google_email", SITE_URL));
    }

    const user = await findOrCreateGoogleUser({
      googleId: profile.sub,
      email: profile.email.toLowerCase(),
      name: profile.name,
    });

    await createSession(user.id);
  } catch (err) {
    console.error("Google 로그인 실패:", err);
    return NextResponse.redirect(new URL("/login?error=google", SITE_URL));
  }

  return NextResponse.redirect(new URL("/my", SITE_URL));
}

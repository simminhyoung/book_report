import { NextResponse } from "next/server";
import crypto from "crypto";
import { buildGoogleAuthUrl } from "@/lib/googleAuth";

export const dynamic = "force-dynamic";

// "Google로 로그인" 버튼이 여기로 연결됩니다.
// CSRF 방지를 위한 무작위 state 값을 쿠키에 잠깐 저장해두고,
// 콜백에서 그대로 돌아왔는지 확인합니다.
export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");

  const response = NextResponse.redirect(buildGoogleAuthUrl(state));
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10, // 10분 안에 로그인 안 하면 만료
  });
  return response;
}

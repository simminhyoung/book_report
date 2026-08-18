import { NextResponse } from "next/server";

// Lightweight, edge-safe gate: only checks whether the session cookie is
// present so we can bounce obviously-logged-out visitors to /login without a
// DB round trip. The actual session (and ownership checks) are re-verified
// server-side in `requireUser()` on every protected page/action.
export function middleware(request) {
  const token = request.cookies.get("session_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my/:path*"],
};

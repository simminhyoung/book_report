import Link from "next/link";
import { logoutAction } from "@/lib/actions";
import NavTabs from "./NavTabs";

// `user` is fetched once in app/layout.js and passed down (also needed there
// to decide whether to render the mobile bottom tab bar after the page
// content), rather than querying the session twice per request.
export default function Nav({ user }) {
  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
          <Link href="/" className="brand">
            독후감 나눔
          </Link>
          <NavTabs />
        </div>
        <div className="navlinks">
          {user ? (
            <>
              <span style={{ color: "var(--ink-soft)" }}>{user.name || user.email}님</span>
              <Link href="/my/write" className="btn small nav-write-link">
                독후감 쓰기
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="btn secondary small">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">로그인</Link>
              <Link href="/signup" className="btn small">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

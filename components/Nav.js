import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default async function Nav() {
  const user = await getCurrentUser();

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <Link href="/" className="brand">
          📖 독후감 나눔
        </Link>
        <div className="navlinks">
          <Link href="/explore">둘러보기</Link>
          {user ? (
            <>
              <Link href="/my">내 독후감</Link>
              <span>{user.name || user.email}님</span>
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

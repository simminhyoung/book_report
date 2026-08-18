import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="hero">
      <h1>책을 덮고 나면, 여기에 남겨보세요</h1>
      <p className="subtitle">
        나만의 독후감을 기록하고, 공유하고 싶은 글만 골라 다른 사람들과
        나눠보세요.
      </p>
      <div className="actions">
        {user ? (
          <>
            <Link href="/my/write" className="btn">
              독후감 쓰기
            </Link>
            <Link href="/explore" className="btn secondary">
              다른 독후감 둘러보기
            </Link>
          </>
        ) : (
          <>
            <Link href="/signup" className="btn">
              시작하기
            </Link>
            <Link href="/explore" className="btn secondary">
              둘러보기부터 해보기
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

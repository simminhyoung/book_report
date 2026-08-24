import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { stars, formatDate } from "@/lib/format";
import { toggleShare } from "./actions";
import Cover from "@/components/Cover";
import MyShell from "@/components/MyShell";

export const metadata = {
  title: "내 독후감",
  robots: { index: false, follow: false },
};

const TABS = ["전체", "공개", "비공개"];

export default async function MyReviewsPage({ searchParams }) {
  const user = await requireUser();
  const tab = searchParams?.tab && TABS.includes(searchParams.tab) ? searchParams.tab : "전체";

  const allReviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { likes: true, comments: true } } },
  });

  const reviews = allReviews.filter((r) => {
    if (tab === "공개") return r.isPublic;
    if (tab === "비공개") return !r.isPublic;
    return true;
  });

  return (
    <MyShell>
      <div className="page-head" style={{ margin: "0 0 18px" }}>
        <div>
          <h1>내 독후감</h1>
          <span className="subtitle" style={{ marginBottom: 0 }}>
            공개로 바꾼 글만 둘러보기에 올라갑니다.
          </span>
        </div>
        <div className="chip-row">
          {TABS.map((t) => (
            <Link
              key={t}
              href={t === "전체" ? "/my" : `/my?tab=${encodeURIComponent(t)}`}
              className={`chip ${tab === t ? "active" : ""}`}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty">이 조건에 맞는 독후감이 아직 없어요.</div>
      ) : (
        <div className="card-grid">
          {reviews.map((review) => (
            <article className="review-card mine" key={review.id}>
              <div className="review-card-top">
                <Cover src={review.coverUrl} alt={review.bookTitle} size="md" />
                <div className="review-card-meta">
                  <span className={`badge ${review.isPublic ? "public" : "private"}`}>
                    {review.isPublic ? "공개" : "비공개"}
                  </span>
                  <Link href={`/my/${review.id}`} className="title-link">
                    <h2 className="clamp-2">{review.bookTitle}</h2>
                  </Link>
                  <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                    {review.author}
                    {review.genre && ` · ${review.genre}`}
                  </span>
                  {review.rating && <span className="stars">{stars(review.rating)}</span>}
                </div>
              </div>

              {review.oneLiner && <p className="one-liner clamp-4">{review.oneLiner}</p>}

              <div className="engage-row">
                <span>{formatDate(review.updatedAt)} 수정</span>
                <span>
                  {review.isPublic
                    ? `♥ ${review._count.likes} · 💬 ${review._count.comments}`
                    : "나만 볼 수 있어요"}
                </span>
              </div>

              <form action={toggleShare} className="mine-card-toggle">
                <input type="hidden" name="id" value={review.id} />
                <button type="submit" className="btn secondary small" style={{ width: "100%" }}>
                  {review.isPublic ? "비공개로 바꾸기" : "공개하기"}
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </MyShell>
  );
}

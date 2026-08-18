import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { stars } from "@/lib/format";
import { toggleShare } from "./actions";
import DeleteReviewForm from "@/components/DeleteReviewForm";

const TABS = ["전체", "공개", "비공개"];

export default async function MyReviewsPage({ searchParams }) {
  const user = await requireUser();
  const tab = searchParams?.tab && TABS.includes(searchParams.tab) ? searchParams.tab : "전체";

  const allReviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { likes: true, comments: true } } },
  });

  const total = allReviews.length;
  const publicCount = allReviews.filter((r) => r.isPublic).length;
  const privateCount = total - publicCount;
  const rated = allReviews.filter((r) => r.rating);
  const avgRating = rated.length
    ? (rated.reduce((sum, r) => sum + r.rating, 0) / rated.length).toFixed(1)
    : "-";

  const reviews = allReviews.filter((r) => {
    if (tab === "공개") return r.isPublic;
    if (tab === "비공개") return !r.isPublic;
    return true;
  });

  return (
    <div>
      <div className="page-head">
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

      <div className="stat-row">
        <div className="stat-tile">
          <span className="label">기록한 독후감</span>
          <span className="value">{total}편</span>
        </div>
        <div className="stat-tile">
          <span className="label">공개</span>
          <span className="value" style={{ color: "var(--good)" }}>
            {publicCount}편
          </span>
        </div>
        <div className="stat-tile">
          <span className="label">비공개</span>
          <span className="value" style={{ color: "var(--ink-soft)" }}>
            {privateCount}편
          </span>
        </div>
        <div className="stat-tile">
          <span className="label">평균 별점</span>
          <span className="value" style={{ color: "var(--star)" }}>
            {avgRating}
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty">이 조건에 맞는 독후감이 아직 없어요.</div>
      ) : (
        reviews.map((review) => (
          <article className="review-row" key={review.id}>
            <div className="review-row-body">
              <div className="cover sm" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                  <h2>{review.bookTitle}</h2>
                  <span className={`badge ${review.isPublic ? "public" : "private"}`}>
                    {review.isPublic ? "공개" : "비공개"}
                  </span>
                </div>
                <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
                  {review.author}
                  {review.genre && ` · ${review.genre}`}
                  {review.rating && (
                    <>
                      {" · "}
                      <span className="stars">{stars(review.rating)}</span>
                    </>
                  )}
                </span>
                {review.oneLiner && <p className="one-liner">{review.oneLiner}</p>}
                <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>
                  {new Date(review.updatedAt).toLocaleDateString("ko-KR")} 수정 ·{" "}
                  {review.isPublic
                    ? `♥ ${review._count.likes} · 💬 ${review._count.comments}`
                    : "나만 볼 수 있어요"}
                </span>
              </div>
            </div>
            <div className="review-row-actions">
              <form action={toggleShare}>
                <input type="hidden" name="id" value={review.id} />
                <button type="submit" className="btn secondary small">
                  {review.isPublic ? "비공개로 바꾸기" : "공개하기"}
                </button>
              </form>
              <div className="row-links">
                <Link href={`/my/${review.id}/edit`} style={{ color: "var(--brand-dark)", fontWeight: 600 }}>
                  수정
                </Link>
                <DeleteReviewForm id={review.id} />
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

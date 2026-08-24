import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { stars } from "@/lib/format";
import LikeButton from "@/components/LikeButton";
import Cover from "@/components/Cover";
import { addComment } from "../actions";

export async function generateMetadata({ params }) {
  const review = await prisma.review.findUnique({ where: { id: params.id } });

  if (!review || !review.isPublic) {
    return { title: "독후감을 찾을 수 없어요" };
  }

  const description =
    review.oneLiner ||
    review.summary?.slice(0, 140) ||
    `${review.bookTitle} 독후감`;

  return {
    title: `${review.bookTitle} 독후감`,
    description,
    openGraph: {
      title: `${review.bookTitle} 독후감`,
      description,
      type: "article",
      images: review.coverUrl ? [{ url: review.coverUrl }] : undefined,
    },
  };
}

export default async function PublicReviewPage({ params }) {
  const user = await getCurrentUser();

  const review = await prisma.review.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      comments: { include: { user: true }, orderBy: { createdAt: "asc" } },
      _count: { select: { likes: true } },
      likes: user ? { where: { userId: user.id }, select: { id: true } } : false,
    },
  });

  if (!review || !review.isPublic) {
    notFound();
  }

  const related = review.genre
    ? await prisma.review.findMany({
        where: { isPublic: true, genre: review.genre, id: { not: review.id } },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    : [];

  const relatedFallback =
    related.length > 0
      ? related
      : await prisma.review.findMany({
          where: { isPublic: true, id: { not: review.id } },
          orderBy: { createdAt: "desc" },
          take: 3,
        });

  const liked = Boolean(review.likes && review.likes.length > 0);
  const addCommentWithId = addComment.bind(null, review.id);

  return (
    <div className="detail-bounds">
      <Link href="/explore" style={{ fontSize: 13.5, color: "var(--brand-dark)", fontWeight: 600 }}>
        ← 둘러보기
      </Link>

      <div className="detail-layout" style={{ marginTop: 20 }}>
        <div>
          <div className="detail-head">
            <Cover src={review.coverUrl} alt={review.bookTitle} size="lg" />
            <div className="detail-head-meta">
              {review.genre && <span className="badge genre">{review.genre}</span>}
              <h1 style={{ fontSize: 28 }}>{review.bookTitle}</h1>
              <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                {review.author}
                {review.publisher && ` · ${review.publisher}`}
              </span>
              {review.rating && <span className="stars">{stars(review.rating)}</span>}
              <span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>
                {review.user.name || review.user.email.split("@")[0]}
                {review.periodStart && review.periodEnd &&
                  ` · 읽은 기간 ${review.periodStart} – ${review.periodEnd}`}
              </span>
            </div>
          </div>

          {review.oneLiner && <p className="one-liner lg">{review.oneLiner}</p>}

          <div style={{ marginTop: 22 }}>
            {review.summary && (
              <div className="detail-section">
                <div className="section-title">줄거리 요약</div>
                <p>{review.summary}</p>
              </div>
            )}
            {review.reason && (
              <div className="detail-section">
                <div className="section-title">읽은 이유</div>
                <p>{review.reason}</p>
              </div>
            )}
            {review.quotes && (
              <div className="detail-section">
                <div className="section-title">기억하고 싶은 문장</div>
                <p className="quotes-block">{review.quotes}</p>
              </div>
            )}
            {review.thoughts && (
              <div className="detail-section">
                <div className="section-title">생각</div>
                <p>{review.thoughts}</p>
              </div>
            )}
            {review.application && (
              <div className="detail-section">
                <div className="section-title">적용해볼 것</div>
                <p>{review.application}</p>
              </div>
            )}
            {review.recommend && (
              <div className="detail-section">
                <div className="section-title">이런 사람에게 추천</div>
                <p>{review.recommend}</p>
              </div>
            )}
          </div>

          <div className="engage-bar">
            <LikeButton reviewId={review.id} liked={liked} count={review._count.likes} big />
            <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>
              댓글 {review.comments.length}
            </span>
          </div>

          <div>
            {review.comments.map((c) => (
              <div className="comment-item" key={c.id} style={{ marginBottom: 16 }}>
                <div className="comment-avatar">
                  {(c.user.name || c.user.email).slice(0, 1).toUpperCase()}
                </div>
                <div className="comment-body">
                  <span className="comment-meta">
                    {c.user.name || c.user.email.split("@")[0]} ·{" "}
                    {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                  <span style={{ fontSize: 14.5, lineHeight: 1.65, color: "#413a32" }}>
                    {c.body}
                  </span>
                </div>
              </div>
            ))}

            {user ? (
              <form action={addCommentWithId} className="comment-form">
                <textarea name="body" placeholder="이 독후감에 댓글 남기기" required />
                <button type="submit" className="btn small">
                  등록
                </button>
              </form>
            ) : (
              <p style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>
                댓글을 남기려면 <Link href="/login">로그인</Link>해주세요.
              </p>
            )}
          </div>
        </div>

        <aside style={{ paddingTop: 6 }}>
          {relatedFallback.length > 0 && (
            <>
              <div className="section-title" style={{ marginBottom: 10 }}>
                {related.length > 0 ? "같은 장르의 독후감" : "최근 공개된 독후감"}
              </div>
              {relatedFallback.map((r) => (
                <Link href={`/explore/${r.id}`} key={r.id} className="related-item">
                  <span
                    className="clamp-2"
                    style={{ fontFamily: "var(--serif)", fontSize: 14.5, fontWeight: 700 }}
                  >
                    {r.bookTitle}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>{r.author}</span>
                  {r.rating && (
                    <span className="stars" style={{ fontSize: 12 }}>
                      {stars(r.rating)}
                    </span>
                  )}
                </Link>
              ))}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

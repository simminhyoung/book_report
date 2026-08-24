import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { stars, formatDate } from "@/lib/format";
import Cover from "@/components/Cover";
import MyShell from "@/components/MyShell";
import DeleteReviewForm from "@/components/DeleteReviewForm";
import { toggleShare, addSelfReply } from "../actions";

export const metadata = {
  title: "독후감 상세",
  robots: { index: false, follow: false },
};

export default async function MyReviewDetailPage({ params }) {
  const user = await requireUser();

  const review = await prisma.review.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { likes: true, comments: true } },
      selfReplies: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!review || review.userId !== user.id) {
    notFound();
  }

  const addReplyWithId = addSelfReply.bind(null, review.id);

  return (
    <MyShell>
      <Link href="/my" style={{ fontSize: 13.5, color: "var(--brand-dark)", fontWeight: 600 }}>
        ← 내 독후감
      </Link>

      <div className="detail-layout" style={{ marginTop: 20 }}>
        <div>
          <div className="detail-head">
            <Cover src={review.coverUrl} alt={review.bookTitle} size="lg" />
            <div className="detail-head-meta">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {review.genre && <span className="badge genre">{review.genre}</span>}
                <span className={`badge ${review.isPublic ? "public" : "private"}`}>
                  {review.isPublic ? "공개" : "비공개"}
                </span>
              </div>
              <h1 style={{ fontSize: 28 }}>{review.bookTitle}</h1>
              <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                {review.author}
                {review.publisher && ` · ${review.publisher}`}
              </span>
              {review.rating && <span className="stars">{stars(review.rating)}</span>}
              <span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>
                {review.periodStart && review.periodEnd &&
                  `읽은 기간 ${review.periodStart} – ${review.periodEnd} · `}
                {formatDate(review.updatedAt)} 수정
              </span>
            </div>
          </div>

          {review.oneLiner && <p className="one-liner lg">{review.oneLiner}</p>}

          <div style={{ marginTop: 22 }}>
            {review.reason && (
              <div className="detail-section">
                <div className="section-title">읽은 이유</div>
                <p>{review.reason}</p>
              </div>
            )}
            {review.summary && (
              <div className="detail-section">
                <div className="section-title">줄거리 요약</div>
                <p>{review.summary}</p>
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
            {review.note && (
              <div className="detail-section">
                <div className="section-title">나에게 해주고 싶은 말</div>
                <p className="note-block">{review.note}</p>
              </div>
            )}
          </div>

          {review.isPublic && (
            <div className="engage-bar">
              <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                ♥ {review._count.likes} · 댓글 {review._count.comments}
              </span>
              <Link
                href={`/explore/${review.id}`}
                style={{ marginLeft: "auto", fontSize: 13, color: "var(--brand-dark)" }}
              >
                둘러보기에서 보기 →
              </Link>
            </div>
          )}

          {review.note && (
            <div className="self-reply-block">
              <div className="section-title">오늘의 나는 어떻게 생각하나요?</div>
              <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
                남긴 답장은 이 독후감 아래에 함께 보관됩니다.
              </span>

              {review.selfReplies.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "14px 0" }}>
                  {review.selfReplies.map((r) => (
                    <div className="reply-item" key={r.id}>
                      <span className="reply-when">{formatDate(r.createdAt)}의 나</span>
                      <p>{r.body}</p>
                    </div>
                  ))}
                </div>
              )}

              <form action={addReplyWithId} className="comment-form" style={{ marginTop: 14 }}>
                <textarea name="body" placeholder="지금의 생각을 적어보세요." required />
                <button type="submit" className="btn small">
                  답장 남기기
                </button>
              </form>
            </div>
          )}
        </div>

        <aside style={{ paddingTop: 6, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>
                {review.isPublic ? "공개" : "비공개"}
              </span>
              <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
                {review.isPublic
                  ? `♥ ${review._count.likes} · 💬 ${review._count.comments}`
                  : "나만 볼 수 있어요"}
              </span>
            </div>
            <form action={toggleShare}>
              <input type="hidden" name="id" value={review.id} />
              <button type="submit" className="btn secondary small" style={{ width: "100%" }}>
                {review.isPublic ? "비공개로 바꾸기" : "공개하기"}
              </button>
            </form>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href={`/my/${review.id}/edit`} className="btn" style={{ textAlign: "center" }}>
              수정하기
            </Link>
            <DeleteReviewForm id={review.id} />
          </div>
        </aside>
      </div>
    </MyShell>
  );
}

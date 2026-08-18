import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function PublicReviewPage({ params }) {
  const review = await prisma.review.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!review || !review.isPublic) {
    notFound();
  }

  return (
    <div>
      <Link href="/explore">&larr; 목록으로</Link>

      <div className="card" style={{ marginTop: 16 }}>
        <h1 style={{ marginTop: 0 }}>{review.bookTitle}</h1>
        <div className="meta">
          {review.author && <span>{review.author} 지음</span>}
          {review.publisher && <span> · {review.publisher}</span>}
          {review.genre && <span> · {review.genre}</span>}
        </div>
        <div className="meta">
          {review.rating && (
            <span className="stars">{"⭐".repeat(review.rating)} </span>
          )}
          <span>
            {review.user.name || review.user.email.split("@")[0]}님이 작성 ·{" "}
            {new Date(review.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>

        {review.oneLiner && (
          <p style={{ fontWeight: 700, fontSize: 17 }}>&ldquo;{review.oneLiner}&rdquo;</p>
        )}

        {review.reason && (
          <>
            <div className="section-title">이 책을 고른 이유</div>
            <p>{review.reason}</p>
          </>
        )}

        {review.summary && (
          <>
            <div className="section-title">줄거리 / 핵심 내용 요약</div>
            <p>{review.summary}</p>
          </>
        )}

        {review.quotes && (
          <>
            <div className="section-title">인상 깊었던 구절</div>
            <div className="quotes-block">{review.quotes}</div>
          </>
        )}

        {review.thoughts && (
          <>
            <div className="section-title">느낀 점과 생각</div>
            <p>{review.thoughts}</p>
          </>
        )}

        {review.application && (
          <>
            <div className="section-title">나에게 적용할 점</div>
            <p>{review.application}</p>
          </>
        )}

        {review.recommend && (
          <>
            <div className="section-title">함께 읽으면 좋을 책</div>
            <p>{review.recommend}</p>
          </>
        )}
      </div>
    </div>
  );
}

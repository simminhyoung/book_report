import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { toggleShare } from "./actions";
import DeleteReviewForm from "@/components/DeleteReviewForm";

export default async function MyReviewsPage() {
  const user = await requireUser();

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="card-header" style={{ alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>내 독후감</h1>
          <p className="subtitle" style={{ margin: "4px 0 0" }}>
            총 {reviews.length}개의 독후감을 기록했어요.
          </p>
        </div>
        <Link href="/my/write" className="btn">
          + 새 독후감 쓰기
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="empty">
          아직 작성한 독후감이 없어요. 첫 독후감을 남겨보세요!
        </div>
      ) : (
        reviews.map((review) => (
          <div className="card" key={review.id}>
            <div className="card-header">
              <div>
                <h2>{review.bookTitle}</h2>
                <div className="meta">
                  {review.author && <span>{review.author} 지음 · </span>}
                  {review.rating && (
                    <span className="stars">{"⭐".repeat(review.rating)} </span>
                  )}
                </div>
              </div>
              <span className={`badge ${review.isPublic ? "public" : "private"}`}>
                {review.isPublic ? "공개" : "비공개"}
              </span>
            </div>

            {review.oneLiner && <p>{review.oneLiner}</p>}

            <div className="card-actions">
              <Link href={`/my/${review.id}/edit`} className="btn secondary small">
                수정
              </Link>
              <form action={toggleShare}>
                <input type="hidden" name="id" value={review.id} />
                <button type="submit" className="btn secondary small">
                  {review.isPublic ? "비공개로 전환" : "공개로 전환"}
                </button>
              </form>
              <DeleteReviewForm id={review.id} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function ExplorePage({ searchParams }) {
  const q = searchParams?.q?.trim() || "";

  const reviews = await prisma.review.findMany({
    where: {
      isPublic: true,
      ...(q ? { bookTitle: { contains: q } } : {}),
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1>둘러보기</h1>
      <p className="subtitle">다른 사람들이 공유한 독후감을 읽어보세요.</p>

      <form className="searchbar" action="/explore" method="get">
        <input
          type="text"
          name="q"
          placeholder="책 제목으로 검색"
          defaultValue={q}
        />
        <button type="submit" className="btn">
          검색
        </button>
      </form>

      {reviews.length === 0 ? (
        <div className="empty">
          {q ? `"${q}"에 해당하는 공개 독후감이 없어요.` : "아직 공개된 독후감이 없어요."}
        </div>
      ) : (
        reviews.map((review) => (
          <Link href={`/explore/${review.id}`} key={review.id} style={{ textDecoration: "none" }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <h2>{review.bookTitle}</h2>
                  <div className="meta">
                    {review.author && <span>{review.author} 지음 · </span>}
                    {review.rating && (
                      <span className="stars">{"⭐".repeat(review.rating)} </span>
                    )}
                    <span>
                      · {review.user.name || review.user.email.split("@")[0]}님
                    </span>
                  </div>
                </div>
              </div>
              {review.oneLiner && <p>{review.oneLiner}</p>}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

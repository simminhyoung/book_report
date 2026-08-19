import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { GENRES, stars } from "@/lib/format";
import LikeButton from "@/components/LikeButton";
import Cover from "@/components/Cover";

function buildHref(params, overrides) {
  const next = new URLSearchParams();
  Object.entries({ ...params, ...overrides }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      next.set(key, String(value));
    }
  });
  const qs = next.toString();
  return qs ? `/explore?${qs}` : "/explore";
}

const SORTS = [
  { key: "latest", label: "최신순" },
  { key: "likes", label: "좋아요 많은 순" },
  { key: "comments", label: "댓글 많은 순" },
];

const RATING_FILTERS = [
  { key: "4", label: "★★★★ 이상" },
  { key: "3", label: "★★★ 이상" },
  { key: "", label: "전체" },
];

export default async function ExplorePage({ searchParams }) {
  const q = searchParams?.q?.trim() || "";
  const genre = searchParams?.genre || "";
  const minRating = searchParams?.minRating ? Number(searchParams.minRating) : null;
  const sort = searchParams?.sort || "latest";

  const user = await getCurrentUser();

  const where = {
    isPublic: true,
    ...(q
      ? {
          OR: [
            { bookTitle: { contains: q } },
            { author: { contains: q } },
          ],
        }
      : {}),
    ...(genre ? { genre } : {}),
    ...(minRating ? { rating: { gte: minRating } } : {}),
  };

  const orderBy =
    sort === "likes"
      ? { likes: { _count: "desc" } }
      : sort === "comments"
      ? { comments: { _count: "desc" } }
      : { createdAt: "desc" };

  const reviews = await prisma.review.findMany({
    where,
    orderBy,
    include: {
      user: true,
      _count: { select: { likes: true, comments: true } },
      likes: user ? { where: { userId: user.id }, select: { id: true } } : false,
    },
  });

  const params = { q, genre, minRating: minRating || "", sort };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>둘러보기</h1>
          <span className="subtitle" style={{ marginBottom: 0 }}>
            다른 사람들이 공개한 독후감을 읽어보세요.
          </span>
        </div>
        <form className="searchbar" action="/explore" method="get" style={{ marginBottom: 0 }}>
          {genre && <input type="hidden" name="genre" value={genre} />}
          {minRating && <input type="hidden" name="minRating" value={minRating} />}
          {sort !== "latest" && <input type="hidden" name="sort" value={sort} />}
          <input type="text" name="q" placeholder="책 제목, 저자 검색" defaultValue={q} />
          <button type="submit" className="btn">
            검색
          </button>
        </form>
      </div>

      <div className="explore-layout">
        <aside>
          <div className="filter-block">
            <div className="section-title">장르</div>
            <div className="chip-row">
              <Link
                href={buildHref(params, { genre: "" })}
                className={`chip ${genre === "" ? "active" : ""}`}
              >
                전체
              </Link>
              {GENRES.map((g) => (
                <Link
                  key={g}
                  href={buildHref(params, { genre: g })}
                  className={`chip ${genre === g ? "active" : ""}`}
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <div className="section-title">별점</div>
            <div className="filter-list">
              {RATING_FILTERS.map((f) => (
                <Link
                  key={f.key}
                  href={buildHref(params, { minRating: f.key })}
                  className={String(minRating || "") === f.key ? "active" : ""}
                >
                  {f.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <div className="section-title">정렬</div>
            <div className="filter-list">
              {SORTS.map((s) => (
                <Link
                  key={s.key}
                  href={buildHref(params, { sort: s.key })}
                  className={sort === s.key ? "active" : ""}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="page-head" style={{ margin: "0 0 18px" }}>
            <div>
              <h2 style={{ fontSize: 22 }}>{genre ? `${genre} 독후감` : "공개된 독후감"}</h2>
              <span className="subtitle" style={{ marginBottom: 0 }}>
                {reviews.length}편
              </span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="empty">
              {q
                ? `"${q}"에 해당하는 공개 독후감이 없어요.`
                : "이 조건에 맞는 독후감이 아직 없어요."}
            </div>
          ) : (
            <div className="card-grid">
              {reviews.map((review) => {
                const liked = Boolean(review.likes && review.likes.length > 0);
                return (
                  <article className="review-card" key={review.id}>
                    <div className="review-card-top">
                      <Cover src={review.coverUrl} alt={review.bookTitle} size="md" />
                      <div className="review-card-meta">
                        {review.genre && <span className="badge genre">{review.genre}</span>}
                        <Link href={`/explore/${review.id}`} className="title-link">
                          <h2 className="clamp-2">{review.bookTitle}</h2>
                        </Link>
                        {review.author && (
                          <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                            {review.author}
                          </span>
                        )}
                        {review.rating && <span className="stars">{stars(review.rating)}</span>}
                      </div>
                    </div>

                    {review.oneLiner && (
                      <p className="one-liner clamp-4">{review.oneLiner}</p>
                    )}

                    <div className="engage-row">
                      <span>{review.user.name || review.user.email.split("@")[0]}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <LikeButton
                          reviewId={review.id}
                          liked={liked}
                          count={review._count.likes}
                        />
                        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span>💬</span>
                          <span>{review._count.comments}</span>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

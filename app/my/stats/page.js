import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import MyShell from "@/components/MyShell";

export const metadata = {
  title: "독서 통계",
  robots: { index: false, follow: false },
};

const MONTH_LABELS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

function lastSixMonths() {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return months;
}

export default async function MyStatsPage() {
  const user = await requireUser();

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: { _count: { select: { likes: true } } },
  });

  const publicReviews = reviews.filter((r) => r.isPublic);
  const likeTotal = publicReviews.reduce((sum, r) => sum + r._count.likes, 0);

  const topLiked = publicReviews.slice().sort((a, b) => b._count.likes - a._count.likes)[0];
  const likedOnes = publicReviews.filter((r) => r._count.likes > 0);
  const likeAvg = likedOnes.length
    ? (likedOnes.reduce((sum, r) => sum + r._count.likes, 0) / likedOnes.length).toFixed(1)
    : "0";

  const months = lastSixMonths();
  const monthCounts = months.map(({ year, month }) => {
    const count = reviews.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
    return { label: MONTH_LABELS[month], count };
  });
  const maxMonthCount = Math.max(1, ...monthCounts.map((m) => m.count));

  const genreCounts = {};
  reviews.forEach((r) => {
    const g = r.genre || "미지정";
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });
  const maxGenreCount = Math.max(1, ...Object.values(genreCounts));
  const genreRows = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);

  return (
    <MyShell>
      <div className="page-head" style={{ margin: "0 0 18px" }}>
        <div>
          <h1>독서 통계</h1>
          <span className="subtitle" style={{ marginBottom: 0 }}>
            기록이 쌓인 만큼만 보여줍니다.
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty">아직 기록된 독후감이 없어요. 먼저 독후감을 남겨보세요.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="stats-hero-row">
            <div className="stats-tile dark">
              <span className="label">받은 하트</span>
              <div className="big-number">
                <span className="heart">♥</span>
                <span>{likeTotal}</span>
              </div>
              <span className="foot">공개한 독후감에 쌓인 하트</span>
            </div>
            <div className="stats-tile">
              <span className="label">가장 많이 받은 글</span>
              <span className="title">{topLiked && topLiked._count.likes > 0 ? topLiked.bookTitle : "아직 없어요"}</span>
              {topLiked && topLiked._count.likes > 0 && (
                <span className="foot accent">♥ {topLiked._count.likes}</span>
              )}
            </div>
            <div className="stats-tile">
              <span className="label">글당 평균</span>
              <div className="big-number small">
                <span>{likeAvg}</span>
                <span className="unit">하트</span>
              </div>
              <span className="foot">하트가 있는 글 기준</span>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>월별 기록</span>
              <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
                최근 6개월 · 총 {reviews.length}편
              </span>
            </div>
            <div className="bar-chart">
              {monthCounts.map((m) => (
                <div className="bar-col" key={m.label}>
                  <span className="n">{m.count || ""}</span>
                  <div
                    className="bar"
                    style={{
                      height: `${Math.max(3, Math.round((m.count / maxMonthCount) * 96))}px`,
                      background: m.count ? "var(--brand)" : "#efe9df",
                    }}
                  />
                  <span className="label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>장르 분포</span>
            <div className="genre-bars">
              {genreRows.map(([genre, count]) => (
                <div className="genre-bar-row" key={genre}>
                  <span className="name">{genre}</span>
                  <div className="track">
                    <div className="fill" style={{ width: `${Math.round((count / maxGenreCount) * 100)}%` }} />
                  </div>
                  <span className="n">{count}편</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </MyShell>
  );
}

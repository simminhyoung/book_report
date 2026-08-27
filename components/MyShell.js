import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import MySidebarNav from "./MySidebarNav";

// Shared shell for the /my hub: a left sidebar (홈/통계/과거의 내가 보내는 말 +
// a compact stat summary) around whatever page content is passed in. Used by
// /my, /my/stats, /my/past and /my/[id] — but not /my/write or /my/[id]/edit,
// which stay full-width like the write form always has.
export default async function MyShell({ children }) {
  const user = await requireUser();

  const allReviews = await prisma.review.findMany({
    where: { userId: user.id },
    select: { isPublic: true, rating: true },
  });

  const total = allReviews.length;
  const publicCount = allReviews.filter((r) => r.isPublic).length;
  const privateCount = total - publicCount;
  const rated = allReviews.filter((r) => r.rating);
  const avgRating = rated.length
    ? (rated.reduce((sum, r) => sum + r.rating, 0) / rated.length).toFixed(1)
    : "-";

  return (
    <div className="my-shell">
      <aside className="my-aside">
        <MySidebarNav />

        <div className="my-aside-stats">
          <div className="section-title">기록 현황</div>
          <div className="my-stat-list">
            <div className="row">
              <span>기록한 독후감</span>
              <strong>{total}편</strong>
            </div>
            {/* Desktop sidebar: 공개/비공개 as separate rows. */}
            <div className="row stat-row-public">
              <span>공개</span>
              <strong style={{ color: "var(--good)" }}>{publicCount}편</strong>
            </div>
            <div className="row stat-row-private">
              <span>비공개</span>
              <strong style={{ color: "var(--ink-soft)" }}>{privateCount}편</strong>
            </div>
            {/* Mobile: combined into one "공개 · 비공개" tile instead. */}
            <div className="row stat-row-combined">
              <span>공개 · 비공개</span>
              <strong>
                <span style={{ color: "var(--good)" }}>{publicCount}편</span>
                {" · "}
                <span style={{ color: "var(--ink-soft)" }}>{privateCount}편</span>
              </strong>
            </div>
            {/* Average rating: shown on desktop, dropped on mobile. */}
            <div className="row stat-row-avg">
              <span>평균 별점</span>
              <strong style={{ color: "var(--star)" }}>{avgRating}</strong>
            </div>
          </div>
        </div>
      </aside>

      <div className="my-main">{children}</div>
    </div>
  );
}

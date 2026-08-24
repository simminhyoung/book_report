import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { stars, formatDate } from "@/lib/format";
import MyShell from "@/components/MyShell";
import { addSelfReply } from "../actions";

export const metadata = {
  title: "과거의 내가 보내는 말",
  robots: { index: false, follow: false },
};

export default async function MyPastPage({ searchParams }) {
  const user = await requireUser();

  const all = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const withNote = all.filter((r) => r.note && r.note.trim());

  return (
    <MyShell>
      <div className="page-head" style={{ margin: "0 0 18px" }}>
        <div>
          <h1>과거의 내가 보내는 말</h1>
          <span className="subtitle" style={{ marginBottom: 0 }}>
            내가 적은 독후감 중 하나를 무작위로 꺼내 보여줍니다.
          </span>
        </div>
      </div>

      {withNote.length === 0 ? (
        <div className="empty">
          아직 '나에게 해주고 싶은 말'을 남긴 독후감이 없어요.
          <br />
          다음 독후감을 쓸 때 한마디 남겨두면, 나중에 여기서 다시 만날 수 있어요.
        </div>
      ) : (
        <PastContent withNote={withNote} exclude={searchParams?.exclude} addSelfReply={addSelfReply} />
      )}
    </MyShell>
  );
}

function PastContent({ withNote, exclude, addSelfReply }) {
  const pool = withNote.length > 1 ? withNote.filter((r) => r.id !== exclude) : withNote;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  const others = withNote
    .filter((r) => r.id !== chosen.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const addReplyWithId = addSelfReply.bind(null, chosen.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="past-hero">
        <div className="past-hero-top">
          <span className="meta">
            {chosen.bookTitle} · {formatDate(chosen.updatedAt)} 기록
          </span>
          <Link href={`/my/past?exclude=${chosen.id}`} className="shuffle-btn">
            다른 기록 보기
          </Link>
        </div>
        <p className="quote">{chosen.note}</p>
        <div className="past-hero-foot">
          <span>
            {chosen.author}
            {chosen.rating && (
              <>
                {" · "}
                <span className="stars-inline">{stars(chosen.rating)}</span>
              </>
            )}
          </span>
          <Link href={`/my/${chosen.id}`} className="btn" style={{ marginLeft: "auto" }}>
            그때 쓴 독후감 열기
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>오늘의 나는 어떻게 생각하나요?</span>
          <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
            남긴 답장은 그 독후감 아래에 함께 보관됩니다.
          </span>
        </div>
        <form action={addReplyWithId} className="comment-form">
          <textarea name="body" placeholder="지금의 생각을 적어보세요." required />
          <button type="submit" className="btn small">
            답장 남기기
          </button>
        </form>
      </div>

      {others.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div className="section-title">다시 꺼내볼 기록</div>
          <div className="card-grid mini">
            {others.map((r) => (
              <Link href={`/my/${r.id}`} key={r.id} className="mini-card">
                <span className="when">{formatDate(r.updatedAt)} 기록</span>
                <h3>{r.bookTitle}</h3>
                {r.oneLiner && <p className="clamp-2">{r.oneLiner}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

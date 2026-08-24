import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

// The three example "나에게 해주고 싶은 말" cards on the landing page are
// illustrative copy, not real user data — that field is a personal note even
// on public reviews, so we don't pull real notes onto a logged-out marketing
// page. Same idea as the mockup this was designed from.
const NOTE_EXAMPLES = [
  {
    book: "아몬드",
    when: "5월 3일의 나",
    quote: "감정을 배우는 속도는 사람마다 달라. 늦다고 잘못된 건 아니야.",
    strong: true,
  },
  {
    book: "여행의 이유",
    when: "6월 1일의 나",
    quote: "떠나는 이유는 도착한 뒤에 알게 돼. 지금 몰라도 괜찮아.",
  },
  {
    book: "달러구트 꿈 백화점",
    when: "4월 6일의 나",
    quote: "잠들기 전엔 오늘을 채점하지 말자.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "읽고 나서 적습니다",
    body: "읽은 이유, 줄거리, 남은 문장, 그리고 나에게 해주고 싶은 말까지.",
  },
  {
    n: "02",
    title: "고른 글만 나눕니다",
    body: "공개로 바꾼 글에만 하트와 댓글이 달립니다. 나머지는 계속 내 것.",
  },
  {
    n: "03",
    title: "과거의 내가 말을 건넵니다",
    body: "쌓인 기록 중 하나가 불쑥 도착해, 그날의 내가 오늘의 나를 붙듭니다.",
  },
];

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div>
      <div className="landing-hero">
        <div className="landing-copy">
          <span className="landing-badge">독후감 기록 · 선택적 공유</span>
          <h1>
            책을 덮고나면,
            <br />
            여기에 남겨보세요
          </h1>
          <p className="landing-lede">
            나만의 독후감을 기록하고, 공유하고 싶은 글만 골라 다른 사람들과 나눠보세요.
          </p>

          <div className="landing-quote-block">
            <p className="lead">그리고 그때 내가 나에게 해주고 싶었던 말들.</p>
            <p className="sub">
              한 권마다 남긴 한 문장이 모이면, 기억이 흐려진 뒤에도 그 말들이 남아 지친 날의
              나를 다시 일으켜 줍니다.
            </p>
          </div>

          <div className="landing-actions">
            {user ? (
              <>
                <Link href="/my/write" className="btn">
                  첫 독후감 남기기
                </Link>
                <Link href="/explore" className="btn secondary">
                  다른 사람 글 둘러보기
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup" className="btn">
                  첫 독후감 남기기
                </Link>
                <Link href="/explore" className="btn secondary">
                  다른 사람 글 둘러보기
                </Link>
              </>
            )}
          </div>
          <span className="landing-fineprint">
            기본은 비공개입니다 · 공개로 바꾼 글만 둘러보기에 올라갑니다
          </span>
        </div>

        <div className="landing-notes">
          <span className="landing-notes-label">나에게 해주고 싶은 말</span>
          {NOTE_EXAMPLES.map((n) => (
            <div className={`note-example ${n.strong ? "strong" : ""}`} key={n.book}>
              <span className="meta">
                {n.book} · {n.when}
              </span>
              <p>{n.quote}</p>
            </div>
          ))}
          <span className="landing-notes-foot">1년 뒤, 이 말들이 무작위로 다시 찾아옵니다</span>
        </div>
      </div>

      <div className="landing-steps">
        {STEPS.map((s) => (
          <div className="landing-step" key={s.n}>
            <span className="n">{s.n}</span>
            <span className="title">{s.title}</span>
            <span className="body">{s.body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

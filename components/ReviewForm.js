import { Fragment } from "react";
import { GENRES } from "@/lib/format";
import CoverPicker from "./CoverPicker";

export default function ReviewForm({ action, initial = {}, submitLabel = "저장하기" }) {
  return (
    <form action={action} className="write-layout">
      <div className="write-main">
        <div className="form-section">
          <div className="section-title">책 정보</div>

          <CoverPicker initialTitle={initial.bookTitle || ""} initialCoverUrl={initial.coverUrl || ""} />

          <div className="row">
            <div className="field">
              <label htmlFor="author">저자</label>
              <input id="author" name="author" type="text" defaultValue={initial.author || ""} />
            </div>
            <div className="field">
              <label htmlFor="publisher">출판사</label>
              <input
                id="publisher"
                name="publisher"
                type="text"
                defaultValue={initial.publisher || ""}
              />
            </div>
          </div>

          <div className="field">
            <label>장르</label>
            <div className="genre-picker">
              {GENRES.map((g) => (
                <Fragment key={g}>
                  <input
                    type="radio"
                    name="genre"
                    id={`genre-${g}`}
                    value={g}
                    defaultChecked={initial.genre === g}
                  />
                  <label htmlFor={`genre-${g}`}>{g}</label>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="periodStart">읽기 시작</label>
              <input
                id="periodStart"
                name="periodStart"
                type="date"
                defaultValue={initial.periodStart || ""}
              />
            </div>
            <div className="field">
              <label htmlFor="periodEnd">다 읽은 날</label>
              <input
                id="periodEnd"
                name="periodEnd"
                type="date"
                defaultValue={initial.periodEnd || ""}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">총평</div>

          <div className="field">
            <label>별점</label>
            <div className="star-rating">
              {[5, 4, 3, 2, 1].map((n) => (
                <Fragment key={n}>
                  <input
                    type="radio"
                    name="rating"
                    id={`rating-${n}`}
                    value={n}
                    defaultChecked={initial.rating === n}
                  />
                  <label htmlFor={`rating-${n}`}>★</label>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="oneLiner">
              한 줄 총평 <span className="hint">목록과 상세에서 가장 먼저 보이는 문장</span>
            </label>
            <input
              id="oneLiner"
              name="oneLiner"
              type="text"
              maxLength={80}
              defaultValue={initial.oneLiner || ""}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">본문</div>

          <div className="field">
            <label htmlFor="summary">줄거리 요약</label>
            <textarea id="summary" name="summary" defaultValue={initial.summary || ""} />
          </div>

          <div className="field">
            <label htmlFor="reason">읽은 이유</label>
            <textarea id="reason" name="reason" defaultValue={initial.reason || ""} />
          </div>

          <div className="field">
            <label htmlFor="quotes">
              기억하고 싶은 문장 <span className="hint">줄바꿈으로 여러 개 구분</span>
            </label>
            <textarea id="quotes" name="quotes" defaultValue={initial.quotes || ""} />
          </div>

          <div className="field">
            <label htmlFor="thoughts">생각</label>
            <textarea id="thoughts" name="thoughts" defaultValue={initial.thoughts || ""} />
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="application">적용해볼 것</label>
              <textarea
                id="application"
                name="application"
                defaultValue={initial.application || ""}
              />
            </div>
            <div className="field">
              <label htmlFor="recommend">이런 사람에게 추천</label>
              <textarea id="recommend" name="recommend" defaultValue={initial.recommend || ""} />
            </div>
          </div>
        </div>
      </div>

      <aside className="write-sidebar">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="toggle-row">
            <div className="toggle-copy">
              <span className="title">공개 설정</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="isPublic"
                defaultChecked={Boolean(initial.isPublic)}
              />
              <span className="track" />
              <span className="knob" />
            </label>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12.5, lineHeight: 1.6, color: "var(--ink-soft)" }}>
            공개하면 둘러보기 목록에 올라가고 좋아요·댓글을 받을 수 있어요. 나중에 언제든
            바꿀 수 있어요.
          </p>
        </div>

        <button type="submit" className="btn" style={{ width: "100%" }}>
          {submitLabel}
        </button>
      </aside>
    </form>
  );
}

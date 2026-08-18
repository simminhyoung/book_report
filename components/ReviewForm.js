export default function ReviewForm({ action, initial = {}, submitLabel = "저장하기" }) {
  return (
    <form action={action} className="stacked card">
      <div className="section-title">기본 정보</div>

      <div className="field">
        <label htmlFor="bookTitle">책 제목 *</label>
        <input
          id="bookTitle"
          name="bookTitle"
          type="text"
          required
          defaultValue={initial.bookTitle || ""}
        />
      </div>

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

      <div className="row">
        <div className="field">
          <label htmlFor="genre">장르</label>
          <input id="genre" name="genre" type="text" defaultValue={initial.genre || ""} />
        </div>
        <div className="field">
          <label htmlFor="rating">별점 (1~5)</label>
          <select id="rating" name="rating" defaultValue={initial.rating || ""}>
            <option value="">선택 안 함</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {"⭐".repeat(n)} ({n})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="periodStart">읽기 시작한 날</label>
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

      <div className="section-title">독후감 내용</div>

      <div className="field">
        <label htmlFor="reason">이 책을 고른 이유</label>
        <textarea id="reason" name="reason" defaultValue={initial.reason || ""} />
      </div>

      <div className="field">
        <label htmlFor="summary">줄거리 / 핵심 내용 요약</label>
        <textarea id="summary" name="summary" defaultValue={initial.summary || ""} />
      </div>

      <div className="field">
        <label htmlFor="quotes">
          인상 깊었던 구절 <span className="hint">(줄바꿈으로 여러 개 구분)</span>
        </label>
        <textarea id="quotes" name="quotes" defaultValue={initial.quotes || ""} />
      </div>

      <div className="field">
        <label htmlFor="thoughts">느낀 점과 생각</label>
        <textarea id="thoughts" name="thoughts" defaultValue={initial.thoughts || ""} />
      </div>

      <div className="field">
        <label htmlFor="application">나에게 적용할 점</label>
        <textarea id="application" name="application" defaultValue={initial.application || ""} />
      </div>

      <div className="field">
        <label htmlFor="oneLiner">한 줄 총평</label>
        <input id="oneLiner" name="oneLiner" type="text" defaultValue={initial.oneLiner || ""} />
      </div>

      <div className="field">
        <label htmlFor="recommend">함께 읽으면 좋을 책</label>
        <input id="recommend" name="recommend" type="text" defaultValue={initial.recommend || ""} />
      </div>

      <div className="checkbox-field">
        <input
          id="isPublic"
          name="isPublic"
          type="checkbox"
          defaultChecked={Boolean(initial.isPublic)}
        />
        <label htmlFor="isPublic" style={{ marginBottom: 0 }}>
          다른 사람에게 이 독후감을 공개할게요
        </label>
      </div>

      <button type="submit" className="btn">
        {submitLabel}
      </button>
    </form>
  );
}

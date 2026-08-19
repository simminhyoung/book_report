"use client";

import { useEffect, useRef, useState } from "react";
import { searchBookCovers } from "@/app/my/actions";

// Combines the "책 제목" input with an automatic cover search: typing the
// title (debounced) looks up candidate covers, and clicking one selects it.
export default function CoverPicker({ initialTitle = "", initialCoverUrl = "" }) {
  const [title, setTitle] = useState(initialTitle);
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const lastSearchedRef = useRef(initialTitle);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = title.trim();
    if (trimmed.length < 2 || trimmed === lastSearchedRef.current) {
      return undefined;
    }

    debounceRef.current = setTimeout(async () => {
      lastSearchedRef.current = trimmed;
      setLoading(true);
      try {
        const found = await searchBookCovers(trimmed);
        setResults(found);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [title]);

  return (
    <div className="field">
      <label htmlFor="bookTitle">책 제목 *</label>
      <input type="hidden" name="coverUrl" value={coverUrl} />
      <input
        id="bookTitle"
        name="bookTitle"
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoComplete="off"
      />

      {(loading || results.length > 0 || coverUrl) && (
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginTop: 10 }}>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="선택된 표지"
              className="cover md"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="cover md" />
          )}

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
              {loading
                ? "표지 검색 중..."
                : coverUrl
                ? "표지를 선택했어요. 다른 후보를 눌러 바꿀 수 있어요."
                : results.length > 0
                ? "제목과 일치하는 표지 후보예요. 눌러서 선택하세요."
                : "일치하는 표지를 찾지 못했어요."}
            </span>

            {results.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {results.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCoverUrl(r.thumbnail)}
                    title={`${r.title} · ${r.author}`}
                    style={{
                      border:
                        coverUrl === r.thumbnail
                          ? "2px solid var(--brand)"
                          : "1px solid var(--border)",
                      borderRadius: 4,
                      padding: 0,
                      cursor: "pointer",
                      background: "none",
                      width: 40,
                      height: 58,
                      overflow: "hidden",
                      flex: "none",
                    }}
                  >
                    {r.thumbnail ? (
                      <img
                        src={r.thumbnail}
                        alt={r.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="cover sm" style={{ width: "100%", height: "100%" }} />
                    )}
                  </button>
                ))}
                {coverUrl && (
                  <button
                    type="button"
                    className="btn secondary small"
                    onClick={() => setCoverUrl("")}
                  >
                    선택 해제
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

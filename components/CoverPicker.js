"use client";

import { useState } from "react";
import { searchBookCovers } from "@/app/my/actions";

export default function CoverPicker({ initialQuery = "", initialCoverUrl = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const found = await searchBookCovers(query);
      setResults(found);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="field">
      <label>표지</label>
      <input type="hidden" name="coverUrl" value={coverUrl} />

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {coverUrl ? (
          <img src={coverUrl} alt="선택된 표지" className="cover md" style={{ objectFit: "cover" }} />
        ) : (
          <div className="cover md" />
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="책 제목으로 표지 검색"
            />
            <button type="button" className="btn secondary small" onClick={handleSearch} disabled={loading}>
              {loading ? "검색 중..." : "검색"}
            </button>
            {coverUrl && (
              <button
                type="button"
                className="btn secondary small"
                onClick={() => setCoverUrl("")}
              >
                제거
              </button>
            )}
          </div>

          {searched && !loading && results.length === 0 && (
            <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
              검색 결과가 없어요. 다른 검색어로 다시 시도해보세요.
            </span>
          )}

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
                    width: 46,
                    height: 66,
                    overflow: "hidden",
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

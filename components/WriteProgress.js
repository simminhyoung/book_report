"use client";

import { useEffect, useState } from "react";

// Body fields the "본문" section asks for — used only to report how many are
// filled in, never anything else. This reads the actual DOM state of the
// surrounding <form> as the user types, so the number shown is always real —
// no fake autosave/progress claims, just an honest live tally.
const BODY_FIELD_IDS = ["reason", "summary", "quotes", "thoughts"];

function readState() {
  if (typeof document === "undefined") return null;

  const title = document.getElementById("bookTitle")?.value?.trim() || "";
  const oneLiner = document.getElementById("oneLiner")?.value?.trim() || "";
  const rating = document.querySelector('input[name="rating"]:checked');
  const bodyFilled = BODY_FIELD_IDS.filter(
    (id) => document.getElementById(id)?.value?.trim()
  ).length;

  return {
    titleDone: Boolean(title),
    ratingDone: Boolean(rating),
    oneLinerDone: Boolean(oneLiner),
    bodyFilled,
  };
}

export default function WriteProgress() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const update = () => setState(readState());
    update();

    const form = document.querySelector(".write-layout");
    if (!form) return undefined;

    form.addEventListener("input", update);
    form.addEventListener("change", update);
    return () => {
      form.removeEventListener("input", update);
      form.removeEventListener("change", update);
    };
  }, []);

  if (!state) return null;

  const requiredDone = state.titleDone && state.ratingDone && state.oneLinerDone;
  const totalSteps = 3 + BODY_FIELD_IDS.length;
  const doneSteps =
    (state.titleDone ? 1 : 0) +
    (state.ratingDone ? 1 : 0) +
    (state.oneLinerDone ? 1 : 0) +
    state.bodyFilled;
  const percent = Math.round((doneSteps / totalSteps) * 100);

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <span style={{ fontSize: 13.5, fontWeight: 700 }}>작성 상태</span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 7,
          fontSize: 13,
          color: "var(--ink-soft)",
          margin: "10px 0",
        }}
      >
        <span>
          책 제목 · 별점 · 한 줄 총평{" "}
          {requiredDone ? (
            <span style={{ color: "var(--good)", fontWeight: 600 }}>완료</span>
          ) : (
            <span style={{ color: "var(--ink-faint)" }}>작성 중</span>
          )}
        </span>
        <span>
          본문 {BODY_FIELD_IDS.length}칸 중 {state.bodyFilled}칸 작성
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: "#f0ebe2", overflow: "hidden" }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "var(--brand)",
            transition: "width 0.15s ease",
          }}
        />
      </div>
    </div>
  );
}

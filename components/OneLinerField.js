"use client";

import { useState } from "react";

const MAX_LEN = 60;

// The "한 줄 총평" input with a live character counter — split out as its own
// client component so the rest of ReviewForm can stay a plain server component.
export default function OneLinerField({ initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="field">
      <label htmlFor="oneLiner">
        한 줄 총평 <span className="hint">목록과 상세에서 가장 먼저 보이는 문장</span>
      </label>
      <input
        id="oneLiner"
        name="oneLiner"
        type="text"
        maxLength={MAX_LEN}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
      />
      <span
        style={{
          display: "block",
          textAlign: "right",
          fontSize: 12,
          color: "var(--ink-mute)",
          marginTop: 4,
        }}
      >
        {value.length} / {MAX_LEN}자
      </span>
    </div>
  );
}

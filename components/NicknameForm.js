"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateNickname } from "@/app/my/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? "저장 중..." : "저장하기"}
    </button>
  );
}

export default function NicknameForm({ currentName, saved }) {
  const [state, formAction] = useFormState(updateNickname, null);

  return (
    <form action={formAction} className="stacked">
      {state?.error && <div className="error">{state.error}</div>}
      {saved && !state?.error && (
        <div style={{ fontSize: 13, color: "var(--good)" }}>별명이 저장됐어요.</div>
      )}
      <div className="field">
        <label htmlFor="name">별명</label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={currentName}
          placeholder="예: 책벌레"
          maxLength={30}
        />
        <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
          비워두면 이메일이 대신 표시돼요.
        </span>
      </div>
      <SubmitButton />
    </form>
  );
}

"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/app/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? "로그인 중..." : "로그인"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <div className="card auth-card">
      <h1>로그인</h1>
      <form action={formAction} className="stacked">
        {state?.error && <div className="error">{state.error}</div>}
        <div className="field">
          <label htmlFor="email">이메일</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <SubmitButton />
      </form>
      <p className="auth-switch">
        아직 계정이 없으신가요? <Link href="/signup">회원가입</Link>
      </p>
    </div>
  );
}

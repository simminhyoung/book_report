"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signupAction } from "@/app/signup/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? "가입 중..." : "회원가입"}
    </button>
  );
}

export default function SignupForm() {
  const [state, formAction] = useFormState(signupAction, null);

  return (
    <div className="card auth-card">
      <h1>회원가입</h1>
      <form action={formAction} className="stacked">
        {state?.error && <div className="error">{state.error}</div>}
        <div className="field">
          <label htmlFor="name">닉네임 (선택)</label>
          <input id="name" name="name" type="text" autoComplete="nickname" />
        </div>
        <div className="field">
          <label htmlFor="email">이메일</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="password">비밀번호 <span className="hint">(6자 이상)</span></label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <div className="field">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <SubmitButton />
      </form>
      <p className="auth-switch">
        이미 계정이 있으신가요? <Link href="/login">로그인</Link>
      </p>
    </div>
  );
}

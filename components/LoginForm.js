import Link from "next/link";

const ERROR_MESSAGES = {
  google: "구글 로그인 중 문제가 발생했어요. 다시 시도해주세요.",
  google_email: "이메일 인증이 안 된 구글 계정이에요. 다른 계정으로 시도해주세요.",
};

export default function LoginForm({ error }) {
  return (
    <div className="card auth-card">
      <h1>로그인</h1>
      {error && <div className="error">{ERROR_MESSAGES[error] || ERROR_MESSAGES.google}</div>}
      <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "12px 0 20px" }}>
        구글 계정으로 간편하게 시작하세요.
      </p>
      <Link
        href="/api/auth/google"
        className="btn"
        style={{ width: "100%", textAlign: "center", display: "block" }}
      >
        Google로 계속하기
      </Link>
    </div>
  );
}

import MyShell from "@/components/MyShell";
import NicknameForm from "@/components/NicknameForm";
import { requireUser } from "@/lib/auth";

export const metadata = {
  title: "설정",
  robots: { index: false, follow: false },
};

export default async function MySettingsPage({ searchParams }) {
  const user = await requireUser();

  return (
    <MyShell>
      <div className="card" style={{ maxWidth: 420 }}>
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>설정</h1>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 20 }}>
          {user.email}로 로그인 중
        </p>
        <NicknameForm currentName={user.name || ""} saved={searchParams?.saved === "1"} />
      </div>
    </MyShell>
  );
}

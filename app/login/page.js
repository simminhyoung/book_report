import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "로그인",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}

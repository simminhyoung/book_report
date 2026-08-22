import SignupForm from "@/components/SignupForm";

export const metadata = {
  title: "회원가입",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupForm />;
}

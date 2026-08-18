import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "독후감 나눔",
  description: "책을 읽고 독후감을 기록하고, 원하는 글만 골라 공유해보세요.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Nav />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}

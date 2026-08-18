import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "독후감 나눔",
  description: "책을 읽고 독후감을 기록하고, 원하는 글만 골라 공유해보세요.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}

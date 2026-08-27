import "./globals.css";
import Nav from "@/components/Nav";
import MobileTabBar from "@/components/MobileTabBar";
import { getCurrentUser } from "@/lib/auth";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  verification: {
    google: "jbJKKw7HVAKV3Wksp6PdFtzqSJGqbsNthMViA3um9oA",
    other: {
      "naver-site-verification": "882483792012c5190767d91dccc84a071378d10a",
    },
  },
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

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
        <Nav user={user} />
        <div className="container">{children}</div>
        {/* Mobile-only bottom tab bar (둘러보기/내 독후감/쓰기) — replaces the
            top nav's tabs + write button on small screens. Rendered after
            the page content so its in-flow spacer reserves space at the
            bottom of the scrollable page, not up near the header. */}
        {user && <MobileTabBar />}
      </body>
    </html>
  );
}

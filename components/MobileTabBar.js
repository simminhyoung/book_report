"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The mobile design replaces the desktop top-nav tabs + write button with a
// fixed bottom tab bar (둘러보기 / 내 독후감 / 쓰기). Only rendered for logged-in
// users — Nav.js decides that — since logged-out visitors just have the
// landing page's own CTAs.
const ITEMS = [
  { key: "explore", href: "/explore", label: "둘러보기" },
  { key: "my", href: "/my", label: "내 독후감" },
  { key: "write", href: "/my/write", label: "쓰기" },
];

function activeKeyFor(pathname) {
  if (pathname.startsWith("/my/write")) return "write";
  if (pathname.startsWith("/my")) return "my";
  if (pathname.startsWith("/explore")) return "explore";
  return null;
}

export default function MobileTabBar() {
  const pathname = usePathname();
  const active = activeKeyFor(pathname);

  return (
    <>
      <nav className="mobile-tabbar">
        {ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`mobile-tab-item ${active === item.key ? "active" : ""}`}
          >
            <span className="icon">
              {item.key === "write" ? "＋" : active === item.key ? "◆" : "◇"}
            </span>
            <span className="label">{item.label}</span>
          </Link>
        ))}
      </nav>
      {/* Reserves space in normal flow so fixed-position bar never covers content. */}
      <div className="mobile-tabbar-spacer" aria-hidden="true" />
    </>
  );
}

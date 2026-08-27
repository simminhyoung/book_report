"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/my", label: "홈", hint: "내가 기록한 독후감" },
  { href: "/my/stats", label: "통계", hint: "읽은 흐름과 취향" },
  { href: "/my/past", label: "과거의 말", hint: "지난 기록에서 온 문장" },
];

export default function MySidebarNav() {
  const pathname = usePathname();

  return (
    <div className="my-nav">
      {ITEMS.map((item) => {
        // "/my" itself must not match every "/my/..." sub-route (including
        // the /my/[id] detail pages this sidebar also wraps), so it gets an
        // exact match while the other two tabs match by prefix.
        const active =
          item.href === "/my" ? pathname === "/my" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={`my-nav-item ${active ? "active" : ""}`}>
            <span className="label">{item.label}</span>
            <span className="hint">{item.hint}</span>
          </Link>
        );
      })}
    </div>
  );
}

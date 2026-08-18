"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <span className="navtabs">
      <Link href="/explore" className={pathname.startsWith("/explore") ? "active" : ""}>
        둘러보기
      </Link>
      <Link href="/my" className={pathname.startsWith("/my") ? "active" : ""}>
        내 독후감
      </Link>
    </span>
  );
}

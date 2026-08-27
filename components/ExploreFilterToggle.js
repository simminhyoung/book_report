"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Mobile-only dropdown toggle for the /explore 장르·별점·정렬 filters.
// A plain <details>/<summary> looked right at first, but its open/closed
// state is native DOM state React never touches — after tapping a filter
// Link (a client-side route change, not a full reload), React reuses the
// same DOM node and the dropdown stayed stuck open. This keeps the open
// state in React instead, so it reliably closes both on re-toggle and the
// instant the URL (i.e. the selected filter) actually changes.
export default function ExploreFilterToggle({ label, children }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    setOpen(false);
  }, [urlKey]);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, [open]);

  return (
    <div className={`filter-block ${open ? "open" : ""}`} ref={wrapRef}>
      <button
        type="button"
        className="filter-toggle-btn"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="filter-current">{label}</span>
        <span className="caret" aria-hidden="true">
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open && <div className="filter-body">{children}</div>}
    </div>
  );
}

"use client";

import { deleteReview } from "@/app/my/actions";

export default function DeleteReviewForm({ id }) {
  return (
    <form
      action={deleteReview}
      onSubmit={(e) => {
        if (!confirm("정말 이 독후감을 삭제할까요? 삭제하면 되돌릴 수 없어요.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        style={{
          border: "none",
          background: "none",
          padding: 0,
          font: "inherit",
          fontSize: 12.5,
          color: "var(--ink-faint)",
          cursor: "pointer",
        }}
      >
        삭제
      </button>
    </form>
  );
}

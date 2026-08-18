import { toggleLike } from "@/app/explore/actions";

export default function LikeButton({ reviewId, liked, count, big = false }) {
  return (
    <form action={toggleLike} style={{ display: "inline" }}>
      <input type="hidden" name="reviewId" value={reviewId} />
      <button
        type="submit"
        className={`like-btn ${liked ? "liked" : ""} ${big ? "big" : ""}`}
      >
        <span>{liked ? "♥" : "♡"}</span>
        <span>{big ? `좋아요 ${count}` : count}</span>
      </button>
    </form>
  );
}

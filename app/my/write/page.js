import { requireUser } from "@/lib/auth";
import ReviewForm from "@/components/ReviewForm";
import { createReview } from "../actions";

export default async function WriteReviewPage() {
  await requireUser();

  return (
    <div>
      <h1>새 독후감 쓰기</h1>
      <p className="subtitle">
        다 채우지 않아도 괜찮아요. 필요한 항목만 적어보세요.
      </p>
      <ReviewForm action={createReview} submitLabel="독후감 저장하기" />
    </div>
  );
}

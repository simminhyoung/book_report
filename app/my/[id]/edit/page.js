import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import ReviewForm from "@/components/ReviewForm";
import { updateReview } from "../../actions";

export const metadata = {
  title: "독후감 수정하기",
  robots: { index: false, follow: false },
};

export default async function EditReviewPage({ params }) {
  const user = await requireUser();
  const review = await prisma.review.findUnique({ where: { id: params.id } });

  if (!review || review.userId !== user.id) {
    notFound();
  }

  const updateWithId = updateReview.bind(null, review.id);

  return (
    <div>
      <h1>독후감 수정하기</h1>
      <ReviewForm action={updateWithId} initial={review} submitLabel="수정 완료" />
    </div>
  );
}

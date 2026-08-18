"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function toggleLike(formData) {
  const user = await requireUser();
  const reviewId = formData.get("reviewId")?.toString();
  const redirectTo = formData.get("redirectTo")?.toString();
  if (!reviewId) return;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || !review.isPublic) return;

  const existing = await prisma.like.findUnique({
    where: { reviewId_userId: { reviewId, userId: user.id } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { reviewId, userId: user.id } });
  }

  revalidatePath("/explore");
  revalidatePath(`/explore/${reviewId}`);
  if (redirectTo) revalidatePath(redirectTo);
}

export async function addComment(reviewId, formData) {
  const user = await requireUser();
  const body = formData.get("body")?.toString().trim();
  if (!body) return;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || !review.isPublic) return;

  await prisma.comment.create({ data: { reviewId, userId: user.id, body } });
  revalidatePath(`/explore/${reviewId}`);
}

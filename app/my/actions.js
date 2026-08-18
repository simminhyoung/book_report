"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

function extractReviewData(formData) {
  const ratingRaw = formData.get("rating")?.toString();
  const rating = ratingRaw ? Number(ratingRaw) : null;

  return {
    bookTitle: formData.get("bookTitle")?.toString().trim() || "",
    author: formData.get("author")?.toString().trim() || null,
    publisher: formData.get("publisher")?.toString().trim() || null,
    genre: formData.get("genre")?.toString().trim() || null,
    periodStart: formData.get("periodStart")?.toString() || null,
    periodEnd: formData.get("periodEnd")?.toString() || null,
    rating: Number.isFinite(rating) && rating >= 1 && rating <= 5 ? rating : null,
    reason: formData.get("reason")?.toString() || null,
    summary: formData.get("summary")?.toString() || null,
    quotes: formData.get("quotes")?.toString() || null,
    thoughts: formData.get("thoughts")?.toString() || null,
    application: formData.get("application")?.toString() || null,
    oneLiner: formData.get("oneLiner")?.toString() || null,
    recommend: formData.get("recommend")?.toString() || null,
    isPublic: formData.get("isPublic") === "on",
  };
}

export async function createReview(formData) {
  const user = await requireUser();
  const data = extractReviewData(formData);

  if (!data.bookTitle) {
    throw new Error("책 제목은 필수예요.");
  }

  await prisma.review.create({ data: { ...data, userId: user.id } });
  revalidatePath("/my");
  revalidatePath("/explore");
  redirect("/my");
}

export async function updateReview(id, formData) {
  const user = await requireUser();
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    redirect("/my");
  }

  const data = extractReviewData(formData);
  if (!data.bookTitle) {
    throw new Error("책 제목은 필수예요.");
  }

  await prisma.review.update({ where: { id }, data });
  revalidatePath("/my");
  revalidatePath("/explore");
  redirect("/my");
}

export async function deleteReview(formData) {
  const user = await requireUser();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const existing = await prisma.review.findUnique({ where: { id } });
  if (existing && existing.userId === user.id) {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/my");
    revalidatePath("/explore");
  }
}

export async function toggleShare(formData) {
  const user = await requireUser();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const existing = await prisma.review.findUnique({ where: { id } });
  if (existing && existing.userId === user.id) {
    await prisma.review.update({
      where: { id },
      data: { isPublic: !existing.isPublic },
    });
    revalidatePath("/my");
    revalidatePath("/explore");
  }
}

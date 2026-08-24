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
    coverUrl: formData.get("coverUrl")?.toString().trim() || null,
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
    note: formData.get("note")?.toString() || null,
    isPublic: formData.get("isPublic") === "on",
  };
}

export async function createReview(formData) {
  const user = await requireUser();
  const data = extractReviewData(formData);

  if (!data.bookTitle) {
    throw new Error("책 제목은 필수예요.");
  }

  const created = await prisma.review.create({ data: { ...data, userId: user.id } });
  revalidatePath("/my");
  revalidatePath("/my/stats");
  revalidatePath("/explore");
  redirect(`/my/${created.id}`);
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
  revalidatePath(`/my/${id}`);
  revalidatePath("/my/stats");
  revalidatePath("/explore");
  revalidatePath(`/explore/${id}`);
  redirect(`/my/${id}`);
}

export async function deleteReview(formData) {
  const user = await requireUser();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const existing = await prisma.review.findUnique({ where: { id } });
  if (existing && existing.userId === user.id) {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/my");
    revalidatePath("/my/stats");
    revalidatePath("/my/past");
    revalidatePath("/explore");
  }

  // Deleting can be triggered from the /my/[id] detail page as well as the
  // grid itself — always land back on the list so we never re-render a
  // detail page for a review that no longer exists.
  redirect("/my");
}

// Searches the Kakao Book Search API for cover candidates matching a query
// (book title, optionally + author). Returns [] on any failure so the UI can
// fall back to manual entry — this is a nice-to-have, never a hard dependency.
export async function searchBookCovers(query) {
  const trimmed = query?.toString().trim();
  if (!trimmed) return [];

  const apiKey = process.env.KAKAO_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v3/search/book?target=title&size=8&query=${encodeURIComponent(
        trimmed
      )}`,
      {
        headers: { Authorization: `KakaoAK ${apiKey}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];

    const data = await res.json();
    return (data.documents || []).map((d) => ({
      title: d.title,
      author: (d.authors || []).join(", "),
      publisher: d.publisher,
      thumbnail: d.thumbnail || "",
    }));
  } catch {
    return [];
  }
}

// Adds a reply to one's own past review — the "오늘의 나는 어떻게 생각하나요?"
// box on the 과거의 내가 보내는 말 page (and on the review's own detail page).
export async function addSelfReply(reviewId, formData) {
  const user = await requireUser();
  const body = formData.get("body")?.toString().trim();
  if (!body) return;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.userId !== user.id) return;

  await prisma.selfReply.create({ data: { reviewId, userId: user.id, body } });
  revalidatePath(`/my/${reviewId}`);
  revalidatePath("/my/past");
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
    revalidatePath(`/my/${id}`);
    revalidatePath("/explore");
    revalidatePath(`/explore/${id}`);
  }
}

import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export default async function sitemap() {
  const reviews = await prisma.review.findMany({
    where: { isPublic: true },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/explore`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...reviews.map((r) => ({
      url: `${SITE_URL}/explore/${r.id}`,
      lastModified: r.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];
}

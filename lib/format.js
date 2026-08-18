export const GENRES = ["소설", "에세이", "역사", "과학", "자기계발", "기타"];

export function stars(n) {
  const filled = Math.max(0, Math.min(5, n || 0));
  return "★★★★★".slice(0, filled) + "☆☆☆☆☆".slice(0, 5 - filled);
}

export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
}

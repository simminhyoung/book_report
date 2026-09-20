// Central place for the site's public URL so metadata, sitemap.xml and
// robots.txt all agree. Override with the SITE_URL env var if the app moves
// to a custom domain later.
export const SITE_URL = process.env.SITE_URL || "https://dokhoogam-app.onrender.com";
export const SITE_NAME = "독후감 나눔";
export const SITE_DESCRIPTION =
  "내 독후감을 기록하고, 공개할 글만 골라 나눠보세요. 남겨둔 한마디는 어느날 다시 나를 찾아옵니다.";

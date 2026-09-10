// components/BuyBookButtons.jsx
//
// 독후감 상세 페이지(/my/[id], /explore/[id])에 넣는 "이 책 구매하기" 버튼들.
// 지금은 제휴 승인 전이라 일반 검색 링크로 연결되지만,
// 나중에 알라딘 TTB나 교보문고 파트너스 승인을 받으면
// href 뒤에 제휴 파라미터(TTBKey, 파트너 ID 등)만 추가하면 됩니다.
//
// 사용법 (예: app/my/[id]/page.js 또는 app/explore/[id]/page.js 안에서):
//   import BuyBookButtons from "@/components/BuyBookButtons";
//   ...
//   <BuyBookButtons bookTitle={review.bookTitle} author={review.author} />

export default function BuyBookButtons({ bookTitle, author }) {
  const query = encodeURIComponent(
    author ? `${bookTitle} ${author}` : bookTitle
  );

  const stores = [
    {
      name: "알라딘",
      url: `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=Book&SearchWord=${query}`,
      color: "#0968a4",
    },
    {
      name: "교보문고",
      url: `https://search.kyobobook.co.kr/search?keyword=${query}&target=total`,
      color: "#4dae3d",
    },
    {
      name: "예스24",
      url: `https://www.yes24.com/product/search?domain=BOOK&query=${query}`,
      color: "#e4002b",
    },
  ];

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" }}>
      {stores.map((store) => (
        <a
          key={store.name}
          href={store.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: `1px solid ${store.color}`,
            color: store.color,
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {store.name}에서 구매하기
        </a>
      ))}
    </div>
  );
}

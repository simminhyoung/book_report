# 독후감 나눔

이메일/비밀번호로 로그인해서 나만의 독후감을 기록하고, 원하는 글만 골라
공개하거나 비공개로 둘 수 있는 웹 앱입니다. `/explore` 페이지에서는 다른
사람들이 공개한 독후감을 검색·필터링하며 읽고, 좋아요와 댓글을 남길 수
있어요. (Claude Design 리디자인 시안을 기반으로 리뉴얼했습니다.)

## 기술 스택

- **Next.js 14** (App Router, Server Actions) — 프론트엔드 + 백엔드를 한
  프로젝트에서 처리
- **Prisma + PostgreSQL** — Render에 만든 Postgres 데이터베이스를 사용해요
- **bcryptjs** — 비밀번호 해시
- 세션은 자체 구현 (DB에 세션 토큰을 저장하고, httpOnly 쿠키로 관리)
- Noto Serif KR / Noto Sans KR (Google Fonts)

## 주요 화면

| 경로 | 설명 |
|---|---|
| `/` | 랜딩 페이지 |
| `/signup`, `/login` | 회원가입 / 로그인 |
| `/my` | 내가 쓴 독후감 (통계 카드, 전체/공개/비공개 탭, 공개 전환, 수정, 삭제) |
| `/my/write` | 새 독후감 작성 (책 정보 → 총평 → 본문, 장르·별점 선택형) |
| `/my/[id]/edit` | 독후감 수정 |
| `/explore` | 공개 독후감 둘러보기 — 검색, 장르/별점 필터, 정렬(최신·좋아요·댓글) |
| `/explore/[id]` | 공개 독후감 상세 — 좋아요, 댓글, 같은 장르 추천 |

### 리디자인에서 새로 생긴 기능

- 독후감 **좋아요**·**댓글** (로그인한 사용자만 가능)
- 둘러보기 장르/별점 필터 + 정렬(최신순 · 좋아요순 · 댓글순)
- 상세 페이지의 "같은 장르 추천" 사이드바
- 내 독후감 통계 카드(기록 수·공개·비공개·평균 별점), 상태 탭
- 글쓰기 폼의 장르 단일 선택 칩, 별점 클릭 선택 UI

### 시안에는 있었지만 이번에 넣지 않은 것

- 상단 내비게이션의 "통계" 탭 (실제 통계 페이지는 아직 없어요)
- 글쓰기 화면의 "작성 상태 진행률" / "자동 저장됨" 표시 (실제 자동저장
  기능은 구현하지 않았어요 — 있는 척하는 UI를 넣고 싶지 않았습니다)
- 그리드/목록 보기 전환, 표지 이미지 업로드 (표지는 자리표시자 패턴만)

## 배포 (Render)

이 프로젝트는 Render(https://render.com)에 배포하도록 구성되어 있어요.

1. 이 폴더 전체를 GitHub 저장소에 올려주세요 (repo 루트에 `package.json`이
   바로 보여야 해요).
2. Render의 Postgres 인스턴스를 하나 만들고, "External Database URL"을
   복사해두세요.
3. Render에서 Web Service를 만들 때:
   - **Build Command**: `npm install && npx prisma db push --accept-data-loss && npm run build`
   - **Start Command**: `npm run start`
   - **환경 변수**: `DATABASE_URL` = 위에서 복사한 Postgres 연결 문자열,
     `NODE_ENV` = `production`

## 로컬에서 실행하기

이 프로젝트는 `node_modules`가 포함되어 있지 않아요 (용량 때문에 제외했습니다).
아래 순서대로 실행해주세요. Node.js 18 이상이 설치되어 있어야 합니다.

```bash
cd dokhoogam-app

# 1. 패키지 설치
npm install

# 2. .env 파일에 Postgres 연결 문자열 넣기 (Render 대시보드 > Postgres > Connect
#    > External Database URL 을 복사해서 DATABASE_URL 값에 붙여넣기)

# 3. 데이터베이스 스키마 반영 (최초 1회, 스키마가 바뀔 때마다 다시 실행)
npx prisma db push

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속하면 됩니다.

로컬 개발과 배포된 서비스가 같은 Postgres를 공유해도 되고, 필요하면 로컬용
Postgres를 따로 만들어 `.env`만 다르게 설정해도 됩니다.

## 나중에 이어서 만들면 좋은 것들

- 구글 로그인(OAuth) 추가
- 프로필 이미지, 자기소개
- 독후감에 댓글 / 좋아요 기능
- 저자, 장르로도 검색/필터링
- 이메일 인증, 비밀번호 재설정
- `prisma db push` 대신 `prisma migrate`로 정식 마이그레이션 이력 관리

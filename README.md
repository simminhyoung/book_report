# 독후감 나눔

이메일/비밀번호로 로그인해서 나만의 독후감을 기록하고, 원하는 글만 골라
공개하거나 비공개로 둘 수 있는 웹 앱입니다. `/explore` 페이지에서는 다른
사람들이 공개한 독후감을 책 제목으로 검색해서 볼 수 있어요.

## 기술 스택

- **Next.js 14** (App Router, Server Actions) — 프론트엔드 + 백엔드를 한
  프로젝트에서 처리
- **Prisma + SQLite** — 별도 DB 서버 설치 없이 파일 하나(`prisma/dev.db`)로
  동작하는 데이터베이스
- **bcryptjs** — 비밀번호 해시
- 세션은 자체 구현 (DB에 세션 토큰을 저장하고, httpOnly 쿠키로 관리)

## 주요 화면

| 경로 | 설명 |
|---|---|
| `/` | 랜딩 페이지 |
| `/signup`, `/login` | 회원가입 / 로그인 |
| `/my` | 내가 쓴 독후감 목록 (공개/비공개 전환, 수정, 삭제) |
| `/my/write` | 새 독후감 작성 |
| `/my/[id]/edit` | 독후감 수정 |
| `/explore` | 다른 사람이 **공개**로 설정한 독후감 목록 + 책 제목 검색 |
| `/explore/[id]` | 공개 독후감 상세 보기 |

## 로컬에서 실행하기

이 프로젝트는 `node_modules`가 포함되어 있지 않아요 (용량 때문에 제외했습니다).
아래 순서대로 실행해주세요. Node.js 18 이상이 설치되어 있어야 합니다.

```bash
cd dokhoogam-app

# 1. 패키지 설치
npm install

# 2. 데이터베이스 파일 생성 (최초 1회, 스키마가 바뀔 때마다 다시 실행)
npx prisma db push

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속하면 됩니다.

`.env` 파일에 이미 `DATABASE_URL="file:./dev.db"`가 들어있어서 별도 설정
없이 바로 SQLite 파일이 생성돼요.

## 실제 서비스로 배포하고 싶다면

- Vercel 등에 올릴 경우 SQLite 파일은 서버리스 환경에서 영속되지 않으니,
  Prisma의 `datasource`를 Postgres(예: Vercel Postgres, Supabase, Neon
  등)로 바꾸고 `DATABASE_URL`만 교체하면 나머지 코드는 그대로 동작해요.
- 프로덕션에서는 `.env`의 값을 호스팅 서비스의 환경 변수로 옮기고, 쿠키의
  `secure` 옵션이 자동으로 켜지도록 이미 구현되어 있어요
  (`NODE_ENV === "production"`일 때).

## 나중에 이어서 만들면 좋은 것들

- 구글 로그인(OAuth) 추가
- 프로필 이미지, 자기소개
- 독후감에 댓글 / 좋아요 기능
- 저자, 장르로도 검색/필터링
- 이메일 인증, 비밀번호 재설정

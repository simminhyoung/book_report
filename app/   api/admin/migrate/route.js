// app/api/admin/migrate/route.js
//
// 임시 마이그레이션 라우트입니다.
// 기존(무료, 곧 만료) DB의 데이터를 새(유료) DB로 복사합니다.
// 브라우저에서 아래 URL로 한 번 접속하면 실행됩니다:
//   https://dokhoogam-app.onrender.com/api/admin/migrate?secret=MIGRATE_SECRET값
//
// 사용 전 Render 대시보드 > 웹 서비스(dokhoogam-app) > Environment 에서
// 아래 3개 환경변수를 설정하세요:
//   1) DATABASE_URL      -> 새 DB(dokhoogam-db-prod)의 Internal Database URL 로 교체
//   2) OLD_DATABASE_URL  -> 기존 DB(dokhoogam-db)의 External Database URL 추가
//   3) MIGRATE_SECRET    -> 아무 임의의 긴 문자열 (예: 32자 랜덤 문자열)
//
// 마이그레이션 확인 후에는 반드시 이 파일을 삭제하고 다시 배포하세요.
// (외부에서 이 URL을 알면 DB에 접근할 수 있는 민감한 엔드포인트입니다.)

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.MIGRATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.OLD_DATABASE_URL) {
    return NextResponse.json(
      { error: "OLD_DATABASE_URL 환경변수가 설정되어 있지 않습니다" },
      { status: 500 }
    );
  }

  // 기존(원본) DB에 연결
  const oldDb = new PrismaClient({
    datasources: { db: { url: process.env.OLD_DATABASE_URL } },
  });
  // 새(대상) DB에 연결 - DATABASE_URL 환경변수 사용
  const newDb = new PrismaClient();

  const summary = {};

  try {
    // 외래키 관계 순서대로 복사: User -> Session/Review -> Like/Comment/SelfReply

    const users = await oldDb.user.findMany();
    await newDb.user.createMany({ data: users, skipDuplicates: true });
    summary.users = users.length;

    const sessions = await oldDb.session.findMany();
    await newDb.session.createMany({ data: sessions, skipDuplicates: true });
    summary.sessions = sessions.length;

    const reviews = await oldDb.review.findMany();
    await newDb.review.createMany({ data: reviews, skipDuplicates: true });
    summary.reviews = reviews.length;

    const likes = await oldDb.like.findMany();
    await newDb.like.createMany({ data: likes, skipDuplicates: true });
    summary.likes = likes.length;

    const comments = await oldDb.comment.findMany();
    await newDb.comment.createMany({ data: comments, skipDuplicates: true });
    summary.comments = comments.length;

    const selfReplies = await oldDb.selfReply.findMany();
    await newDb.selfReply.createMany({ data: selfReplies, skipDuplicates: true });
    summary.selfReplies = selfReplies.length;

    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err), partialSummary: summary },
      { status: 500 }
    );
  } finally {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  }
}

"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function loginAction(prevState, formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해주세요." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  await createSession(user.id);
  redirect("/my");
}

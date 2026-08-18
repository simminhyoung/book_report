"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function signupAction(prevState, formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString() || "";
  const passwordConfirm = formData.get("passwordConfirm")?.toString() || "";
  const name = formData.get("name")?.toString().trim();

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해주세요." };
  }
  if (password.length < 6) {
    return { error: "비밀번호는 최소 6자 이상이어야 해요." };
  }
  if (password !== passwordConfirm) {
    return { error: "비밀번호가 서로 일치하지 않습니다." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "이미 가입된 이메일이에요. 로그인해주세요." };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: passwordHash, name: name || null },
  });

  await createSession(user.id);
  redirect("/my");
}

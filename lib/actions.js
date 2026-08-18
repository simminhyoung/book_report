"use server";

import { redirect } from "next/navigation";
import { destroySession } from "./auth";

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

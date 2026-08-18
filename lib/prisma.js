import { PrismaClient } from "@prisma/client";

// Next.js dev server hot-reloads modules, which would otherwise create a new
// PrismaClient (and a new DB connection) on every change. We cache the
// client on the global object to avoid that.
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

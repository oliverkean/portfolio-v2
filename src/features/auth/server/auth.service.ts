import "server-only";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "../auth.schema";
import { createSession } from "./session";

export async function loginWithPassword(payload: unknown) {
  const credentials = loginSchema.parse(payload);
  const user = await prisma.user.findUnique({
    where: { email: credentials.email.toLowerCase() },
  });

  if (!user) {
    return null;
  }

  const validPassword = await bcrypt.compare(credentials.password, user.passwordHash);

  if (!validPassword) {
    return null;
  }

  await createSession(user.id);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

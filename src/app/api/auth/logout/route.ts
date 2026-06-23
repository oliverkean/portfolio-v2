import { deleteCurrentSession } from "@/features/auth/server/session";

export const runtime = "nodejs";

export async function POST() {
  await deleteCurrentSession();

  return Response.json({ ok: true });
}

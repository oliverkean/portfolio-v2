import { ZodError } from "zod";
import { loginWithPassword } from "@/features/auth/server/auth.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const user = await loginWithPassword(payload);

    if (!user) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return Response.json({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: "Validation failed.", issues: error.issues }, { status: 422 });
    }

    console.error(error);
    return Response.json({ error: "Unable to sign in." }, { status: 500 });
  }
}

import { savePublicUpload } from "@/lib/upload";
import { requireApiUser } from "@/features/auth/server/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();

    if (!user) {
      return Response.json({ error: "Authentication required." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Missing file." }, { status: 400 });
    }

    const url = await savePublicUpload(file);

    return Response.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload file.";

    return Response.json({ error: message }, { status: 400 });
  }
}

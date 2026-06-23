import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const maxUploadBytes = 5 * 1024 * 1024;

export async function savePublicUpload(file: File) {
  if (!allowedMimeTypes.has(file.type)) {
    throw new Error("Only PDF, JPG, PNG, and WEBP files are supported.");
  }

  if (file.size > maxUploadBytes) {
    throw new Error("Uploads must be 5MB or smaller.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(uploadDir, safeName), bytes);

  return `/uploads/${safeName}`;
}

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const DOC_TYPES = ["application/pdf", ...IMAGE_TYPES];
const MAX_SIZE = 15 * 1024 * 1024;

function safeExt(file: File, fallback: string) {
  const fromName = path.extname(file.name || "").toLowerCase();
  if (fromName && fromName.length <= 8) return fromName;
  if (file.type === "image/jpeg") return ".jpg";
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";
  if (file.type === "application/pdf") return ".pdf";
  return fallback;
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as HandleUploadBody;
    try {
      const json = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: DOC_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
        }),
      });
      return Response.json(json);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      return Response.json({ error: message }, { status: 400 });
    }
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return Response.json({ error: "No files" }, { status: 400 });

  const urls: string[] = [];
  for (const file of files) {
    if (file.size > MAX_SIZE) {
      return Response.json({ error: `${file.name} is larger than 15 MB` }, { status: 400 });
    }
    const allowed = DOC_TYPES.includes(file.type) || file.type.startsWith("image/");
    if (!allowed) {
      return Response.json({ error: `${file.name} must be an image or PDF` }, { status: 400 });
    }

    const ext = safeExt(file, ".bin");
    const name = `machines/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(name, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true,
      });
      urls.push(blob.url);
      continue;
    }

    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const localName = name.replace("machines/", "");
    await writeFile(path.join(dir, localName), Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/${localName}`);
  }

  return Response.json({ urls });
}

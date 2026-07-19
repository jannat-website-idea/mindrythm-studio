import { getChatGPTUser } from "@/app/chatgpt-auth";
import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

async function canEdit() {
  if (process.env.NODE_ENV === "development") return true;
  return Boolean(await getChatGPTUser());
}

export async function POST(request: Request) {
  if (!(await canEdit())) {
    return Response.json({ error: "Sign in is required." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Choose an image or video." }, { status: 400 });
  }

  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return Response.json({ error: "Only image and video files are supported." }, { status: 400 });
  }

  if (file.size > 25 * 1024 * 1024) {
    return Response.json({ error: "The demo upload limit is 25 MB." }, { status: 400 });
  }

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const key = `${crypto.randomUUID()}-${safeName}`;
  const bucket = env.MEDIA as R2Bucket;
  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return Response.json({ url: `/api/media/${encodeURIComponent(key)}` });
}

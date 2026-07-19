import { getChatGPTUser } from "@/app/chatgpt-auth";
import {
  getSiteContent,
  removeItem,
  saveItem,
  saveSettings,
} from "@/db/content";
import type { ContentItem, SiteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

async function canEdit() {
  if (process.env.NODE_ENV === "development") return true;
  return Boolean(await getChatGPTUser());
}

export async function GET() {
  if (!(await canEdit())) {
    return Response.json({ error: "Sign in is required." }, { status: 401 });
  }
  return Response.json(await getSiteContent());
}

export async function PUT(request: Request) {
  if (!(await canEdit())) {
    return Response.json({ error: "Sign in is required." }, { status: 401 });
  }

  const payload = (await request.json()) as {
    item?: ContentItem;
    settings?: SiteSettings;
  };

  if (payload.settings) await saveSettings(payload.settings);
  if (payload.item) await saveItem(payload.item);

  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  if (!(await canEdit())) {
    return Response.json({ error: "Sign in is required." }, { status: 401 });
  }

  const item = (await request.json()) as ContentItem;
  await saveItem(item);
  return Response.json({ ok: true, item });
}

export async function DELETE(request: Request) {
  if (!(await canEdit())) {
    return Response.json({ error: "Sign in is required." }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) return Response.json({ error: "Missing item id." }, { status: 400 });

  await removeItem(id);
  return Response.json({ ok: true });
}

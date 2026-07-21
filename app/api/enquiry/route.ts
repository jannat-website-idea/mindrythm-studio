import { getSiteContent, saveEnquiry, type Enquiry } from "@/db/content";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Enquiry>;
  const name = String(payload.name || "").trim().slice(0, 120);
  const phone = String(payload.phone || "").trim().slice(0, 40);
  const email = String(payload.email || "").trim().slice(0, 180);
  const query = String(payload.query || "").trim().slice(0, 1000);

  if (!name || !phone || !query) {
    return Response.json({ error: "Name, phone and enquiry are required." }, { status: 400 });
  }

  const enquiry: Enquiry = {
    id: crypto.randomUUID(),
    name,
    phone,
    email,
    query,
    createdAt: new Date().toISOString(),
  };
  await saveEnquiry(enquiry);

  let emailSent = false;
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const { settings } = await getSiteContent();
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Mind Rhythm Website <onboarding@resend.dev>",
        to: [settings.contactEmail || "Admin@mindrythm.com"],
        reply_to: email || undefined,
        subject: `Website enquiry from ${name}`,
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email || "Not provided"}\n\n${query}`,
      }),
    });
    emailSent = response.ok;
  }

  return Response.json({ ok: true, emailSent });
}

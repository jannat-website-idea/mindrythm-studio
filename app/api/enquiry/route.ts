import { saveEnquiry, type Enquiry } from "@/db/content";

export const dynamic = "force-dynamic";
const enquiryRecipient = process.env.ENQUIRY_TO_EMAIL?.trim() || "Admin@mindrythm.com";

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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, emailSent: false, saved: true, error: "Email delivery is not configured." },
      { status: 503 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "Idempotency-Key": `mindrythm-enquiry-${enquiry.id}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "Mind Rythm Studio Website <onboarding@resend.dev>",
      to: [enquiryRecipient],
      reply_to: email || undefined,
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email || "Not provided"}\n\n${query}`,
    }),
  });

  if (!response.ok) {
    return Response.json(
      { ok: false, emailSent: false, saved: true, error: "The enquiry was saved, but the notification email could not be delivered." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, emailSent: true, saved: true });
}

import {isLikelySpam, takeEnquiryRateLimit, validateEnquiry} from "@/lib/enquiry";
import {sendEnquiryEmail} from "@/lib/smtp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const jsonHeaders = {"cache-control": "no-store"};

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return Response.json({error: "This request origin is not allowed."}, {status: 403, headers: jsonHeaders});
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 16 * 1024) {
      return Response.json({error: "The enquiry is too large."}, {status: 413, headers: jsonHeaders});
    }
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return Response.json({error: "The request must be JSON."}, {status: 415, headers: jsonHeaders});
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return Response.json({error: "The enquiry could not be read."}, {status: 400, headers: jsonHeaders});
    }

    const parsed = validateEnquiry(payload);
    if (!parsed.success) {
      return Response.json(
        {error: "Please check the highlighted enquiry details.", fields: parsed.error.flatten().fieldErrors},
        {status: 400, headers: jsonHeaders},
      );
    }

    // Silently accept bot-filled honeypots and unrealistically fast submissions.
    if (isLikelySpam(parsed.data)) {
      return Response.json({ok: true}, {headers: jsonHeaders});
    }

    const rateLimit = takeEnquiryRateLimit(clientAddress(request));
    if (!rateLimit.allowed) {
      return Response.json(
        {error: "Too many enquiries were submitted. Please wait and try again."},
        {status: 429, headers: {...jsonHeaders, "retry-after": String(rateLimit.retryAfterSeconds)}},
      );
    }

    await sendEnquiryEmail(parsed.data);
    return Response.json({ok: true, emailSent: true}, {headers: jsonHeaders});
  } catch (error) {
    const details = error instanceof Error
      ? {name: error.name, message: error.message, code: "code" in error ? String(error.code) : undefined}
      : {name: "UnknownError", message: "Unknown SMTP error"};
    console.error("Mindrythm enquiry delivery failed", details);
    return Response.json(
      {error: "The enquiry could not be delivered. Please email admin@mindrythm.com directly."},
      {status: 503, headers: jsonHeaders},
    );
  }
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host") || "";
  const secFetchSite = request.headers.get("sec-fetch-site");

  // Same-origin browser requests (e.g. mobile Safari, WebViews, privacy modes)
  // often omit 'origin' on first-party fetch or pass sec-fetch-site: same-origin
  if (secFetchSite === "same-origin" || secFetchSite === "same-site") {
    return true;
  }

  // If no origin header is provided, inspect referer and host
  if (!origin) {
    if (referer) {
      try {
        const refHost = new URL(referer).hostname.toLowerCase();
        if (refHost.includes("mindrythm.com") || refHost === "localhost" || refHost === "127.0.0.1") {
          return true;
        }
      } catch {}
    }
    if (host.includes("mindrythm.com") || host.includes("localhost") || host.includes("127.0.0.1")) {
      return true;
    }
    // Allow direct first-party requests where origin header is stripped by client browser
    return true;
  }

  // If origin is provided, verify it belongs to mindrythm or local development
  try {
    const originHost = new URL(origin).hostname.toLowerCase();
    if (originHost === "mindrythm.com" || originHost.endsWith(".mindrythm.com") || originHost === "localhost" || originHost === "127.0.0.1") {
      return true;
    }
  } catch {}

  return false;
}

function clientAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
}

import {z} from "zod";

export const enquiryServices = [
  "Property photography",
  "Resort & hospitality",
  "Event photography",
  "Event film",
  "Wedding photography",
  "Wedding or pre-wedding film",
  "Other",
] as const;

const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "The name is too long."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(40, "The phone number is too long.")
    .refine(
      (value) => /^\+?[0-9][0-9\s().-]{5,38}$/.test(value) && value.replace(/\D/g, "").length >= 7,
      "Please enter a valid phone number.",
    ),
  email: z
    .string()
    .trim()
    .max(180, "The email address is too long.")
    .refine((value) => value === "" || z.string().email().safeParse(value).success, "Please enter a valid email address."),
  service: z.enum(enquiryServices),
  query: z
    .string()
    .trim()
    .min(10, "Please add a little more detail about your enquiry.")
    .max(1000, "The enquiry is too long."),
  website: z.string().max(200).optional().default(""),
  startedAt: z.coerce.number().int().positive().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export function validateEnquiry(payload: unknown) {
  return enquirySchema.safeParse(payload);
}

export function isLikelySpam(enquiry: EnquiryInput, now = Date.now()): boolean {
  if (enquiry.website) return true;

  const minimumSubmitTime = positiveInteger(process.env.CONTACT_MIN_SUBMIT_MS, 800);
  if (!enquiry.startedAt || now - enquiry.startedAt < minimumSubmitTime || enquiry.startedAt > now) return true;

  const linkCount = enquiry.query.match(/(?:https?:\/\/|www\.)/gi)?.length ?? 0;
  if (linkCount > 2) return true;
  if (/(.)\1{12,}/u.test(enquiry.query)) return true;

  return false;
}

type RateLimitEntry = {count: number; resetAt: number};
const rateLimits = new Map<string, RateLimitEntry>();

export function takeEnquiryRateLimit(key: string, now = Date.now()) {
  const windowMs = positiveInteger(process.env.CONTACT_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000);
  const maximum = positiveInteger(process.env.CONTACT_RATE_LIMIT_MAX, 5);

  for (const [entryKey, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(entryKey);
  }

  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, {count: 1, resetAt: now + windowMs});
    return {allowed: true, retryAfterSeconds: 0};
  }

  if (current.count >= maximum) {
    return {allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))};
  }

  current.count += 1;
  return {allowed: true, retryAfterSeconds: 0};
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

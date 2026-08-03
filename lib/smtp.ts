import nodemailer, {type Transporter} from "nodemailer";
import type {EnquiryInput} from "@/lib/enquiry";

const enquiryRecipient = "admin@mindrythm.com";
let transporter: Transporter | undefined;

export async function sendEnquiryEmail(enquiry: EnquiryInput) {
  const smtp = smtpConfiguration();
  const mailer = transporter ??= nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {user: smtp.user, pass: smtp.password},
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 20_000,
    tls: {minVersion: "TLSv1.2", rejectUnauthorized: true},
  });

  const safeName = enquiry.name.replace(/[\r\n]+/g, " ");
  const text = [
    `Name: ${enquiry.name}`,
    `Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email || "Not provided"}`,
    `Service: ${enquiry.service}`,
    "",
    enquiry.query,
  ].join("\n");

  const result = await mailer.sendMail({
    from: {name: smtp.fromName, address: smtp.fromEmail},
    to: enquiryRecipient,
    replyTo: enquiry.email || undefined,
    subject: `Website enquiry from ${safeName}`,
    text,
    html: `<h2>New Mindrythm website enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(enquiry.email || "Not provided")}</p>
      <p><strong>Service:</strong> ${escapeHtml(enquiry.service)}</p>
      <p><strong>Enquiry:</strong></p>
      <p>${escapeHtml(enquiry.query).replace(/\n/g, "<br>")}</p>`,
  });

  const accepted = result.accepted.map((address: string) => String(address).toLowerCase());
  if (!accepted.includes(enquiryRecipient)) {
    throw new Error("SMTP server did not accept the enquiry recipient.");
  }
}

function smtpConfiguration() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;
  const fromEmail = process.env.SMTP_FROM_EMAIL?.trim() || user;
  const fromName = process.env.SMTP_FROM_NAME?.trim() || "Mindrythm Website";
  const port = Number(process.env.SMTP_PORT || 465);

  if (!host || !user || !password || !fromEmail) {
    throw new Error("SMTP configuration is incomplete.");
  }
  if (port !== 465 && port !== 587) {
    throw new Error("SMTP_PORT must be 465 or 587.");
  }

  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === "true"
    : port === 465;

  return {host, user, password, fromEmail, fromName, port, secure};
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

import nodemailer, {type Transporter} from "nodemailer";
import type {EnquiryInput} from "@/lib/enquiry";

const defaultRecipients = ["admin@mindrythm.com"];

export async function sendEnquiryEmail(enquiry: EnquiryInput) {
  const recipients = process.env.ENQUIRY_RECIPIENT
    ? process.env.ENQUIRY_RECIPIENT.split(",").map((s) => s.trim()).filter(Boolean)
    : defaultRecipients;

  const safeName = enquiry.name.replace(/[\r\n]+/g, " ").trim();
  const safeService = enquiry.service.replace(/[\r\n]+/g, " ").trim();
  const safePhone = enquiry.phone.replace(/[\r\n]+/g, " ").trim();
  const safeEmail = enquiry.email?.trim() || "";

  const adminSubject = `New enquiry received: ${safeName} (${safeService})`;

  const adminText = [
    `New enquiry received on Mindrythm website`,
    `----------------------------------------`,
    `Name: ${safeName}`,
    `Phone: ${safePhone}`,
    `Email: ${safeEmail || "Not provided"}`,
    `Service: ${safeService}`,
    `Date: ${new Date().toUTCString()}`,
    ``,
    `Enquiry details:`,
    enquiry.query,
  ].join("\n");

  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #171513; background: #ffffff; border: 1px solid #eae7e1; border-radius: 12px;">
      <div style="border-bottom: 2px solid #171513; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #7f7871;">Mindrythm Studio</span>
        <h2 style="margin: 6px 0 0; font-size: 24px; font-weight: 500; color: #171513;">New Enquiry Received</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #7f7871; width: 100px; font-size: 14px;">Name</td>
          <td style="padding: 8px 0; font-weight: 600; font-size: 15px; color: #171513;">${escapeHtml(safeName)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f7871; font-size: 14px;">Phone</td>
          <td style="padding: 8px 0; font-size: 15px; color: #171513;"><a href="tel:${escapeHtml(safePhone)}" style="color: #171513; text-decoration: none;">${escapeHtml(safePhone)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f7871; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; font-size: 15px; color: #171513;">${safeEmail ? `<a href="mailto:${escapeHtml(safeEmail)}" style="color: #171513;">${escapeHtml(safeEmail)}</a>` : "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f7871; font-size: 14px;">Service</td>
          <td style="padding: 8px 0; font-weight: 600; font-size: 15px; color: #171513;">${escapeHtml(safeService)}</td>
        </tr>
      </table>
      <div style="background: #f7f6f2; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <div style="font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; color: #7f7871; margin-bottom: 8px;">Enquiry Details</div>
        <div style="font-size: 14px; line-height: 1.6; color: #2a2723; white-space: pre-wrap;">${escapeHtml(enquiry.query)}</div>
      </div>
      <div style="border-top: 1px solid #eae7e1; padding-top: 16px; font-size: 12px; color: #9c958d;">
        Received from mindrythm.com/contact on ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST
      </div>
    </div>
  `;

  const { mailer, fromHeader } = await getActiveTransporter();

  // 1. Dispatch notification to admin/team
  await mailer.sendMail({
    from: fromHeader,
    to: recipients.join(", "),
    replyTo: safeEmail || undefined,
    subject: adminSubject,
    text: adminText,
    html: adminHtml,
  });

  // 2. If visitor provided an email, send confirmation to the client
  if (safeEmail) {
    const customerSubject = `New enquiry received — Mindrythm Studio`;
    const customerText = [
      `Dear ${safeName},`,
      ``,
      `Thank you for reaching out to Mindrythm Studio regarding "${safeService}".`,
      `We have received your enquiry and our team will review your requirements and connect with you shortly.`,
      ``,
      `Your Submission Summary:`,
      `- Service: ${safeService}`,
      `- Phone: ${safePhone}`,
      `- Message: ${enquiry.query}`,
      ``,
      `If you have any immediate questions, feel free to reply directly to this email or reach us at +91 62923 33492.`,
      ``,
      `Warm regards,`,
      `Mindrythm Studio`,
      `https://mindrythm.com`,
    ].join("\n");

    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #171513; background: #faf9f6; border-radius: 12px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #8a8279;">Mindrythm Studio</span>
          <h2 style="margin: 8px 0 0; font-size: 26px; font-weight: 400; color: #171513; letter-spacing: -0.02em;">We have received your enquiry</h2>
        </div>
        <p style="font-size: 15px; line-height: 1.6; color: #3a3632;">Dear ${escapeHtml(safeName)},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #3a3632;">
          Thank you for getting in touch with us regarding <strong>${escapeHtml(safeService)}</strong>. Our team has received your details and will get back to you shortly.
        </p>
        <div style="background: #ffffff; border: 1px solid #eae7e1; border-radius: 8px; padding: 18px; margin: 24px 0;">
          <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #8a8279; margin-bottom: 10px;">Summary of your brief</div>
          <p style="margin: 4px 0; font-size: 14px; color: #171513;"><strong>Service:</strong> ${escapeHtml(safeService)}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #171513;"><strong>Phone:</strong> ${escapeHtml(safePhone)}</p>
          <p style="margin: 12px 0 4px; font-size: 14px; color: #5a544e;">${escapeHtml(enquiry.query).replace(/\n/g, "<br>")}</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #5a544e;">
          If you have any immediate questions, feel free to reply directly to this email or reach us at <a href="tel:+916292333492" style="color: #171513;">+91 62923 33492</a>.
        </p>
        <div style="border-top: 1px solid #eae7e1; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #8a8279;">
          Warm regards,<br>
          <strong style="color: #171513;">Mindrythm Studio</strong><br>
          <a href="https://mindrythm.com" style="color: #8a8279; text-decoration: none;">mindrythm.com</a>
        </div>
      </div>
    `;

    try {
      await mailer.sendMail({
        from: fromHeader,
        to: safeEmail,
        subject: customerSubject,
        text: customerText,
        html: customerHtml,
      });
    } catch (customerErr) {
      console.warn("Notice: Customer confirmation email delivery failed:", customerErr);
    }
  }
}

let cachedTransporter: { mailer: Transporter; fromHeader: string } | null = null;

async function getActiveTransporter(): Promise<{ mailer: Transporter; fromHeader: string }> {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = "smtp.gmail.com";
  const user = "admin@mindrythm.com";
  const fromEmail = "admin@mindrythm.com";
  const fromName = "Mindrythm Studio";
  const fromHeader = `"${fromName}" <${fromEmail}>`;

  const candidatePasswords = [
    "rele mhjr rrnw owef",
    "relemhjrrnwowef",
    process.env.SMTP_PASSWORD?.trim(),
  ].filter((p): p is string => Boolean(p) && p !== "knckqbvsamgylopw");

  for (const pass of candidatePasswords) {
    try {
      const smtpMailer = nodemailer.createTransport({
        host,
        port: 465,
        secure: true,
        auth: { user, pass },
        connectionTimeout: 8_000,
        greetingTimeout: 8_000,
        socketTimeout: 10_000,
        tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
      });

      await smtpMailer.verify();
      cachedTransporter = { mailer: smtpMailer, fromHeader };
      return cachedTransporter;
    } catch (smtpError) {
      console.warn("SMTP attempt with candidate password failed:", smtpError instanceof Error ? smtpError.message : smtpError);
    }
  }

  // 2. Fallback to server local sendmail (works directly on Hostinger CloudLinux/cPanel)
  const sendmailMailer = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
  });

  cachedTransporter = { mailer: sendmailMailer, fromHeader };
  return cachedTransporter;
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

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/#home">← Mind Rythm Studio</Link>
      <span>Legal / Privacy</span>
      <h1>Privacy policy</h1>
      <section>
        <h2>Information we receive</h2>
        <p>When you contact Mind Rythm Studio, we receive the details you choose to provide, including your name, phone number, email address and enquiry.</p>
        <h2>How we use it</h2>
        <p>We use this information only to respond to your enquiry, discuss potential work and maintain relevant business records. We do not sell personal information.</p>
        <h2>Storage and requests</h2>
        <p>Enquiries may be stored securely for follow-up. You may request access, correction or deletion by emailing Admin@mindrythm.com.</p>
        <h2>External services</h2>
        <p>The website may link to social platforms and display Google Maps. Those services apply their own privacy practices.</p>
      </section>
    </main>
  );
}

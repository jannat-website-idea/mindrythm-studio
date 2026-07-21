import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/">← Mind Rhythm</Link>
      <span>Legal / Terms</span>
      <h1>Terms of use</h1>
      <section>
        <h2>Website content</h2>
        <p>This website presents the work, services and creative perspective of Mind Rhythm. Project information is provided for general reference and may change.</p>
        <h2>Creative ownership</h2>
        <p>Unless stated otherwise, visual work, text and brand materials on this website belong to Mind Rhythm or the credited collaborators and may not be reused without permission.</p>
        <h2>Project enquiries</h2>
        <p>Sending an enquiry does not create a service agreement. Scope, timing, fees and usage rights are confirmed separately in writing.</p>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to Admin@mindrythm.com.</p>
      </section>
    </main>
  );
}

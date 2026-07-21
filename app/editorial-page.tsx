"use client";

import type { ContentItem, SiteContent } from "@/lib/content";
import { type FormEvent, useMemo, useState } from "react";

export type EditorialPageKind = "work" | "gallery" | "team" | "story" | "contact";

export function EditorialPage({ content, page }: { content: SiteContent; page: EditorialPageKind }) {
  const { settings } = content;
  const projects = content.items.filter((item) => item.kind === "project").sort((a, b) => a.sortOrder - b.sortOrder);
  const gallery = content.items.filter((item) => item.kind === "gallery");
  const galleryItems = gallery.length ? gallery : projects;
  const savedTeam = content.items.filter((item) => item.kind === "team");
  const teamFallbacks = projects.slice(0, 3).map((item, index) => ({
    ...item,
    id: `team-${item.id}-${index}`,
    kind: "team" as const,
    title: ["Creative direction", "Image & motion", "Design & post"][index] || "Studio collaborator",
    body: ["Ideas, narrative and visual direction.", "Cinematography, photography and movement.", "Identity, edit, colour and finishing."][index] || item.body,
    category: ["Creative Director", "Image & Motion", "Design & Post"][index] || "Collaborator",
    href: index === 1 ? settings.linkedin : settings.instagram,
  }));
  const team = [...savedTeam, ...teamFallbacks].slice(0, 3);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const pageMeta = useMemo(() => ({
    work: ["Our Work", "Visual stories built to last beyond the moment."],
    gallery: ["Stories & Moments", "A living visual archive of spaces, gestures and observations."],
    team: ["Meet the Team", "A flexible collective assembled around the needs of every story."],
    story: ["Our Story", "The thinking, people and process behind Mind Rhythm."],
    contact: ["Let’s Connect", "Bring us an idea, a question or the beginning of a story."],
  }[page]), [page]);

  async function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("sending");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    if (response.ok) {
      setFormState("sent");
      event.currentTarget.reset();
    } else {
      setFormState("error");
    }
  }

  return (
    <div className="inner-shell">
      <header className="inner-header">
        <a className="wordmark" href="/"><img src="/mindrythm-logomark.png" alt="" /><span>MIND <em>RHYTHM</em></span></a>
        <nav aria-label="Site navigation">
          <a className={page === "work" ? "active" : ""} href="/work">Our Work</a>
          <a className={page === "gallery" ? "active" : ""} href="/gallery">Stories & Moments</a>
          <a className={page === "team" ? "active" : ""} href="/team">Meet the Team</a>
          <a className={page === "story" ? "active" : ""} href="/story">Our Story</a>
          <a className={page === "contact" ? "active" : ""} href="/contact">Let’s Connect</a>
        </nav>
        <a className="inner-home" href="/">Home ↗</a>
      </header>

      <main>
        <section className={`inner-hero inner-hero-${page}`}>
          <span>Mind Rhythm / {pageMeta[0]}</span>
          <h1>{pageMeta[0]}</h1>
          <p>{pageMeta[1]}</p>
        </section>

        {page === "work" && (
          <section className="work-page-grid">
            {projects.map((project, index) => (
              <details className="work-page-card" key={project.id}>
                <summary>
                  <Media item={project} />
                  <div><span>0{index + 1} / {project.category}</span><h2>{project.title}</h2><p>{project.eyebrow}</p></div>
                  <b>View project +</b>
                </summary>
                <div className="work-page-detail">
                  <p>{project.body}</p>
                  <div>{galleryItems.slice(0, 3).map((item) => <Media key={item.id} item={item} />)}</div>
                  <span>{project.year} / Mind Rhythm Studio</span>
                </div>
              </details>
            ))}
          </section>
        )}

        {page === "gallery" && (
          <div className="gallery-page">
            {(["Spaces", "Moments"] as const).map((category, categoryIndex) => {
              const matching = galleryItems.filter((item) => item.category.toLowerCase() === category.toLowerCase());
              const items = matching.length ? matching : galleryItems.filter((_, index) => index % 2 === categoryIndex);
              return (
                <section className="gallery-page-section" key={category}>
                  <header><span>0{categoryIndex + 1}</span><h2>{category}</h2><p>{category === "Spaces" ? "Architecture, atmosphere and the places that hold a story." : "Movement, people and the brief gestures that stay with us."}</p></header>
                  <div className="gallery-page-grid">
                    {items.map((item, index) => <button type="button" className={`gallery-page-card gallery-page-card-${(index % 4) + 1}`} key={item.id} onClick={() => setSelected(item)}><Media item={item} /><span>{item.title} ↗</span></button>)}
                  </div>
                </section>
              );
            })}
            <section className="social-gallery-cta"><span>Follow the living archive</span><div><a href={settings.instagram}>Instagram ↗</a><a href={settings.facebook}>Facebook ↗</a><a href={settings.youtube}>YouTube ↗</a></div></section>
          </div>
        )}

        {page === "team" && (
          <>
            <section className="team-page-grid">
              {team.map((member, index) => (
                <button type="button" className="team-page-card" key={`${member.id}-${index}`} onClick={() => setSelected(member)}>
                  <div><Media item={member} /></div><span>0{index + 1} / {member.category}</span><h2>{member.title}</h2><p>{member.body}</p><b>Profile &amp; social links ↗</b>
                </button>
              ))}
            </section>
            <section className="team-page-note"><span>Built around the story</span><h2>A focused core.<br /><em>The right collaborators.</em></h2><p>Each project brings together the precise mix of direction, image-making, design and post-production it needs.</p><a href="/contact">Work with the team ↗</a></section>
          </>
        )}

        {page === "story" && (
          <div className="story-page">
            <section className="story-manifesto"><span>What is Mind Rhythm?</span><p>{settings.description}</p></section>
            <section className="story-pillars">
              <article><span>01</span><h2>What we do</h2><p>We work across moving image, photography, visual identity, creative direction and post-production.</p></article>
              <article><span>02</span><h2>Who we work with</h2><p>Brands, artists, cultural institutions and independent voices looking for a distinct visual point of view.</p></article>
              <article><span>03</span><h2>How we work</h2><p>{settings.idea} Every collaboration begins with listening, distilling and building a world around the central idea.</p></article>
            </section>
            <section className="story-vision"><img src="/mindrythm-logomark.png" alt="Mind Rhythm logomark" /><div><span>Our vision</span><h2>{settings.vision}</h2></div></section>
          </div>
        )}

        {page === "contact" && (
          <div className="contact-page">
            <section className="contact-page-info">
              <div><span>Call</span><a href={`tel:${settings.phonePrimary}`}>{settings.phonePrimary}</a><a href={`tel:${settings.phoneSecondary}`}>{settings.phoneSecondary}</a></div>
              <div><span>Email</span><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></div>
              <div><span>Visit</span><p>{settings.address}</p></div>
              <div><span>Social</span><a href={settings.instagram}>Instagram ↗</a><a href={settings.facebook}>Facebook ↗</a><a href={settings.youtube}>YouTube ↗</a></div>
            </section>
            <form className="contact-page-form" onSubmit={sendEnquiry}>
              <div className="form-field"><label htmlFor="contact-name">Full name *</label><input id="contact-name" name="name" required /></div>
              <div className="form-field"><label htmlFor="contact-phone">Phone number *</label><input id="contact-phone" name="phone" type="tel" required /></div>
              <div className="form-field"><label htmlFor="contact-email">Email ID</label><input id="contact-email" name="email" type="email" /></div>
              <div className="form-field form-field-wide"><label htmlFor="contact-query">Your query *</label><textarea id="contact-query" name="query" rows={7} maxLength={1000} required /></div>
              <button type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send enquiry ↗"}</button>
              <p className={`form-message ${formState}`}>{formState === "sent" ? "Thank you. Your enquiry has been received." : formState === "error" ? "We could not send this yet. Please email us directly." : "Your message will be saved securely in the studio dashboard."}</p>
            </form>
            <div className="contact-page-map"><iframe title="Mind Rhythm location" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`} /></div>
          </div>
        )}
      </main>

      <footer className="inner-footer"><a href="/"><img src="/mindrythm-logomark.png" alt="" />Mind Rhythm</a><span>© {new Date().getFullYear()}</span><a href="/privacy">Privacy Policy</a><a href="/terms">Terms &amp; Conditions</a><a href="/studio">Admin studio ↗</a></footer>

      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title}>
          <button type="button" onClick={() => setSelected(null)}>Close ×</button>
          <div className="lightbox-image"><Media item={selected} /></div>
          <div className="lightbox-copy"><span>{selected.category}</span><h2>{selected.title}</h2><p>{selected.body}</p>{selected.kind === "team" && <div><a href={selected.href || settings.instagram}>Instagram ↗</a><a href={settings.linkedin}>LinkedIn ↗</a></div>}</div>
        </div>
      )}
    </div>
  );
}

function Media({ item }: { item: ContentItem }) {
  const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(item.mediaUrl);
  if (isVideo) return <video src={item.mediaUrl} muted loop autoPlay playsInline aria-label={item.mediaAlt} />;
  return <img src={item.mediaUrl || "/images/tokyo-rain.jpg"} alt={item.mediaAlt || item.title} />;
}

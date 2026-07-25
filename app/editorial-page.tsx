"use client";

import {
  enquiryTaglines,
  missionParagraphs,
  teamIntroduction,
  visionParagraphs,
  type ContentItem,
  type SiteContent,
} from "@/lib/content";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
    title: ["Property & commercial", "Events & celebrations", "Film & post"][index] || "Studio specialist",
    body: ["Resort, real-estate, architectural and brand photography.", "Candid event coverage, wedding portraits, rituals and live moments.", "Wedding films, event aftermovies, drone capture, edit and colour."][index] || item.body,
    category: ["Lead Photographer", "Event Photographer", "Film & Post"][index] || "Specialist",
    href: index === 1 ? settings.linkedin : settings.instagram,
  }));
  const team = [...savedTeam, ...teamFallbacks].slice(0, 3);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [activeTeamCardId, setActiveTeamCardId] = useState<string | null>(null);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (!activeTeamCardId) return;
    const close = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(".team-card, .team-page-card")) return;
      setActiveTeamCardId(null);
    };
    const closeWithKeyboard = (event: KeyboardEvent) => event.key === "Escape" && setActiveTeamCardId(null);
    document.addEventListener("pointerdown", close);
    window.addEventListener("keydown", closeWithKeyboard);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [activeTeamCardId]);

  const pageMeta = useMemo(() => ({
    work: ["Our Work", "Properties, events and weddings photographed and filmed to be remembered."],
    gallery: ["Gallery", "An immersive visual archive of spaces, people and celebrations."],
    team: ["Our Team", "A specialist collective assembled around the needs of every story."],
    story: ["Our Story", "The thinking, people and process behind Mind Rhythm photography and films."],
    contact: ["Enquire", "Tell us about your property, event, wedding or next visual story."],
  }[page]), [page]);

  async function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("sending");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.query = `Service: ${String(payload.service || "General enquiry")}\n\n${String(payload.query || "")}`;
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
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
        <Link className="wordmark" href="/"><img src="/mindrythm-logomark.png" alt="" /><span>MIND <em>RHYTHM</em></span></Link>
        <nav aria-label="Site navigation">
          <Link href="/">Home</Link>
          <Link href="/#services">Services</Link>
          <a className={page === "work" ? "active" : ""} href="/work">Our Work</a>
          <a className={page === "gallery" ? "active" : ""} href="/gallery">Gallery</a>
          <a className={page === "team" ? "active" : ""} href="/team">Our Team</a>
          <a className={page === "contact" ? "active" : ""} href="/contact">Enquire</a>
        </nav>
        <Link className="inner-home" href="/">Home ↗</Link>
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
            {(["Spaces", "Celebrations"] as const).map((category, categoryIndex) => {
              const matching = galleryItems.filter((item) => item.category.toLowerCase() === category.toLowerCase());
              const items = matching.length ? matching : galleryItems.filter((_, index) => index % 2 === categoryIndex);
              return (
                <section className="gallery-page-section" key={category}>
                  <header><span>0{categoryIndex + 1}</span><h2>{category}</h2><p>{category === "Spaces" ? "Property, architecture, landscape and the first impression of arrival." : "Weddings, events, people and the energy of moments shared."}</p></header>
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
            <section className="team-introduction"><span>Built together</span><p>{teamIntroduction}</p></section>
            <section className="team-page-grid">
              {team.map((member, index) => (
                <article className={`team-page-card ${activeTeamCardId === member.id ? "active" : ""}`} key={`${member.id}-${index}`} onClick={() => setActiveTeamCardId((current) => current === member.id ? null : member.id)}>
                  <button type="button" className="team-page-card-trigger" aria-expanded={activeTeamCardId === member.id} aria-controls={`team-page-overlay-${index}`}>
                    <Media item={member} />
                    <span className="sr-only">Show information about {member.title}</span>
                  </button>
                  <div className="team-page-card-overlay" id={`team-page-overlay-${index}`}>
                    <span>0{index + 1} / {member.category}</span><h2>{member.title}</h2><p>{member.body}</p>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setActiveTeamCardId(null); setSelected(member); }}>View profile ↗</button>
                  </div>
                </article>
              ))}
            </section>
            <section className="team-page-note"><span>Built around the story</span><h2>A focused core.<br /><em>The right specialists.</em></h2><p>Each commission brings together the precise mix of property, event or wedding photographers, filmmakers, aerial operators and editors it needs.</p><a href="/contact">Work with the team ↗</a></section>
          </>
        )}

        {page === "story" && (
          <div className="story-page">
            <section className="story-manifesto"><span>What is Mind Rhythm?</span><p>{visionParagraphs[0]}</p></section>
            <section className="story-pillars">
              <article><span>01</span><h2>What we capture</h2><p>We work across properties, resorts, events and weddings through photography, cinematic film and aerial capture.</p></article>
              <article><span>02</span><h2>Who we work with</h2><p>Couples, families, event teams, developers, architects, resorts and brands seeking a distinct visual point of view.</p></article>
              <article><span>03</span><h2>How we work</h2><p>Every commission begins with listening, a clear visual plan and space for real moments to happen.</p></article>
            </section>
            <section className="story-narrative story-vision-full"><header><span>01 / Our vision</span><h2>Ideas find their visual language.</h2></header><div>{visionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
            <section className="story-vision"><img src="/mindrythm-logomark.png" alt="Mind Rhythm logomark" /><div><span>Our vision</span><h2>{visionParagraphs[3]}</h2></div></section>
            <section className="story-narrative story-mission"><header><span>02 / Our mission</span><h2>A conversation before a brief.</h2></header><div>{missionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
            <section className="story-narrative story-people"><header><span>03 / Our people</span><h2>Never about one person.</h2></header><div><p>{teamIntroduction}</p><a href="/team">Meet the team ↗</a></div></section>
          </div>
        )}

        {page === "contact" && (
          <div className="contact-page">
            <section className="contact-page-intro">{enquiryTaglines.map((line, index) => <p key={line}><span>0{index + 1}</span>{line}</p>)}</section>
            <section className="contact-page-info">
              <div><span>Call</span><a href={`tel:${settings.phonePrimary}`}>{settings.phonePrimary}</a><a href={`tel:${settings.phoneSecondary}`}>{settings.phoneSecondary}</a></div>
              <div><span>Email</span><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></div>
              <div><span>Visit</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`} target="_blank" rel="noreferrer">{settings.address} ↗</a></div>
              <div><span>Social</span><a href={settings.instagram}>Instagram ↗</a><a href={settings.facebook}>Facebook ↗</a><a href={settings.youtube}>YouTube ↗</a><a href={settings.x}>X ↗</a></div>
            </section>
            <form className="contact-page-form" id="enquiry" onSubmit={sendEnquiry}>
              <div className="form-field"><label htmlFor="contact-name">Full name *</label><input id="contact-name" name="name" required /></div>
              <div className="form-field"><label htmlFor="contact-phone">Phone number *</label><input id="contact-phone" name="phone" type="tel" required /></div>
              <div className="form-field"><label htmlFor="contact-email">Email ID</label><input id="contact-email" name="email" type="email" /></div>
              <div className="form-field"><label htmlFor="contact-service">Service *</label><select id="contact-service" name="service" required defaultValue=""><option value="" disabled>Select a service</option><option>Property photography</option><option>Resort &amp; hospitality</option><option>Event photography</option><option>Event film</option><option>Wedding photography</option><option>Wedding or pre-wedding film</option><option>Other</option></select></div>
              <div className="form-field form-field-wide"><label htmlFor="contact-query">Your query *</label><textarea id="contact-query" name="query" rows={7} maxLength={1000} required /></div>
              <button type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send enquiry ↗"}</button>
              <p className={`form-message ${formState}`}>{formState === "sent" ? "Thank you. Your enquiry has been received." : formState === "error" ? "We could not send this yet. Please email us directly." : "Your message will be saved securely in the studio dashboard."}</p>
            </form>
            <div className="contact-page-map"><iframe title="Mind Rhythm location" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`} /></div>
          </div>
        )}
      </main>

      <footer className="inner-footer"><Link href="/"><img src="/mindrythm-logomark.png" alt="" />Mind Rhythm</Link><span>© {new Date().getFullYear()}</span><a href={settings.instagram}>Instagram</a><a href={settings.youtube}>YouTube</a><a href={settings.facebook}>Facebook</a><a href={settings.x}>X</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/studio">Admin ↗</a></footer>

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
  if (isVideo) return <video src={item.mediaUrl} muted loop autoPlay playsInline preload="metadata" aria-label={item.mediaAlt} />;
  return <img src={item.mediaUrl || "/images/resort-exterior.jpg"} alt={item.mediaAlt || item.title} />;
}

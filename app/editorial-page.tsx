"use client";

import {
  mainInstagramUrl as defaultInstagramUrl,
  type ContentItem,
  type SiteContent,
} from "@/lib/content";
import { BackToTop } from "@/app/back-to-top";
import { EmphasizedCopy } from "@/app/emphasized-copy";
import { Media } from "@/app/media";
import { SocialIcon } from "@/app/social-icon";
import { getProjectService, getServiceProjects, isServiceKey, type ServiceKey } from "@/lib/services";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export type EditorialPageKind = "services" | "work" | "gallery" | "team" | "story" | "contact";

export function EditorialPage({ content, page }: { content: SiteContent; page: EditorialPageKind }) {
  const { settings } = content;
  const {enquiryTaglines, missionParagraphs, teamIntroduction, visionParagraphs} = content.copy;
  const serviceItems = content.services;
  const mainInstagramUrl = settings.instagram || defaultInstagramUrl;
  const projects = content.items.filter((item) => item.kind === "project").sort((a, b) => a.sortOrder - b.sortOrder);
  const gallery = content.items.filter((item) => item.kind === "gallery");
  const galleryItems = gallery.length ? gallery : projects;
  const serviceCollections = serviceItems.map((service, index) => {
    const directMedia = getServiceProjects(projects, service.key, serviceItems);
    if (directMedia.length) return { ...service, media: directMedia };
    const offset = (index * 2) % Math.max(1, projects.length);
    const fallback = [...projects.slice(offset), ...projects.slice(0, offset)].slice(0, 3);
    return { ...service, media: fallback.length ? fallback : projects.slice(0, 3) };
  });
  const savedTeam = content.items.filter((item) => item.kind === "team").sort((a, b) => a.sortOrder - b.sortOrder);
  const team = savedTeam.length ? savedTeam : content.items.filter((item) => item.kind === "team");
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [activeTeamCardId, setActiveTeamCardId] = useState<string | null>(null);
  const [activeService, setActiveService] = useState(0);
  const [workFilter, setWorkFilter] = useState<"all" | ServiceKey>("all");
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const formStartedAtRef = useRef(0);

  useEffect(() => {
    formStartedAtRef.current = Date.now();
  }, []);

  function returnToHero() {
    window.sessionStorage.setItem("mindrythmSkipIntro", "1");
    setNavigationOpen(false);
  }

  useEffect(() => {
    if (!navigationOpen) return;
    const closeWithKeyboard = (event: KeyboardEvent) => event.key === "Escape" && setNavigationOpen(false);
    window.addEventListener("keydown", closeWithKeyboard);
    return () => window.removeEventListener("keydown", closeWithKeyboard);
  }, [navigationOpen]);

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

  useEffect(() => {
    if (!selected) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelected(null); return; }
      const idx = galleryItems.findIndex((item) => item.id === selected.id);
      if (event.key === "ArrowLeft" && idx > 0) setSelected(galleryItems[idx - 1]);
      if (event.key === "ArrowRight" && idx < galleryItems.length - 1) setSelected(galleryItems[idx + 1]);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [selected, galleryItems]);

  useEffect(() => {
    if (page !== "work") return;
    const requested = new URLSearchParams(window.location.search).get("service");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (requested && isServiceKey(requested, serviceItems)) setWorkFilter(requested as ServiceKey);
  }, [page, serviceItems]);

  const visibleProjects = useMemo(() => {
    if (workFilter === "all") return projects;
    return getServiceProjects(projects, workFilter, serviceItems);
  }, [projects, serviceItems, workFilter]);

  async function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("sending");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      service: String(formData.get("service") || ""),
      query: String(formData.get("query") || ""),
      website: String(formData.get("website") || ""),
      submittedAt: Date.now(),
      formStartedAt: formStartedAtRef.current,
    };

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Delivery failed");
      setFormState("sent");
      form.reset();
    } catch {
      setFormState("error");
    }
  }

  const activeServiceItem = serviceCollections[activeService] || serviceCollections[0];
  const activeServiceMedia = activeServiceItem?.media.length ? activeServiceItem.media : projects.slice(0, 3);

  return (
    <div className="inner-shell">
      <header className="inner-header">
        <Link href="/" className="wordmark" aria-label="Mindrythm home" onClick={returnToHero}>
          <img src="/mindrythm-logomark.png" alt="" />
          <span>Mindrythm</span>
        </Link>
        <nav id="inner-navigation" className={navigationOpen ? "open" : ""} aria-label="Site navigation">
          <Link href="/" onClick={returnToHero}>Home</Link>
          <Link className={page === "services" ? "active" : ""} href="/services">Services</Link>
          <Link className={page === "work" ? "active" : ""} href="/work">Our Work</Link>
          <Link className={page === "gallery" ? "active" : ""} href="/gallery">Gallery</Link>
          <Link className={page === "team" ? "active" : ""} href="/team">Our Team</Link>
          <Link className={page === "story" ? "active" : ""} href="/story">Our Story</Link>
          <Link className={page === "contact" ? "active" : ""} href="/contact">Enquire</Link>
        </nav>
        <Link className="inner-home" href="/" onClick={returnToHero} aria-label="Return to homepage">Home</Link>
        <button
          type="button"
          className="inner-menu-toggle"
          aria-expanded={navigationOpen}
          aria-controls="inner-navigation"
          onClick={() => setNavigationOpen((open) => !open)}
        >
          {navigationOpen ? "Close" : "Menu"}
        </button>
      </header>

      <main>
        <section className={`inner-hero inner-hero-${page}`}>
          <span>Mindrythm / {page === "work" ? "Our Work" : page === "story" ? "Our Story" : page === "team" ? "Our Team" : page.slice(0, 1).toUpperCase() + page.slice(1)}</span>
          <h1>{page === "services" ? "Services" : page === "work" ? "Our Work" : page === "gallery" ? "Gallery" : page === "team" ? "Our Team" : page === "story" ? "Our Story" : "Enquire"}</h1>
          <p>
            {page === "services" && "A focused visual practice across real estate, hospitality, luxury spaces and brand campaigns."}
            {page === "work" && "Selected commissions spanning properties, retreats, moments and commercial narratives."}
            {page === "gallery" && "An immersive visual archive of spaces, architecture, lifestyle and human moments."}
            {page === "team" && "Photographers, filmmakers, directors and craftspeople dedicated to purposeful storytelling."}
            {page === "story" && "A studio shaped around listening, authenticity and the belief that every story has a rhythm."}
            {page === "contact" && "Tell us about your space, occasion or brand vision. We listen before we frame."}
          </p>
        </section>

        {page === "services" && (
          <section className="services-experience services-page-direct" id="services" aria-label="Mindrythm services">
            <header><span>Mindrythm / Services</span><h1>Services</h1><p>One studio. Many visual languages.</p></header>
            <div className="services-layout">
              <div className="services-list">
                {serviceItems.map((service, index) => (
                  <button type="button" aria-pressed={activeService === index} className={activeService === index ? "active" : ""} key={service.title} onMouseEnter={() => setActiveService(index)} onFocus={() => setActiveService(index)} onClick={() => setActiveService(index)}>
                    <strong>{service.title}</strong><span>{service.copy}</span><i>+</i>
                  </button>
                ))}
              </div>
              <div className="services-preview" aria-live="polite">
                {serviceCollections.map((service, index) => (
                  <div className={`service-preview-group ${activeService === index ? "active" : ""}`} data-count={service.media.length} key={service.key}>
                    {service.media.map((item) => <span className="service-preview-media" key={`${service.key}-${item.id}`}><Media item={item} active={activeService === index} /></span>)}
                  </div>
                ))}
                <Link className="services-preview-link" href={`/work?service=${serviceItems[activeService]?.key || serviceItems[0]?.key}`}>
                  <span>{serviceItems[activeService]?.title || serviceItems[0]?.title}</span><i>View service work</i>
                </Link>
              </div>
            </div>
          </section>
        )}

        {page === "work" && (
          <>
            <section className="work-filter-bar" aria-label="Work filters">
              <span>Filter work</span>
              <div className="work-filter-chips">
                <button type="button" className={workFilter === "all" ? "active" : ""} onClick={() => setWorkFilter("all")}>All commissions</button>
                {serviceItems.map((service) => (
                  <button type="button" key={service.key} className={workFilter === service.key ? "active" : ""} onClick={() => setWorkFilter(service.key as ServiceKey)}>{service.title}</button>
                ))}
              </div>
            </section>
            <section className="work-page-grid">
              {visibleProjects.map((project) => {
                const projectService = workFilter === "all" ? getProjectService(project, serviceItems) : workFilter;
                const relatedProjects = projectService ? getServiceProjects(projects, projectService, serviceItems) : [project];
                return (
                  <details className="work-page-card" key={project.id}>
                    <summary>
                      <Media item={project} />
                      <div><span>{project.category}</span><h2>{project.title}</h2><p>{project.eyebrow}</p></div>
                      <b>View project +</b>
                    </summary>
                    <div className="work-page-detail">
                      <p>{project.body}</p>
                      <div>{relatedProjects.slice(0, 3).map((item) => <Media key={`${project.id}-${item.id}`} item={item} />)}</div>
                      <span>{project.year} / Mindrythm</span>
                    </div>
                  </details>
                );
              })}
            </section>
          </>
        )}

        {page === "gallery" && (
          <div className="gallery-page">
            <section className="gallery-page-section gallery-page-unified">
              <header>
                <h2>Gallery Archive</h2>
                <p>An immersive visual collection of spaces, architecture, lifestyle and human moments.</p>
              </header>
              <div className="gallery-page-grid">
                {galleryItems.map((item, index) => (
                  <button
                    type="button"
                    className={`gallery-page-card gallery-page-card-${(index % 4) + 1}`}
                    key={item.id}
                    onClick={() => setSelected(item)}
                  >
                    <Media item={item} />
                    <span>{item.title}</span>
                  </button>
                ))}
                <article className="gallery-page-feature">
                  <span>Mindrythm archive</span>
                  <p>Spaces, light, material and stories captured with intention.</p>
                  <i>Explore the full collection</i>
                </article>
                <article className="gallery-page-social">
                  <span>Follow the living archive</span>
                  <div className="gallery-page-social-links" aria-label="Mindrythm social links">
                    <a href={mainInstagramUrl} target="_blank" rel="noreferrer" aria-label="Mindrythm on Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
                    <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Mindrythm on Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
                    <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="Mindrythm on YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
                  </div>
                </article>
              </div>
            </section>
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
                    <span>{member.category}</span><h2>{member.title}</h2><p>{member.body}</p>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setActiveTeamCardId(null); setSelected(member); }}>View profile</button>
                  </div>
                </article>
              ))}
            </section>
            <section className="team-page-note"><span>Built around the story</span><h2>A focused core.<br /><em>The right specialists.</em></h2><p>Each commission brings together the precise mix of property, event or wedding photographers, filmmakers, aerial operators and editors it needs.</p><a href="/contact">Work with the team</a></section>
          </>
        )}

        {page === "story" && (
          <div className="story-page">
            <section className="story-manifesto">
              <span>What is Mindrythm?</span>
              <blockquote>“{visionParagraphs[0]}”</blockquote>
            </section>
            <section className="story-pillars">
              <article>
                <img className="story-pillar-media" src="/images/filmmaker.jpg" alt="Wellness guest reading in a tropical retreat" />
                <div className="story-pillar-copy">
                  <h2>What we capture</h2>
                  <p>We work across properties, resorts, luxury villas, culinary spaces and events through photography, cinematic film and aerial capture.</p>
                </div>
              </article>
              <article>
                <img className="story-pillar-media" src="/images/event-stage.jpg" alt="Guided wellness gathering captured by Mindrythm" />
                <div className="story-pillar-copy">
                  <h2>Who we work with</h2>
                  <p>We work with real estate clients, luxury villas, heritage houses or heritage properties, cafes and restaurants (small and large-scale F&B businesses), wellness and hospitality spaces, and event managers to cover corporate events and music festivals.</p>
                </div>
              </article>
              <article>
                <img className="story-pillar-media" src="/images/modern-house.jpg" alt="Woodland retreat setting photographed by Mindrythm" />
                <div className="story-pillar-copy">
                  <h2>How we work</h2>
                  <p>Every commission begins with listening, a clear visual plan and space for authentic, intentional moments to unfold.</p>
                </div>
              </article>
            </section>
            <section className="story-narrative story-vision-full">
              <header><span>Our vision</span><h2>Ideas find their visual language.</h2></header>
              <div>{visionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </section>
            <section className="story-vision">
              <img src="/mindrythm-logomark.png" alt="Mindrythm logomark" />
              <div><span>Our vision</span><h2>Ideas find their visual language.</h2><p>“{visionParagraphs[3]}”</p></div>
            </section>
            <section className="story-narrative story-mission">
              <header><span>Our mission</span><h2>A conversation before a brief.</h2></header>
              <div>{missionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </section>
            <section className="story-narrative story-people">
              <header><span>Our people</span><h2>Never about one person.</h2></header>
              <div><p>{teamIntroduction}</p><a href="/team">Meet the team</a></div>
            </section>
          </div>
        )}

        {page === "contact" && (
          <div className="contact-page">
            <section className="contact-page-intro">{enquiryTaglines.map((line) => <blockquote key={line}>“{line}”</blockquote>)}</section>
            <section className="contact-page-info">
              <div><span>Call</span><a href={`tel:${settings.phonePrimary}`}>{settings.phonePrimary}</a><a href={`tel:${settings.phoneSecondary}`}>{settings.phoneSecondary}</a></div>
              <div><span>Email</span><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></div>
              <div><span>Visit</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`} target="_blank" rel="noreferrer">{settings.address}</a></div>
            </section>
            <form className="contact-page-form" id="enquiry" onSubmit={sendEnquiry}>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" hidden />
              <div className="form-field"><label htmlFor="contact-name">Full name *</label><input id="contact-name" name="name" required /></div>
              <div className="form-field"><label htmlFor="contact-phone">Phone number *</label><input id="contact-phone" name="phone" type="tel" required /></div>
              <div className="form-field"><label htmlFor="contact-email">Email ID</label><input id="contact-email" name="email" type="email" /></div>
              <div className="form-field">
                <label htmlFor="contact-service">Service *</label>
                <select id="contact-service" name="service" required defaultValue="">
                  <option value="" disabled>Select a service</option>
                  <option>Real estate photography</option>
                  <option>Wellness &amp; Hospitality photography</option>
                  <option>F&amp;B photography</option>
                  <option>Luxury Villa Photography</option>
                  <option>Event photography (corporate and music)</option>
                  <option>Website development</option>
                  <option>Logo generation</option>
                  <option>Running Meta Ads</option>
                  <option>Social media creatives</option>
                  <option>Social Media Handling</option>
                  <option>Other / Custom Brief</option>
                </select>
              </div>
              <div className="form-field form-field-wide"><label htmlFor="contact-query">Your query *</label><textarea id="contact-query" name="query" rows={7} maxLength={1000} required /></div>
              <button type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send enquiry"}</button>
              <p className={`form-message ${formState}`} aria-live="polite">{formState === "sent" ? "Thank you. Your enquiry has been sent to admin@mindrythm.com." : formState === "error" ? "Your enquiry could not be delivered. Please email admin@mindrythm.com directly." : "Your message will be sent securely to admin@mindrythm.com."}</p>
            </form>
            <div className="contact-page-map"><iframe title="Mindrythm location" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`} /></div>
          </div>
        )}
      </main>

      <footer className="inner-footer">
        <Link href="/" onClick={returnToHero}><img src="/mindrythm-logomark.png" alt="" />Mindrythm</Link>
        <span>© {new Date().getFullYear()}</span>
        <div className="inner-footer-socials" aria-label="Mindrythm social links">
          <a href={mainInstagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
          <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
          <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
        </div>
        <a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/studio">Admin</a>
      </footer>
      <BackToTop />

      {selected && (() => {
        const allItems = galleryItems;
        const currentIndex = allItems.findIndex((item) => item.id === selected.id);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < allItems.length - 1;
        const goPrev = () => hasPrev && setSelected(allItems[currentIndex - 1]);
        const goNext = () => hasNext && setSelected(allItems[currentIndex + 1]);
        return (
          <div className="lightbox-immersive" role="dialog" aria-modal="true" aria-label={selected.title}>
            <div className="lightbox-stage">
              <div className="lightbox-media-wrapper">
                <Media item={selected} priority />
              </div>
            </div>
            <div className="lightbox-immersive-toolbar">
              <button type="button" className="lightbox-grid-btn" onClick={() => setSelected(null)} aria-label="Back to gallery">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>
              <button type="button" className="lightbox-close-btn" onClick={() => setSelected(null)} aria-label="Close">Close ×</button>
            </div>
            {hasPrev && (
              <button type="button" className="lightbox-nav lightbox-nav-prev" onClick={goPrev} aria-label="Previous image">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M18 4L8 14L18 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            {hasNext && (
              <button type="button" className="lightbox-nav lightbox-nav-next" onClick={goNext} aria-label="Next image">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M10 4L20 14L10 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            <div className="lightbox-docked-copy">
              <div className="lightbox-copy-inner">
                <span>{selected.category || selected.eyebrow}</span>
                <h2>{selected.title}</h2>
                {selected.body && <p>{selected.body}</p>}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

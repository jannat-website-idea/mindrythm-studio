"use client";

import {
  mainInstagramUrl as defaultInstagramUrl,
  type ContentItem,
  type SiteContent,
} from "@/lib/content";
import { BackToTop } from "@/app/back-to-top";
import { BentoTemplate } from "@/app/bento-template";
import { EmphasizedCopy } from "@/app/emphasized-copy";
import { ImmersiveLightbox } from "@/app/immersive-lightbox";
import { Media } from "@/app/media";
import { SocialIcon } from "@/app/social-icon";
import { TeamMemberCard } from "@/app/team-member-card";
import { TeamShowcase } from "@/app/team-showcase";
import { getProjectService, getServiceProjects, isServiceKey, type ServiceKey } from "@/lib/services";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export type EditorialPageKind = "services" | "work" | "gallery" | "team" | "story" | "contact";

const navigationItems = [
  { label: "Home", href: "/", note: "Begin here" },
  { label: "Services", href: "/services", note: "What we create" },
  { label: "Our Work", href: "/work", note: "Selected commissions" },
  { label: "Gallery", href: "/gallery", note: "Stories and moments" },
  { label: "Our Team", href: "/team", note: "The people behind it" },
  { label: "Our Story", href: "/story", note: "The studio rhythm" },
  { label: "Enquire", href: "/contact", note: "Start a conversation" },
] as const;

export function EditorialPage({ content, page }: { content: SiteContent; page: EditorialPageKind }) {
  const { settings } = content;
  const contactEmail = settings.contactEmail === "hello@mindrythm.studio" ? "Admin@mindrythm.com" : settings.contactEmail;
  const {enquiryTaglines, missionParagraphs, teamIntroduction, visionParagraphs} = content.copy;
  const serviceItems = content.services;
  const mainInstagramUrl = settings.instagram || defaultInstagramUrl;
  const projects = content.items.filter((item) => item.kind === "project").sort((a, b) => a.sortOrder - b.sortOrder);
  const gallery = content.items.filter((item) => item.kind === "gallery");
  const galleryItems = gallery;
  const serviceCollections = serviceItems.map((service, index) => {
    const directMedia = getServiceProjects(projects, service.key, serviceItems);
    if (directMedia.length) return { ...service, media: directMedia };
    const offset = (index * 2) % Math.max(1, projects.length);
    const fallback = [...projects.slice(offset), ...projects.slice(0, offset)].slice(0, 3);
    return { ...service, media: fallback.length ? fallback : projects.slice(0, 3) };
  });
  const team = useMemo(
    () => content.items.filter((item) => item.kind === "team").sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [content.items],
  );
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [activeTeamCardId, setActiveTeamCardId] = useState<string | null>(null);
  const [activeService, setActiveService] = useState(0);
  const [workFilter, setWorkFilter] = useState<"all" | ServiceKey>("all");
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [contactQuery, setContactQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const formStartedAtRef = useRef(0);

  useEffect(() => {
    formStartedAtRef.current = Date.now();
  }, []);

  function returnToHero() {
    try {
      window.sessionStorage.setItem("mindrythmSkipIntro", "1");
      window.sessionStorage.setItem("mindrythmSeenIntro", "1");
    } catch {}
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
      if (event.target instanceof Element && event.target.closest(".team-member-card, .team-card, .team-page-card")) return;
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
    if (page === "work") {
      const requested = new URLSearchParams(window.location.search).get("service");
      if (requested && isServiceKey(requested, serviceItems)) setWorkFilter(requested as ServiceKey);
    } else if (page === "team") {
      const urlParams = new URLSearchParams(window.location.search);
      const memberParam = urlParams.get("member") || (typeof window !== "undefined" ? window.location.hash.replace("#", "") : "");
      if (memberParam) {
        const match = team.find(
          (m) =>
            m.id.toLowerCase() === memberParam.toLowerCase() ||
            m.title.toLowerCase().replace(/\s+/g, "-") === memberParam.toLowerCase() ||
            m.title.toLowerCase().includes(memberParam.toLowerCase())
        );
        if (match) setSelected(match);
      }
    }
  }, [page, serviceItems, team]);

  const visibleProjects = useMemo(() => {
    if (workFilter === "all") return projects;
    return getServiceProjects(projects, workFilter, serviceItems);
  }, [projects, serviceItems, workFilter]);

  async function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("sending");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const rawQuery = String(formData.get("query") || "").trim();
    if (rawQuery.length < 10) {
      setFormErrorMessage("Please write at least 10 characters to send your enquiry.");
      setFormState("error");
      const textarea = form.querySelector<HTMLTextAreaElement>("#contact-query");
      textarea?.focus();
      return;
    }

    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      service: String(formData.get("service") || ""),
      query: rawQuery,
      website: String(formData.get("website") || ""),
      submittedAt: Date.now(),
      startedAt: formStartedAtRef.current,
      formStartedAt: formStartedAtRef.current,
    };

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMsg =
          data?.fields?.query?.[0] ||
          data?.fields?.phone?.[0] ||
          data?.fields?.email?.[0] ||
          data?.fields?.name?.[0] ||
          data?.fields?.service?.[0] ||
          data?.error ||
          "Your enquiry could not be delivered. Please email admin@mindrythm.com directly.";
        setFormErrorMessage(errorMsg);
        throw new Error(errorMsg);
      }
      setFormErrorMessage("");
      setFormState("sent");
      setContactQuery("");
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
        <nav
          id="inner-navigation"
          className={navigationOpen ? "open" : ""}
          aria-label="Site navigation"
          onClick={() => setNavigationOpen(false)}
        >
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
          aria-label="Toggle navigation"
          onClick={() => setNavigationOpen((open) => !open)}
        >
          {navigationOpen ? "Close" : "Menu"}
        </button>
      </header>

      <div className={`menu-overlay ${navigationOpen ? "is-open nav-open" : ""}`} aria-hidden={!navigationOpen}>
        <div className="menu-overlay-panel">
          <div className="menu-overlay-header">
            <span className="menu-overlay-title">Navigation</span>
            <button type="button" className="menu-overlay-close" aria-label="Close menu" onClick={() => setNavigationOpen(false)}>
              ✕ Close
            </button>
          </div>
          <nav className="menu-overlay-links" aria-label="Main menu">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="menu-overlay-link"
                onClick={() => {
                  if (item.href === "/") {
                    returnToHero();
                  }
                  setNavigationOpen(false);
                }}
              >
                <span>{item.label}</span>
                <small>{item.note}</small>
              </Link>
            ))}
          </nav>
          <div className="menu-overlay-meta">
            <div className="menu-overlay-socials" aria-label="Mindrythm social links">
              <a href={mainInstagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
              <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
            </div>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
        </div>
      </div>

      <main>
        {page !== "gallery" && (
          <section className={`inner-hero inner-hero-${page}`}>
            <span>Mindrythm / {page === "work" ? "Our Work" : page === "story" ? "Our Story" : page === "team" ? "Our Team" : page === "services" ? "Services" : page.slice(0, 1).toUpperCase() + page.slice(1)}</span>
            <h1>
              {page === "work" && "Our Work"}
              {page === "team" && "Our Team"}
              {page === "story" && "Our Story"}
              {page === "services" && "Services"}
              {page === "contact" && "Enquire"}
            </h1>
            <p>
              {page === "work" && "Selected commissions spanning properties, retreats, moments and commercial narratives."}
              {page === "team" && "Photographers, filmmakers, directors and craftspeople dedicated to purposeful storytelling."}
              {page === "story" && "A studio shaped around listening, authenticity and the belief that every story has a rhythm."}
              {page === "services" && "A focused visual practice across real estate, hospitality, architecture, commercial campaigns and modern digital identity."}
              {page === "contact" && "Tell us about your space, occasion or brand vision. We listen before we frame."}
            </p>
          </section>
        )}

        {page === "services" && (
          <div className="services-page-root">
            <section className="services-stream-section" aria-label="Mindrythm studio services catalogue">
              <div className="services-stream-list">
                {serviceCollections.map((service, index) => {
                  const primaryMedia = service.media[0] || projects[index % Math.max(1, projects.length)];
                  const isEven = index % 2 === 1;
                  return (
                    <article
                      className={`services-stream-card ${isEven ? "is-reversed" : ""}`}
                      id={`service-${service.key}`}
                      key={service.key}
                    >
                      {service.key === "commercial-branding" && <span id="service-trademark-registration" className="sr-only" aria-hidden="true" />}
                      <div className="services-stream-info">
                        <span className="services-clean-index">{String(index + 1).padStart(2, "0")}</span>
                        <h2 className="services-stream-title">{service.title}</h2>
                        <p className="services-stream-copy">{service.copy}</p>

                        <div className="services-stream-actions">
                          <Link className="services-stream-primary-cta" href={`/contact?service=${encodeURIComponent(service.title)}`}>
                            <span>Book this service</span>
                            <span aria-hidden="true">→</span>
                          </Link>
                          <Link className="services-stream-secondary-cta" href={`/work?service=${service.key}`}>
                            <span>View work</span>
                          </Link>
                        </div>
                      </div>

                      <div className="services-stream-visual">
                        {primaryMedia && (
                          <button
                            type="button"
                            className="services-photo-thumb services-photo-single"
                            onClick={() => setSelected(primaryMedia)}
                            aria-label={`Open full size photo of ${service.title}`}
                          >
                            <Media item={primaryMedia} priority={index < 2} />
                            <span className="services-photo-hint">Click to enlarge</span>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
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
            <section className="work-page-grid" aria-label="Mindrythm project highlights">
              {visibleProjects.map((project, index) => (
                <article className="work-page-card" key={project.id}>
                  <button
                    type="button"
                    className="work-page-hero-btn"
                    onClick={() => setSelected(project)}
                    aria-label={`Open ${project.title} full size in lightbox`}
                  >
                    <div className="work-page-media-frame">
                      <Media item={project} priority={index < 2} />
                      <div className="work-page-card-overlay">
                        <div className="work-page-card-meta">
                          <span className="work-page-card-badge">{project.category}</span>
                          <h2 className="work-page-card-title">{project.title}</h2>
                          <p className="work-page-card-eyebrow">{project.eyebrow}</p>
                        </div>
                        <span className="work-page-card-cta">
                          <span>Open full view</span>
                          <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </section>
          </>
        )}

        {page === "gallery" && (
          <div className="gallery-page gallery-page-dark">
            <section className="gallery-section-container" id="gallery">
              <header className="gallery-section-header">
                <h2>Gallery</h2>
                <p>Curated frames / Selected works</p>
              </header>
              <BentoTemplate
                items={galleryItems}
                pattern="gallery"
                onOpen={setSelected}
              />
            </section>
          </div>
        )}

        {page === "team" && (
          <>
            <section className="team-introduction"><span>Built together</span><p>{teamIntroduction}</p></section>
            <section className="team-page-grid" aria-label="Mindrythm team members">
              {team.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  isActive={activeTeamCardId === member.id}
                  onToggle={() => setActiveTeamCardId((current) => (current === member.id ? null : member.id))}
                  onClose={() => setActiveTeamCardId(null)}
                  onReadMore={() => setSelected(member)}
                  showExploreLink={false}
                />
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
                  {serviceItems.map((service) => (
                    <option key={service.key} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                  <option value="Other / Custom Brief">Other / Custom Brief</option>
                </select>
              </div>
              <div className="form-field form-field-wide">
                <div className="query-label-row">
                  <label htmlFor="contact-query">Your query *</label>
                  <span
                    className={`query-char-guide ${
                      contactQuery.trim().length === 0
                        ? ""
                        : contactQuery.trim().length < 10
                        ? "is-short"
                        : "is-ready"
                    }`}
                    aria-live="polite"
                  >
                    {contactQuery.trim().length === 0
                      ? "Min. 10 characters"
                      : contactQuery.trim().length < 10
                      ? `Please write at least 10 characters (${10 - contactQuery.trim().length} more needed)`
                      : `✓ ${contactQuery.trim().length} characters`}
                  </span>
                </div>
                <textarea
                  id="contact-query"
                  name="query"
                  rows={7}
                  maxLength={1000}
                  minLength={10}
                  required
                  value={contactQuery}
                  onChange={(e) => {
                    setContactQuery(e.target.value);
                    if (formErrorMessage) setFormErrorMessage("");
                    if (formState === "error") setFormState("idle");
                  }}
                  placeholder="Describe your project, vision, timelines or requirements (min. 10 characters)…"
                />
              </div>
              <button type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send enquiry"}</button>
              <p className={`form-message ${formState}`} aria-live="polite">
                {formState === "sent"
                  ? "Thank you. Your enquiry has been sent to admin@mindrythm.com."
                  : formState === "error"
                    ? (formErrorMessage || "Your enquiry could not be delivered. Please email admin@mindrythm.com directly.")
                    : "Your message will be sent securely to admin@mindrythm.com."}
              </p>
            </form>
            <div className="contact-page-map"><iframe title="Mindrythm location" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`} /></div>
          </div>
        )}
      </main>

      <footer className="inner-footer site-footer">
        <div className="footer-main-grid">
          {/* Column 1: Brand Info & Socials */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-header">
              <img src="/mindrythm-logomark.png" alt="Mindrythm logomark" className="footer-brand-logo" />
              <h3 className="footer-brand-title">Mindrythm</h3>
            </div>
            <p className="footer-brand-desc">
              Translating unseen narratives into honest, cinematic films and timeless imagery. Preserving authentic moments, spaces, and brand rhythm.
            </p>
            <div className="footer-social-links" aria-label="Mindrythm social links">
              <a href={mainInstagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
              <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-col-title">Quick Links</h4>
            <nav className="footer-nav-list" aria-label="Footer quick links">
              <Link href="/" onClick={returnToHero}>Home</Link>
              <Link className={page === "services" ? "active" : ""} href="/services">Services</Link>
              <Link className={page === "work" ? "active" : ""} href="/work">Our Work</Link>
              <Link className={page === "gallery" ? "active" : ""} href="/gallery">Gallery</Link>
              <Link className={page === "team" ? "active" : ""} href="/team">Our Team</Link>
              <Link className={page === "story" ? "active" : ""} href="/story">Our Story</Link>
              <Link className={page === "contact" ? "active" : ""} href="/contact">Enquire</Link>
            </nav>
          </div>

          {/* Column 3: Studio Services */}
          <div className="footer-col footer-col-services">
            <h4 className="footer-col-title">Our Services</h4>
            <nav className="footer-nav-list" aria-label="Footer services">
              <Link href="/services#service-visual-production">Visual Production (Photo + Film)</Link>
              <Link href="/services#service-drone-imagery">Drone &amp; Aerial Imagery</Link>
              <Link href="/services#service-website-development">Website Development</Link>
              <Link href="/services#service-social-media-creatives">Social Media Creatives</Link>
              <Link href="/services#service-meta-ads">Meta Ads &amp; Campaign Direction</Link>
              <Link href="/services#service-commercial-branding">Commercial Branding</Link>
            </nav>
          </div>

          {/* Column 4: Contact Us */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-col-title">Contact Us</h4>
            <div className="footer-contact-items">
              <div className="footer-contact-item">
                <svg className="footer-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{settings.address || "250, Bansdroni, Rifle Club Playground, Kolkata - 700070, India"}</span>
              </div>
              <div className="footer-contact-item">
                <svg className="footer-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href={`tel:${settings.phonePrimary ? settings.phonePrimary.replace(/\s+/g, "") : "+919073573878"}`}>{settings.phonePrimary || "+91 90735 73878"}</a>
              </div>
              <div className="footer-contact-item">
                <svg className="footer-contact-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Segment */}
        <div className="footer-copyright-row">
          <p className="footer-copyright-text">
            Copyright © {new Date().getFullYear()} Mindrythm Studios Pvt. Ltd. All Rights Reserved.
          </p>
          <div className="footer-legal-links">
            <Link href="/privacy">Privacy Policy</Link>
            <span className="footer-legal-dot">•</span>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <span className="footer-legal-dot">•</span>
            <Link href="/studio">Content Studio</Link>
          </div>
        </div>
      </footer>
      <BackToTop />

      {selected && (
        selected.kind === "team" ? (
          <TeamShowcase
            team={team}
            initialMemberId={selected.id}
            onClose={() => {
              setSelected(null);
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.delete("member");
                window.history.replaceState(null, "", url.pathname);
              }
            }}
          />
        ) : (() => {
          const serviceMedia = serviceCollections.flatMap((s) => s.media);
          const allItems = Array.from(new Map([...galleryItems, ...serviceMedia, ...projects].map((item) => [item.id, item])).values());
          return (
            <ImmersiveLightbox
              selected={selected}
              items={allItems}
              onClose={() => setSelected(null)}
              onSelect={setSelected}
            />
          );
        })()
      )}
    </div>
  );
}

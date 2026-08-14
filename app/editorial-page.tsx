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
  const serviceCollections = serviceItems.map((service) => ({ ...service, media: getServiceProjects(projects, service.key, serviceItems) }));
  const savedTeam = content.items.filter((item) => item.kind === "team");
  const teamFallbacks = projects.slice(0, 3).map((item, index) => ({
    ...item,
    id: `team-${item.id}-${index}`,
    kind: "team" as const,
    title: ["Property & commercial", "Events & celebrations", "Film & post"][index] || "Studio specialist",
    body: ["Resort, real-estate, architectural and brand photography.", "Candid event coverage, wedding portraits, rituals and live moments.", "Wedding films, event aftermovies, drone capture, edit and colour."][index] || item.body,
    category: ["Lead Photographer", "Event Photographer", "Film & Post"][index] || "Specialist",
    href: index === 1 ? settings.linkedin : mainInstagramUrl,
  }));
  const team = [...savedTeam, ...teamFallbacks].slice(0, 3);
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
    const closeWithKeyboard = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeWithKeyboard);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeWithKeyboard);
    };
  }, [selected]);

  useEffect(() => {
    if (page !== "work") return;
    const requested = new URLSearchParams(window.location.search).get("service");
    // This mirrors the service encoded in the URL into the existing filter control.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isServiceKey(requested, serviceItems)) setWorkFilter(requested);
  }, [page, serviceItems]);

  const visibleProjects = workFilter === "all" ? projects : getServiceProjects(projects, workFilter, serviceItems);

  function selectWorkFilter(filter: "all" | ServiceKey) {
    setWorkFilter(filter);
    const url = new URL(window.location.href);
    if (filter === "all") url.searchParams.delete("service");
    else url.searchParams.set("service", filter);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }

  const pageMeta = useMemo(() => ({
    services: ["Services", "One studio. Many visual languages."],
    work: ["Our Work", "Properties, events and weddings photographed and filmed to be remembered."],
    gallery: ["Gallery", "An immersive visual archive of spaces, people and celebrations."],
    team: ["Our Team", "A specialist collective assembled around the needs of every story."],
    story: ["Our Story", "The thinking, people and process behind Mindrythm photography and films."],
    contact: ["Enquire", "Tell us about your property, event, wedding or next visual story."],
  }[page]), [page]);

  async function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("sending");
    const formElement = event.currentTarget;
    try {
      const form = new FormData(formElement);
      const payload = {...Object.fromEntries(form.entries()), startedAt: formStartedAtRef.current};
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Enquiry delivery failed");
      setFormState("sent");
      formElement.reset();
      formStartedAtRef.current = Date.now();
    } catch {
      setFormState("error");
    }
  }

  return (
    <div className="inner-shell">
      <header className="inner-header">
        <Link className="wordmark" href="/" aria-label="Mindrythm home" onClick={returnToHero}><img src="/mindrythm-logomark.png" alt="" /><span>Mindrythm</span></Link>
        <nav id="inner-navigation" className={navigationOpen ? "nav-open" : ""} aria-label="Site navigation">
          <Link href="/" onClick={returnToHero}>Home</Link>
          <Link className={page === "services" ? "active" : ""} href="/services" onClick={() => setNavigationOpen(false)}>Services</Link>
          <Link className={page === "work" ? "active" : ""} href="/work" onClick={() => setNavigationOpen(false)}>Our Work</Link>
          <Link className={page === "gallery" ? "active" : ""} href="/gallery" onClick={() => setNavigationOpen(false)}>Gallery</Link>
          <Link className={page === "team" ? "active" : ""} href="/team" onClick={() => setNavigationOpen(false)}>Our Team</Link>
          <Link className={page === "story" ? "active" : ""} href="/story" onClick={() => setNavigationOpen(false)}>Our Story</Link>
          <Link className={page === "contact" ? "active" : ""} href="/contact" onClick={() => setNavigationOpen(false)}>Enquire</Link>
        </nav>
        <Link className="inner-home" href="/" aria-label="Return to homepage" onClick={returnToHero}>Home</Link>
        <button className="inner-menu-toggle" type="button" aria-controls="inner-navigation" aria-expanded={navigationOpen} onClick={() => setNavigationOpen((open) => !open)}>{navigationOpen ? "Close" : "Menu"}</button>
      </header>

      <main>
        {page !== "services" && (
          <section className={`inner-hero inner-hero-${page}`}>
            <span>Mindrythm / {pageMeta[0]}</span>
            <h1>{pageMeta[0]}</h1>
            <p>{pageMeta[1]}</p>
          </section>
        )}

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
                <Link className="services-preview-link" href={`/work?service=${serviceItems[activeService].key}`}>
                  <span>{serviceItems[activeService].title}</span><i>View service work</i>
                </Link>
              </div>
            </div>
          </section>
        )}

        {page === "work" && (
          <>
            <nav className="work-filter-bar" aria-label="Filter work by service">
              <button type="button" className={workFilter === "all" ? "active" : ""} aria-pressed={workFilter === "all"} onClick={() => selectWorkFilter("all")}>All work</button>
              {serviceItems.map((service) => (
                <button type="button" className={workFilter === service.key ? "active" : ""} aria-pressed={workFilter === service.key} key={service.key} onClick={() => selectWorkFilter(service.key)}>{service.title}</button>
              ))}
            </nav>
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
            {(["Spaces", "Celebrations"] as const).map((category, categoryIndex) => {
              const matching = galleryItems.filter((item) => item.category.toLowerCase() === category.toLowerCase());
              const items = matching.length ? matching : galleryItems.filter((_, index) => index % 2 === categoryIndex);
              return (
                <section className={`gallery-page-section gallery-page-section-${category.toLowerCase()}`} key={category}>
                  <header><h2>{category}</h2><p>{category === "Spaces" ? "Property, architecture, landscape and the first impression of arrival." : "Weddings, events, people and the energy of moments shared."}</p></header>
                  <div className="gallery-page-grid">
                    {items.map((item, index) => <button type="button" className={`gallery-page-card gallery-page-card-${(index % 4) + 1}`} key={item.id} onClick={() => setSelected(item)}><Media item={item} /><span>{item.title}</span></button>)}
                    <article className="gallery-page-feature">
                      <span>Mindrythm archive</span>
                      <p>{category === "Spaces" ? "Spaces shaped by light, material and a sense of arrival." : "Celebrations held in light, ritual and memory."}</p>
                      <i>Open the full gallery</i>
                    </article>
                    <article className="gallery-page-social">
                      <span>Follow the living archive</span>
                      <div className="gallery-page-social-links" aria-label={`Mindrythm ${category.toLowerCase()} social links`}>
                        <a href={mainInstagramUrl} target="_blank" rel="noreferrer" aria-label="Mindrythm on Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
                        <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Mindrythm on Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
                        <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="Mindrythm on YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
                      </div>
                    </article>
                  </div>
                </section>
              );
            })}
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
            <section className="story-manifesto"><span>What is Mindrythm?</span><blockquote>“<EmphasizedCopy text={visionParagraphs[0]} />”</blockquote></section>
            <section className="story-pillars">
              <article><img className="story-pillar-media" src="/images/filmmaker.jpg" alt="Wellness guest reading in a tropical retreat" /><div className="story-pillar-copy"><h2>What we capture</h2><p>We work across properties, resorts, events and weddings through photography, cinematic film and aerial capture.</p></div></article>
              <article><img className="story-pillar-media" src="/images/event-stage.jpg" alt="Guided wellness gathering captured by Mindrythm" /><div className="story-pillar-copy"><h2>Who we work with</h2><p>Couples, families, event teams, developers, architects, resorts and brands seeking a distinct visual point of view.</p></div></article>
              <article><img className="story-pillar-media" src="/images/modern-house.jpg" alt="Woodland retreat setting photographed by Mindrythm" /><div className="story-pillar-copy"><h2>How we work</h2><p>Every commission begins with listening, a clear visual plan and space for real moments to happen.</p></div></article>
            </section>
            <section className="story-narrative story-vision-full"><header><span>Our vision</span><h2>Ideas find their visual language.</h2></header><div>{visionParagraphs.map((paragraph) => <p key={paragraph}><EmphasizedCopy text={paragraph} /></p>)}</div></section>
            <section className="story-vision"><img src="/mindrythm-logomark.png" alt="Mindrythm logomark" /><div><span>Our vision</span><h2>Ideas find their visual language.</h2><p>“<EmphasizedCopy text={visionParagraphs[3]} />”</p></div></section>
            <section className="story-narrative story-mission"><header><span>Our mission</span><h2>A conversation before a brief.</h2></header><div>{missionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
            <section className="story-narrative story-people"><header><span>Our people</span><h2>Never about one person.</h2></header><div><p>{teamIntroduction}</p><a href="/team">Meet the team</a></div></section>
          </div>
        )}

        {page === "contact" && (
          <div className="contact-page">
            <section className="contact-page-intro">{enquiryTaglines.map((line) => <blockquote key={line}>“{line}”</blockquote>)}</section>
            <section className="contact-page-info">
              <div><span>Call</span><a href={`tel:${settings.phonePrimary}`}>{settings.phonePrimary}</a><a href={`tel:${settings.phoneSecondary}`}>{settings.phoneSecondary}</a></div>
              <div><span>Email</span><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></div>
              <div><span>Visit</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`} target="_blank" rel="noreferrer">{settings.address}</a></div>
              <div><span>Social</span><div className="contact-page-socials" aria-label="Mindrythm social links">
                <a href={mainInstagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
                <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
                <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
              </div></div>
            </section>
            <form className="contact-page-form" id="enquiry" onSubmit={sendEnquiry}>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" hidden />
              <div className="form-field"><label htmlFor="contact-name">Full name *</label><input id="contact-name" name="name" required /></div>
              <div className="form-field"><label htmlFor="contact-phone">Phone number *</label><input id="contact-phone" name="phone" type="tel" required /></div>
              <div className="form-field"><label htmlFor="contact-email">Email ID</label><input id="contact-email" name="email" type="email" /></div>
              <div className="form-field"><label htmlFor="contact-service">Service *</label><select id="contact-service" name="service" required defaultValue=""><option value="" disabled>Select a service</option><option>Property photography</option><option>Resort &amp; hospitality</option><option>Event photography</option><option>Event film</option><option>Wedding photography</option><option>Wedding or pre-wedding film</option><option>Other</option></select></div>
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

      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title}>
          <button type="button" className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close modal">Close ×</button>
          <div className="lightbox-copy">
            <span>{selected.category || selected.eyebrow} {selected.year ? `/ ${selected.year}` : ""}</span>
            <h2>{selected.title}</h2>
            <p>{selected.body}</p>
            {selected.kind === "team" && (
              <div className="lightbox-socials">
                <a href={selected.href || mainInstagramUrl} target="_blank" rel="noreferrer">Instagram</a>
                <a href={settings.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              </div>
            )}
          </div>
          <div className="lightbox-image">
            <Media item={selected} priority />
          </div>
        </div>
      )}
    </div>
  );
}

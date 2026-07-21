"use client";

import type { ContentItem, SiteContent } from "@/lib/content";
import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";

const fallbackTestimonials: ContentItem[] = [
  {
    id: "review-one",
    kind: "testimonial",
    sortOrder: 10,
    title: "A thoughtful, deeply collaborative team.",
    eyebrow: "Creative partner",
    body: "Mind Rhythm understood the feeling behind the brief and translated it into a visual language that felt precise, human and completely our own.",
    mediaUrl: "",
    mediaAlt: "",
    category: "Google review",
    year: "5.0",
    href: "#testimonials",
    accent: "approved",
  },
  {
    id: "review-two",
    kind: "testimonial",
    sortOrder: 20,
    title: "Beautiful work, handled with clarity.",
    eyebrow: "Brand collaborator",
    body: "From the first conversation to the final frame, the process was calm, considered and full of strong creative choices.",
    mediaUrl: "",
    mediaAlt: "",
    category: "Google review",
    year: "5.0",
    href: "#testimonials",
    accent: "approved",
  },
];

export function Experience({ content }: { content: SiteContent }) {
  const { settings } = content;
  const projects = useMemo(
    () => content.items.filter((item) => item.kind === "project").sort((a, b) => a.sortOrder - b.sortOrder),
    [content.items],
  );
  const heroItems = useMemo(() => {
    const saved = content.items.filter((item) => item.kind === "hero").sort((a, b) => a.sortOrder - b.sortOrder);
    return saved.length ? saved : projects.slice(0, 3);
  }, [content.items, projects]);
  const galleryItems = useMemo(() => {
    const saved = content.items.filter((item) => item.kind === "gallery").sort((a, b) => a.sortOrder - b.sortOrder);
    return saved.length ? saved : projects;
  }, [content.items, projects]);
  const savedTeam = useMemo(
    () => content.items.filter((item) => item.kind === "team").sort((a, b) => a.sortOrder - b.sortOrder),
    [content.items],
  );
  const testimonials = useMemo(() => {
    const saved = content.items
      .filter((item) => item.kind === "testimonial" && item.accent !== "rejected")
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return saved.length ? saved : fallbackTestimonials;
  }, [content.items]);

  const team = useMemo(() => {
    const placeholders: ContentItem[] = [
      {
        id: "team-direction", kind: "team", sortOrder: 80, title: "Creative direction", eyebrow: "Core team",
        body: "Ideas, narrative and visual direction.", mediaUrl: projects[2]?.mediaUrl || "/images/filmmaker.jpg",
        mediaAlt: "Mind Rhythm creative director", category: "Creative Director", year: "", href: settings.instagram, accent: "forest",
      },
      {
        id: "team-image", kind: "team", sortOrder: 90, title: "Image & motion", eyebrow: "Core team",
        body: "Cinematography, photography and movement.", mediaUrl: projects[1]?.mediaUrl || "/images/dance-study.jpg",
        mediaAlt: "Mind Rhythm image and motion collaborator", category: "Image & Motion", year: "", href: settings.linkedin, accent: "forest",
      },
      {
        id: "team-post", kind: "team", sortOrder: 100, title: "Design & post", eyebrow: "Core team",
        body: "Identity, edit, colour and finishing.", mediaUrl: projects[3]?.mediaUrl || "/images/green-object.jpg",
        mediaAlt: "Mind Rhythm design collaborator", category: "Design & Post", year: "", href: settings.instagram, accent: "forest",
      },
    ];
    return [...savedTeam, ...placeholders].slice(0, 3);
  }, [projects, savedTeam, settings.instagram, settings.linkedin]);

  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiryState, setEnquiryState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const contactEmail = settings.contactEmail === "hello@mindrythm.studio" ? "Admin@mindrythm.com" : settings.contactEmail;
  const phonePrimary = settings.phonePrimary || "+91 90735 73878";
  const phoneSecondary = settings.phoneSecondary || "+91 62923 33492";
  const address = settings.address || "250, Bansdroni, Rifle Club Playground, Kolkata - 700070";

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - startedAt) / 1750) * 100));
      setProgress(next);
      if (next < 100) frame = window.requestAnimationFrame(tick);
      else window.setTimeout(() => setLoaded(true), 380);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (heroItems.length < 2) return;
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroItems.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [heroItems.length]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.1 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedItem) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelectedItem(null);
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", close);
    };
  }, [selectedItem]);

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnquiryState("sending");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    if (response.ok) {
      setEnquiryState("sent");
      event.currentTarget.reset();
    } else {
      setEnquiryState("error");
    }
  }

  const spaces = galleryItems.filter((item) => item.category.toLowerCase() === "spaces");
  const moments = galleryItems.filter((item) => item.category.toLowerCase() === "moments");
  const spacesItems = spaces.length ? spaces : galleryItems.filter((_, index) => index % 2 === 0);
  const momentsItems = moments.length ? moments : galleryItems.filter((_, index) => index % 2 === 1);

  return (
    <>
      <div className={`preloader ${loaded ? "preloader-done" : ""}`} aria-hidden={loaded}>
        <img className="loader-logo" src="/mindrythm-logomark.png" alt="" />
        <div className="loader-name"><span>MIND</span><em>RHYTHM</em></div>
        <div className="loader-caption">Independent image-making studio</div>
        <div className="preloader-progress">{String(progress).padStart(3, "0")}</div>
        <div className="preloader-line"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div className={`site-shell ${loaded ? "site-ready" : ""}`}>
        <header className="site-header">
          <a className="wordmark" href="#home" aria-label="Mind Rhythm home">
            <img src="/mindrythm-logomark.png" alt="" />
            <span>MIND <em>RHYTHM</em></span>
          </a>
          <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
            <Link href="/work" onClick={() => setMenuOpen(false)}>Our Work</Link>
            <Link href="/gallery" onClick={() => setMenuOpen(false)}>Stories</Link>
            <Link href="/team" onClick={() => setMenuOpen(false)}>Team</Link>
            <Link href="/story" onClick={() => setMenuOpen(false)}>Our Story</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Connect</Link>
          </nav>
          <Link className="header-contact" href="/contact">Start a project ↗</Link>
          <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? "Close" : "Menu"}
          </button>
        </header>

        <main>
          <section className="hero" id="home" aria-labelledby="hero-title">
            <div className="hero-slides" aria-hidden="true">
              {heroItems.map((item, index) => (
                <div className={`hero-slide ${index === heroIndex ? "active" : ""}`} key={item.id}>
                  <Media item={item} />
                </div>
              ))}
            </div>
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-kicker"><span>Image / Motion / Identity</span><span>Kolkata / Everywhere</span></div>
              <div className="hero-title-row">
                <div className="hero-emblem"><img src="/mindrythm-logomark.png" alt="Mind Rhythm logomark" /></div>
                <h1 id="hero-title">Images with<br />a <em>pulse.</em></h1>
              </div>
              <div className="hero-lower">
                <p>{settings.description}</p>
                <a href="#vision">Discover Mind Rhythm <span>↓</span></a>
              </div>
            </div>
            <div className="hero-pagination" aria-label="Hero slideshow">
              <span>{String(heroIndex + 1).padStart(2, "0")} / {String(heroItems.length).padStart(2, "0")}</span>
              <div>{heroItems.map((item, index) => <button type="button" key={item.id} className={index === heroIndex ? "active" : ""} aria-label={`Show slide ${index + 1}`} onClick={() => setHeroIndex(index)} />)}</div>
            </div>
          </section>

          <section className="vision-section" id="vision">
            <span className="section-index" data-reveal>01 / Our vision</span>
            <p data-reveal>{settings.vision}</p>
            <div className="vision-note" data-reveal><span>How we see it</span><p>Thoughtful images can slow people down, draw them closer and continue to resonate after the screen goes dark.</p></div>
          </section>

          <section className="work-section" id="projects">
            <div className="section-intro" data-reveal>
              <span className="section-index">02 / Projects</span>
              <h2>Selected work,<br /><em>made to stay.</em></h2>
              <p>{settings.idea}</p>
            </div>
            <div className="projects-bento">
              {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={() => setSelectedItem(project)} />)}
              <article className="project-tile project-statement" data-reveal>
                <span>Our approach</span>
                <blockquote>“Every project begins with listening closely enough to find its own visual rhythm.”</blockquote>
                <div className="pulse-glyph" aria-hidden="true"><i /><i /><i /></div>
              </article>
              <article className="project-tile project-process" data-reveal>
                <span>Method / Collaborative</span>
                <h3>Listen.<br /><em>Distill.</em><br />Make it move.</h3>
                <p>Direction without noise. Craft without decoration.</p>
              </article>
              <article className="project-tile project-metric" data-reveal>
                <div className="metric-ring"><strong>∞</strong></div>
                <h3>One idea.<br />Many forms.</h3>
                <p>Film / Image / Identity / Experience</p>
              </article>
            </div>
          </section>

          <section className="gallery-section" id="gallery">
            <div className="gallery-heading" data-reveal>
              <span>03 / Gallery</span>
              <h2>Spaces &amp;<br /><em>moments.</em></h2>
              <div className="gallery-heading-copy">
                <p>A living mix of photographs, motion fragments and observations from the studio.</p>
                <div className="gallery-socials">
                  <a href={settings.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
                  <a href={settings.facebook} target="_blank" rel="noreferrer">Facebook ↗</a>
                  <a href={settings.youtube} target="_blank" rel="noreferrer">YouTube ↗</a>
                </div>
              </div>
            </div>
            <div className="gallery-scroll" aria-label="Spaces and moments galleries">
              <GalleryCollection title="Spaces" index="01" items={spacesItems.length ? spacesItems : galleryItems} onOpen={setSelectedItem} />
              <GalleryCollection title="Moments" index="02" items={momentsItems.length ? momentsItems : galleryItems} onOpen={setSelectedItem} />
            </div>
            <div className="gallery-scroll-note"><span>Scroll sideways</span><span>Spaces → Moments</span></div>
          </section>

          <section className="testimonials-section" id="testimonials">
            <div className="testimonials-heading" data-reveal>
              <span>04 / Testimonials</span>
              <h2>Words from<br /><em>our collaborators.</em></h2>
              <div className="testimonial-source"><span>Curated Google reviews</span><a href="https://www.google.com/search?q=Mind+Rhythm+Kolkata+reviews" target="_blank" rel="noreferrer">Read on Google ↗</a></div>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((item, index) => (
                <article className="testimonial-card" data-reveal key={item.id}>
                  <div className="review-stars" aria-label={`${item.year || "5.0"} out of 5 stars`}>★★★★★</div>
                  <blockquote>“{item.body}”</blockquote>
                  <div><strong>{item.title}</strong><span>{item.eyebrow || item.category}</span></div>
                  <span className="testimonial-number">0{index + 1}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="team-section" id="team">
            <div className="team-heading" data-reveal>
              <span>05 / Our team</span>
              <h2>The right minds<br />for <em>every story.</em></h2>
              <p>A small, shape-shifting collective of directors, image-makers, designers and post artists.</p>
            </div>
            <div className="team-grid">
              {team.map((member, index) => (
                <button type="button" className="team-card" key={`${member.id}-${index}`} onClick={() => setSelectedItem(member)} data-reveal>
                  <Media item={member} />
                  <div className="team-card-copy"><span>{member.category || member.eyebrow}</span><h3>{member.title}</h3><b>View profile ↗</b></div>
                </button>
              ))}
            </div>
          </section>

          <section className="about-section" id="about">
            <div className="about-heading" data-reveal>
              <span>06 / About us</span>
              <h2>Mind Rhythm is where<br />clarity meets <em>instinct.</em></h2>
            </div>
            <div className="about-grid">
              <article data-reveal><span>01</span><h3>What is Mind Rhythm?</h3><p>{settings.description}</p></article>
              <article data-reveal><span>02</span><h3>What we do</h3><p>Moving image, photography, visual identity, direction and post-production—shaped as one coherent visual world.</p></article>
              <article data-reveal><span>03</span><h3>Who we work with</h3><p>Brands, artists, institutions and independent voices looking for work with atmosphere, precision and emotional recall.</p></article>
              <article data-reveal><span>04</span><h3>How we work</h3><p>We assemble the right collaborators around each story, keeping the process open, focused and responsive from first thought to final frame.</p></article>
            </div>
          </section>

          <section className="contact-section" id="contact">
            <div className="contact-heading" data-reveal>
              <span>07 / Reach out</span>
              <h2>Let’s make<br />something that <em>moves.</em></h2>
            </div>
            <div className="contact-layout">
              <div className="contact-details" data-reveal>
                <div><span>Call</span><a href={`tel:${phonePrimary.replace(/\s/g, "")}`}>{phonePrimary}</a><a href={`tel:${phoneSecondary.replace(/\s/g, "")}`}>{phoneSecondary}</a></div>
                <div><span>Email</span><a href={`mailto:${contactEmail}`}>{contactEmail}</a></div>
                <div><span>Visit</span><p>{address}</p></div>
                <div className="contact-socials"><a href={settings.instagram}>Instagram ↗</a><a href={settings.facebook}>Facebook ↗</a><a href={settings.youtube}>YouTube ↗</a></div>
              </div>
              <form className="enquiry-form" onSubmit={submitEnquiry} data-reveal>
                <div className="form-field"><label htmlFor="name">Full name *</label><input id="name" name="name" required autoComplete="name" /></div>
                <div className="form-field"><label htmlFor="phone">Phone number *</label><input id="phone" name="phone" required type="tel" autoComplete="tel" /></div>
                <div className="form-field"><label htmlFor="email">Email ID</label><input id="email" name="email" type="email" autoComplete="email" /></div>
                <div className="form-field form-field-wide"><label htmlFor="query">Your query *</label><textarea id="query" name="query" required maxLength={1000} rows={6} /></div>
                <button type="submit" disabled={enquiryState === "sending"}>{enquiryState === "sending" ? "Sending…" : "Send enquiry"} <span>↗</span></button>
                <p className={`form-message ${enquiryState}`}>{enquiryState === "sent" ? "Thank you. Your enquiry has been received." : enquiryState === "error" ? `Please email us directly at ${contactEmail}.` : "Your message will be saved securely in the studio dashboard."}</p>
              </form>
            </div>
            <div className="map-frame" data-reveal>
              <iframe title="Mind Rhythm studio location" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} />
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="footer-brand"><img src="/mindrythm-logomark.png" alt="Mind Rhythm logomark" /><span>MIND <em>RHYTHM</em></span></div>
          <div className="footer-links"><a href={settings.instagram}>Instagram ↗</a><a href={settings.facebook}>Facebook ↗</a><a href={settings.youtube}>YouTube ↗</a></div>
          <div className="footer-meta"><span>© {new Date().getFullYear()} Mind Rhythm</span><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms of use</Link><Link href="/studio">Content studio ↗</Link></div>
        </footer>
      </div>

      {selectedItem && (
        <div className="project-modal" role="dialog" aria-modal="true" aria-label={selectedItem.title}>
          <button type="button" className="modal-close" onClick={() => setSelectedItem(null)}>Close ×</button>
          <div className="modal-media"><Media item={selectedItem} /></div>
          <div className="modal-copy">
            <span>{selectedItem.eyebrow} {selectedItem.year && `/ ${selectedItem.year}`}</span>
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.body}</p>
            {selectedItem.kind === "team" && <div className="modal-socials"><a href={selectedItem.href || settings.instagram}>Instagram ↗</a><a href={settings.linkedin}>LinkedIn ↗</a></div>}
            {selectedItem.kind === "project" && (
              <div className="modal-related">
                {galleryItems.slice(0, 3).map((item) => <div key={item.id}><Media item={item} /></div>)}
              </div>
            )}
            <div className="modal-footer"><span>{selectedItem.category}</span><span>Mind Rhythm Studio</span></div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectCard({ project, index, onOpen }: { project: ContentItem; index: number; onOpen: () => void }) {
  return (
    <button type="button" className={`project-tile project-card project-${(index % 6) + 1}`} onClick={onOpen} data-reveal>
      <Media item={project} /><div className="media-shade" />
      <span className="card-number">{String(index + 1).padStart(2, "0")} / {project.category}</span>
      <div className="project-title"><span>{project.eyebrow}</span><h3>{project.title}</h3><p>{project.body}</p></div>
      <span className="project-arrow">↗</span>
    </button>
  );
}

function GalleryCollection({ title, index, items, onOpen }: { title: string; index: string; items: ContentItem[]; onOpen: (item: ContentItem) => void }) {
  const shown = items.length ? items.slice(0, 4) : [];
  return (
    <article className="gallery-board" data-reveal>
      <header><span>{index}</span><h3>{title}</h3><p>Images / motion / fragments</p></header>
      <div className="gallery-board-grid">
        {shown.map((item, itemIndex) => (
          <button type="button" className={`gallery-card gallery-slot-${itemIndex + 1}`} key={item.id} onClick={() => onOpen(item)}>
            <Media item={item} /><span>{item.title}</span>
          </button>
        ))}
        <div className="gallery-card gallery-note"><span>Mind Rhythm archive</span><p>Looking closely is part of the work.</p></div>
      </div>
    </article>
  );
}

function Media({ item }: { item: ContentItem }) {
  const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(item.mediaUrl);
  if (isVideo) return <video src={item.mediaUrl} muted loop autoPlay playsInline aria-label={item.mediaAlt} />;
  return <img src={item.mediaUrl || "/images/tokyo-rain.jpg"} alt={item.mediaAlt || item.title} />;
}

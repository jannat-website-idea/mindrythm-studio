"use client";

import type { ContentItem, SiteContent } from "@/lib/content";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

const fallbackTestimonials: ContentItem[] = [
  {
    id: "review-one",
    kind: "testimonial",
    sortOrder: 10,
    title: "The celebration still feels alive in every frame.",
    eyebrow: "Wedding client",
    body: "Mind Rhythm captured the people, traditions and quiet emotions without making the day feel staged. The photographs and film feel completely like us.",
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
    title: "Beautiful coverage, handled with total clarity.",
    eyebrow: "Event partner",
    body: "From the run sheet to the final delivery, the process was calm, considered and focused on the moments that mattered to our guests and brand.",
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
        id: "team-direction", kind: "team", sortOrder: 80, title: "Property & commercial", eyebrow: "Core team",
        body: "Architecture, resort, real-estate and brand photography.", mediaUrl: "/images/filmmaker.jpg",
        mediaAlt: "Mind Rhythm lead photographer", category: "Lead Photographer", year: "", href: settings.instagram, accent: "forest",
      },
      {
        id: "team-image", kind: "team", sortOrder: 90, title: "Events & celebrations", eyebrow: "Core team",
        body: "Candid photography, portraits, rituals and live moments.", mediaUrl: projects[1]?.mediaUrl || "/images/wedding-celebration.jpg",
        mediaAlt: "Mind Rhythm event and wedding photographer", category: "Event Photographer", year: "", href: settings.linkedin, accent: "forest",
      },
      {
        id: "team-post", kind: "team", sortOrder: 100, title: "Aerial film & post", eyebrow: "Core team",
        body: "Wedding films, event aftermovies, drone capture, edit and colour.", mediaUrl: projects[2]?.mediaUrl || "/videos/event-film.mp4",
        mediaAlt: "Mind Rhythm aerial film specialist", category: "Film & Post", year: "", href: settings.instagram, accent: "forest",
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
  const scrollCinemaRef = useRef<HTMLElement | null>(null);

  const contactEmail = settings.contactEmail === "hello@mindrythm.studio" ? "Admin@mindrythm.com" : settings.contactEmail;
  const phonePrimary = settings.phonePrimary || "+91 90735 73878";
  const phoneSecondary = settings.phoneSecondary || "+91 62923 33492";
  const address = settings.address || "250, Bansdroni, Rifle Club Playground, Kolkata - 700070";

  useEffect(() => {
    const startedAt = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 900 : 2800;
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(100, Math.round(((now - startedAt) / duration) * 100));
      setProgress(next);
      if (next < 100) frame = window.requestAnimationFrame(tick);
      else window.setTimeout(() => setLoaded(true), reducedMotion ? 80 : 560);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = loaded ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [loaded]);

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

  useEffect(() => {
    const section = scrollCinemaRef.current;
    if (!section) return;
    const update = () => {
      const track = section.querySelector<HTMLElement>(".scroll-cinema-track");
      if (!track || window.innerWidth <= 680) return;
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - section.offsetTop) / distance));
      const travel = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.setProperty("--scroll-x", `${-progress * travel}px`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnquiryState("sending");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.query = `Service: ${String(payload.service || "General enquiry")}\n\n${String(payload.query || "")}`;
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
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
        <div className="loader-topline">
          <span>Property / Events / Weddings</span>
          <span>Kolkata / Everywhere</span>
        </div>
        <div className="loader-stage">
          <div className="loader-copy">
            <span className="loader-caption">A photography and film studio for every kind of story</span>
            <div className="loader-echo" aria-hidden="true"><span>Mind Rhythm · Mind Rhythm · Mind Rhythm ·</span></div>
            <div className="loader-brand" aria-label="Mind Rhythm">
              <span className="loader-brand-line"><i>M</i><i>I</i><i>N</i><i>D</i></span>
              <span className="loader-brand-line"><i>R</i><i>H</i><i>Y</i><i>T</i><i>H</i><i>M</i></span>
            </div>
            <div className="loader-sequence" aria-hidden="true">
              <span>We listen.</span>
              <span>We capture.</span>
              <span>We remember.</span>
            </div>
            <p><b aria-hidden="true" /> Stories with a pulse</p>
          </div>
        </div>
        <div className="loader-footer">
          <span>Preparing the visual stories</span>
          <span className="preloader-progress">{String(progress).padStart(3, "0")}%</span>
        </div>
        <div className="preloader-line"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div className={`site-shell ${loaded ? "site-ready" : ""}`}>
        <header className="site-header">
          <a className="wordmark" href="#home" aria-label="Mind Rhythm home">
            <img src="/mindrythm-logomark.png" alt="" />
            <span>MIND <em>RHYTHM</em></span>
          </a>
          <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="/work" onClick={() => setMenuOpen(false)}>Our Work</a>
            <a href="/gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
            <a href="/team" onClick={() => setMenuOpen(false)}>Our Team</a>
          </nav>
          <a className="header-contact" href="/contact">Enquire now ↗</a>
          <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? "Close" : "Menu"}
          </button>
        </header>

        <main>
          <section className="hero" id="home" aria-labelledby="hero-title">
            <a className="hero-slides" href="/work" aria-label="Explore Mind Rhythm projects">
              {heroItems.map((item, index) => (
                <div className={`hero-slide ${index === heroIndex ? "active" : ""}`} key={item.id}>
                  <Media item={item} />
                </div>
              ))}
            </a>
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-kicker"><a href="/gallery">Stories with a pulse®</a><a href="#services">Property / Events / Weddings</a><a href="/contact">Kolkata / Everywhere</a></div>
              <div className="hero-title-row">
                <h1 id="hero-title">
                  <a href="/work" aria-label="Explore our work">
                    <span className="hero-title-line"><span>Every story</span></span>
                    <span className="hero-title-line"><span>has a <em>rhythm.</em></span></span>
                  </a>
                </h1>
                <a className="hero-emblem" href="#services"><img src="/mindrythm-logomark.png" alt="Mind Rhythm logomark" /><span>Photography &amp; film studio</span></a>
              </div>
              <div className="hero-lower">
                <p>{settings.description}</p>
                <a href="#services">Explore our services <span>↓</span></a>
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
            <div className="vision-note" data-reveal><span>How we see it</span><p>Thoughtful imagery can make a destination feel real, let an event live longer and return a couple to how their wedding day truly felt.</p></div>
          </section>

          <section className="capabilities-band" id="services" aria-label="Mind Rhythm services">
            <span data-reveal>02 / Our services</span>
            <div>
              <a href="/contact" data-reveal><b>01</b><strong>Property photography</strong><span>Real estate, architecture and interior imagery for listings and campaigns.</span><i>↗</i></a>
              <a href="/contact" data-reveal><b>02</b><strong>Resort &amp; hospitality</strong><span>Photography, walkthrough films and social content that sell the stay.</span><i>↗</i></a>
              <a href="/contact" data-reveal><b>03</b><strong>Event photography</strong><span>Corporate, cultural and private events covered with clarity and energy.</span><i>↗</i></a>
              <a href="/contact" data-reveal><b>04</b><strong>Event films</strong><span>Highlights, aftermovies, interviews and fast social-first edits.</span><i>↗</i></a>
              <a href="/contact" data-reveal><b>05</b><strong>Wedding photography</strong><span>Candid emotion, portraits, rituals and every detail that makes the day yours.</span><i>↗</i></a>
              <a href="/contact" data-reveal><b>06</b><strong>Wedding &amp; pre-wedding films</strong><span>Cinematic films shaped around real people, movement and memory.</span><i>↗</i></a>
            </div>
          </section>

          <section className="scroll-cinema" ref={scrollCinemaRef} aria-label="A scroll-led view of Mind Rhythm">
            <div className="scroll-cinema-sticky">
              <div className="scroll-cinema-top"><span>Scroll through the visual portfolio</span><span>Selected stories / 2026</span></div>
              <div className="scroll-cinema-window">
                <div className="scroll-cinema-track">
                  {heroItems.slice(0, 3).map((item, index) => (
                    <button type="button" className="scroll-cinema-panel" key={`scroll-${item.id}`} onClick={() => setSelectedItem(item)} aria-label={`Open ${item.title}`}>
                      <Media item={item} />
                      <div><span>0{index + 1} / {item.category || "Selected frame"}</span><h2>{item.title}</h2><p>{item.eyebrow}</p></div>
                    </button>
                  ))}
                  <article className="scroll-cinema-panel scroll-cinema-statement">
                    <span>Mind Rhythm / Places &amp; people</span>
                    <h2>Stories that make time feel <em>different.</em></h2>
                    <p>Photography and film for spaces, celebrations and the moments people want to remember.</p>
                    <a href="/work">Explore all work ↗</a>
                  </article>
                </div>
              </div>
              <div className="scroll-cinema-progress"><span /><i>Keep scrolling →</i></div>
            </div>
          </section>

          <section className="work-section" id="projects">
            <div className="section-intro" data-reveal>
              <span className="section-index">03 / Our work</span>
              <h2>Selected stories,<br /><em>across every service.</em></h2>
              <p>{settings.idea}</p>
            </div>
            <div className="projects-bento">
              {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={() => setSelectedItem(project)} />)}
              <a className="project-tile project-statement" href="/story" data-reveal>
                <span>Our approach</span>
                <blockquote>“Every place and every celebration begins with a feeling. Our work is to make it visible.”</blockquote>
                <div className="pulse-glyph" aria-hidden="true"><i /><i /><i /></div>
              </a>
              <a className="project-tile project-process" href="#process" data-reveal>
                <span>Method / People first</span>
                <h3>Listen.<br /><em>Frame.</em><br />Remember.</h3>
                <p>Clear planning, deliberate composition and a calm production process.</p>
              </a>
              <a className="project-tile project-metric" href="/work" data-reveal>
                <div className="metric-ring"><strong>∞</strong></div>
                <h3>One studio.<br />Many stories.</h3>
                <p>Property / Events / Weddings / Film</p>
              </a>
            </div>
          </section>

          <section className="gallery-section" id="gallery">
            <div className="gallery-heading" data-reveal>
              <span>04 / Gallery</span>
              <h2>Spaces, people &amp;<br /><em>celebrations.</em></h2>
              <div className="gallery-heading-copy">
                <p>An immersive archive of properties, portraits, celebrations and moving moments from every side of the studio.</p>
                <div className="gallery-socials">
                  <a href={settings.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
                  <a href={settings.facebook} target="_blank" rel="noreferrer">Facebook ↗</a>
                  <a href={settings.youtube} target="_blank" rel="noreferrer">YouTube ↗</a>
                </div>
              </div>
            </div>
            <div className="gallery-scroll" aria-label="Spaces and celebrations galleries">
              <GalleryCollection title="Spaces" index="01" items={spacesItems.length ? spacesItems : galleryItems} onOpen={setSelectedItem} />
              <GalleryCollection title="Celebrations" index="02" items={momentsItems.length ? momentsItems : galleryItems} onOpen={setSelectedItem} />
            </div>
            <div className="gallery-scroll-note"><span>Scroll sideways</span><span>Spaces → Celebrations</span></div>
          </section>

          <section className="testimonials-section" id="testimonials">
            <div className="testimonials-heading" data-reveal>
              <span>05 / Testimonials</span>
              <h2>Words from<br /><em>our collaborators.</em></h2>
              <div className="testimonial-source"><span>Curated Google reviews</span><a href="https://www.google.com/search?q=Mind+Rhythm+Kolkata+reviews" target="_blank" rel="noreferrer">Read on Google ↗</a></div>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((item, index) => (
                <a className="testimonial-card" href="https://www.google.com/search?q=Mind+Rhythm+Kolkata+reviews" target="_blank" rel="noreferrer" data-reveal key={item.id}>
                  <div className="review-stars" aria-label={`${item.year || "5.0"} out of 5 stars`}>★★★★★</div>
                  <blockquote>“{item.body}”</blockquote>
                  <div><strong>{item.title}</strong><span>{item.eyebrow || item.category}</span></div>
                  <span className="testimonial-number">0{index + 1}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="team-section" id="team">
            <div className="team-heading" data-reveal>
              <span>06 / Meet the team</span>
              <h2>The right eye<br />for <em>every story.</em></h2>
              <div className="team-heading-action"><p>Property, event and wedding photographers, filmmakers, aerial operators and editors working as one focused team.</p><a href="/team">Meet our team ↗</a></div>
            </div>
            <div className="team-grid">
              {team.map((member, index) => (
                <button type="button" className="team-card" key={`${member.id}-${index}`} onClick={() => setSelectedItem(member)} data-reveal>
                  <Media item={member} />
                  <div className="team-card-copy"><span>{member.category || member.eyebrow}</span><h3>{member.title}</h3><b>View profile ↗</b></div>
                </button>
              ))}
            </div>
            <a className="team-page-link" href="/team"><span>People behind the images</span><strong>Explore the full team</strong><i>↗</i></a>
          </section>

          <section className="about-section" id="about">
            <div className="about-heading" data-reveal>
              <span>07 / About us</span>
              <h2>Mind Rhythm is where<br />moments become <em>memory.</em></h2>
            </div>
            <div className="about-grid">
              <a href="/story" data-reveal><span>01</span><h3>What is Mind Rhythm?</h3><p>{settings.description}</p><i>Read our story ↗</i></a>
              <a href="/work" data-reveal><span>02</span><h3>What we capture</h3><p>Properties, resorts, corporate events and weddings—through photography, cinematic film, aerial footage and social edits.</p><i>Explore our work ↗</i></a>
              <a href="/contact" data-reveal><span>03</span><h3>Who we work with</h3><p>Couples, families, event teams, developers, architects, resorts and brands looking for imagery with feeling and precision.</p><i>Work with us ↗</i></a>
              <a href="#process" data-reveal><span>04</span><h3>How we work</h3><p>We plan timing, light, shot lists and delivery around each brief, keeping the experience calm from first conversation to final files.</p><i>See the process ↓</i></a>
            </div>
          </section>

          <section className="process-section" id="process">
            <div className="process-heading" data-reveal>
              <span>08 / Our rhythm</span>
              <h2>From first conversation<br />to <em>final frame.</em></h2>
              <p>A clear process gives every place and milestone the time, light and attention it deserves.</p>
            </div>
            {heroItems[1] && <a className="process-film" href="/work" data-reveal><Media item={heroItems[1]} /><div><span>Brief / Plan / Capture</span><p>A calm production gives spaces, people and real emotion room to lead. <b>View our work ↗</b></p></div></a>}
            <div className="process-steps">
              <a href="/contact" data-reveal><span>01</span><h3>Discover</h3><p>We understand the place, people, audience and feeling the imagery needs to create.</p><i>Begin a brief ↗</i></a>
              <a href="/contact" data-reveal><span>02</span><h3>Plan</h3><p>We shape the schedule, locations, light, shot list and practical details before the day.</p><i>Begin a brief ↗</i></a>
              <a href="/contact" data-reveal><span>03</span><h3>Capture</h3><p>Photography, film and aerial sequences are composed as one coherent visual story.</p><i>Begin a brief ↗</i></a>
              <a href="/contact" data-reveal><span>04</span><h3>Deliver</h3><p>Every frame is edited and supplied for galleries, websites, campaigns, archives and social media.</p><i>Begin a brief ↗</i></a>
            </div>
          </section>

          <section className="contact-section" id="contact">
            <div className="contact-heading" data-reveal>
              <span>09 / Reach out</span>
              <h2>Let’s capture<br />your next <em>story.</em></h2>
            </div>
            <div className="contact-layout">
              <div className="contact-details" data-reveal>
                <div><span>Call</span><a href={`tel:${phonePrimary.replace(/\s/g, "")}`}>{phonePrimary}</a><a href={`tel:${phoneSecondary.replace(/\s/g, "")}`}>{phoneSecondary}</a></div>
                <div><span>Email</span><a href={`mailto:${contactEmail}`}>{contactEmail}</a></div>
                <div><span>Visit</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">{address} ↗</a></div>
                <div className="contact-socials"><a href={settings.instagram}>Instagram ↗</a><a href={settings.facebook}>Facebook ↗</a><a href={settings.youtube}>YouTube ↗</a></div>
              </div>
              <form className="enquiry-form" onSubmit={submitEnquiry} data-reveal>
                <div className="form-field"><label htmlFor="name">Full name *</label><input id="name" name="name" required autoComplete="name" /></div>
                <div className="form-field"><label htmlFor="phone">Phone number *</label><input id="phone" name="phone" required type="tel" autoComplete="tel" /></div>
                <div className="form-field"><label htmlFor="email">Email ID</label><input id="email" name="email" type="email" autoComplete="email" /></div>
                <div className="form-field"><label htmlFor="service">Service *</label><select id="service" name="service" required defaultValue=""><option value="" disabled>Select a service</option><option>Property photography</option><option>Resort &amp; hospitality</option><option>Event photography</option><option>Event film</option><option>Wedding photography</option><option>Wedding or pre-wedding film</option><option>Other</option></select></div>
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
          <div className="footer-cta"><span>Have a place, event or wedding in mind?</span><a href="/contact">Let’s make it unforgettable. <i>↗</i></a></div>
          <div className="footer-grid">
            <div className="footer-brand"><img src="/mindrythm-logomark.png" alt="Mind Rhythm logomark" /><span>MIND <em>RHYTHM</em></span></div>
            <div className="footer-column"><span>Explore</span><a href="#services">Services</a><a href="/work">Our Work</a><a href="/gallery">Gallery</a><a href="/team">Our Team</a></div>
            <div className="footer-column"><span>Follow</span><a href={settings.instagram}>Instagram ↗</a><a href={settings.facebook}>Facebook ↗</a><a href={settings.youtube}>YouTube ↗</a></div>
            <div className="footer-column"><span>Legal</span><a href="/privacy">Privacy Policy</a><a href="/terms">Terms &amp; Conditions</a><a href="/studio">Content Studio ↗</a></div>
          </div>
          <div className="footer-meta"><span>© {new Date().getFullYear()} Mind Rhythm</span><span>Kolkata / Everywhere</span><a href="#home">Back to top ↑</a></div>
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
        <a className="gallery-card gallery-note" href="/gallery"><span>Mind Rhythm archive</span><p>Looking closely is part of the work.</p><i>Open archive ↗</i></a>
      </div>
    </article>
  );
}

function Media({ item }: { item: ContentItem }) {
  const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(item.mediaUrl);
  if (isVideo) return <video src={item.mediaUrl} muted loop autoPlay playsInline preload="metadata" aria-label={item.mediaAlt} />;
  return <img src={item.mediaUrl || "/images/resort-exterior.jpg"} alt={item.mediaAlt || item.title} />;
}

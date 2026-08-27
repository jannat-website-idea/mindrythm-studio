"use client";

import {
  mainInstagramUrl as defaultInstagramUrl,
  type ContentItem,
  type SiteContent,
} from "@/lib/content";
import { BackToTop } from "@/app/back-to-top";
import { BentoGalleryGrid } from "@/app/bento-gallery";
import { EmphasizedCopy } from "@/app/emphasized-copy";
import { ImmersiveLightbox } from "@/app/immersive-lightbox";
import { Media } from "@/app/media";
import { SocialIcon } from "@/app/social-icon";
import { TeamMemberCard } from "@/app/team-member-card";
import { getServiceProjects } from "@/lib/services";
import { type CSSProperties, type FormEvent, type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";

const googleBusinessUrl = "https://www.google.com/search?kgmid=/g/11njpxjhwk&q=Mindrythm+Studios";

const navigationItems = [
  { label: "Home", href: "#home", note: "Begin here" },
  { label: "Services", href: "/services", note: "What we create" },
  { label: "Our Work", href: "/work", note: "Selected commissions" },
  { label: "Gallery", href: "/gallery", note: "Stories and moments" },
  { label: "Our Team", href: "/team", note: "The people behind it" },
  { label: "Our Story", href: "/story", note: "The studio rhythm" },
  { label: "Enquire", href: "/contact", note: "Start a conversation" },
] as const;

export function Experience({ content }: { content: SiteContent }) {
  const { settings } = content;
  const {brandTaglines, enquiryTaglines, teamIntroduction, visionParagraphs} = content.copy;
  const serviceItems = content.services;
  const mainInstagramUrl = settings.instagram || defaultInstagramUrl;
  const projects = useMemo(
    () => content.items.filter((item) => item.kind === "project").sort((a, b) => a.sortOrder - b.sortOrder),
    [content.items],
  );
  const heroItems = useMemo(() => {
    const featuredIds = content.hero.featuredProjectIds;
    const featured = featuredIds
      .map((id) => projects.find((project) => project.id === id))
      .filter((project): project is ContentItem => Boolean(project));
    return [...featured, ...projects.filter((project) => !featuredIds.includes(project.id))].slice(0, 3);
  }, [content.hero.featuredProjectIds, projects]);
  const serviceCollections = useMemo(
    () =>
      serviceItems.map((service, index) => {
        const directMedia = getServiceProjects(projects, service.key, serviceItems);
        if (directMedia.length) return { ...service, media: directMedia };
        const offset = (index * 2) % Math.max(1, projects.length);
        const fallback = [...projects.slice(offset), ...projects.slice(0, offset)].slice(0, 3);
        return { ...service, media: fallback.length ? fallback : projects.slice(0, 3) };
      }),
    [projects, serviceItems],
  );
  const galleryItems = useMemo(
    () => content.items.filter((item) => item.kind === "gallery").sort((a, b) => a.sortOrder - b.sortOrder),
    [content.items],
  );

  const gallerySpaces = useMemo(() => {
    const spaces = galleryItems.filter((item) =>
      item.category?.toLowerCase().includes("space") ||
      item.category?.toLowerCase().includes("interior") ||
      item.category?.toLowerCase().includes("landscape") ||
      item.category?.toLowerCase().includes("retreat") ||
      item.category?.toLowerCase().includes("hospitality") ||
      item.eyebrow?.toLowerCase().includes("space") ||
      item.eyebrow?.toLowerCase().includes("interior") ||
      item.eyebrow?.toLowerCase().includes("retreat")
    );
    return spaces.length ? spaces : galleryItems.slice(0, 7);
  }, [galleryItems]);



  const bentoProjects = useMemo(() => projects.slice(0, 6), [projects]);

  const savedTeam = useMemo(
    () => content.items.filter((item) => item.kind === "team").sort((a, b) => a.sortOrder - b.sortOrder),
    [content.items],
  );
  const testimonials = useMemo(
    () => content.items
      .filter((item) => item.kind === "testimonial" && item.accent !== "rejected")
      .sort((a, b) => a.sortOrder - b.sortOrder),
    [content.items],
  );

  const team = savedTeam;

  const [loaded, setLoaded] = useState(false);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sectionNavVisible, setSectionNavVisible] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");
  const [activeTeamCardId, setActiveTeamCardId] = useState<string | null>(null);
  const [activeService, setActiveService] = useState(0);
  const [enquiryState, setEnquiryState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const heroRef = useRef<HTMLElement | null>(null);
  const scrollCinemaRef = useRef<HTMLElement | null>(null);
  const enquiryStartedAtRef = useRef(0);

  useEffect(() => {
    enquiryStartedAtRef.current = Date.now();
  }, []);

  const contactEmail = settings.contactEmail === "hello@mindrythm.studio" ? "Admin@mindrythm.com" : settings.contactEmail;
  const phonePrimary = settings.phonePrimary || "+91 90735 73878";
  const phoneSecondary = settings.phoneSecondary || "+91 62923 33492";
  const address = settings.address || "250, Bansdroni, Rifle Club Playground, Kolkata - 700070";

  function returnToHero(event: ReactMouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    try {
      window.sessionStorage.setItem("mindrythmSkipIntro", "1");
      window.sessionStorage.setItem("mindrythmSeenIntro", "1");
    } catch {}
    setMenuOpen(false);
    setActiveHash("#home");
    setSectionNavVisible(false);
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
  }

  useEffect(() => {
    let hasSeen = false;
    try {
      hasSeen = window.sessionStorage.getItem("mindrythmSkipIntro") === "1" ||
                window.sessionStorage.getItem("mindrythmSeenIntro") === "1" ||
                Boolean(window.location.hash && window.location.hash !== "#home");
    } catch {}

    if (hasSeen) {
      try {
        window.sessionStorage.setItem("mindrythmSeenIntro", "1");
        window.sessionStorage.removeItem("mindrythmSkipIntro");
      } catch {}
      setLoaderProgress(100);
      setLoaded(true);
      setShowLoader(false);
      return;
    }

    const startedAt = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimumDuration = reducedMotion ? 520 : 5200;
    const exitDuration = reducedMotion ? 280 : 1650;
    let frame = 0;
    let revealTimer = 0;
    let exitTimer = 0;
    let cleanupTimer = 0;
    let pageReady = document.readyState === "complete";
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        window.sessionStorage.setItem("mindrythmSeenIntro", "1");
      } catch {}
      window.cancelAnimationFrame(frame);
      setLoaderProgress(100);
      revealTimer = window.setTimeout(() => {
        setLoaded(true);
      }, reducedMotion ? 0 : 240);
      exitTimer = window.setTimeout(() => {
        setLoaderExiting(true);
        cleanupTimer = window.setTimeout(() => setShowLoader(false), exitDuration);
      }, reducedMotion ? 20 : 460);
    };

    const markPageReady = () => {
      pageReady = true;
      if (performance.now() - startedAt >= minimumDuration) finish();
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const timedProgress = Math.min(elapsed / minimumDuration, 1);
      const visibleProgress = pageReady ? timedProgress * 100 : Math.min(timedProgress * 94, 94);
      setLoaderProgress(Math.round(visibleProgress));
      if (elapsed >= minimumDuration && pageReady) return finish();
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("load", markPageReady, { once: true });
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(revealTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(cleanupTimer);
      window.removeEventListener("load", markPageReady);
    };
  }, []);

  useEffect(() => {
    const overflow = loaded ? "" : "hidden";
    document.documentElement.style.overflow = overflow;
    document.body.style.overflow = overflow;
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [loaded]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.body.classList.add("menu-open");
    window.addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const syncLocation = () => {
      const hash = window.location.hash || "#home";
      setActiveHash(hash);
      if (hash !== "#home") setSectionNavVisible(true);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!window.location.hash || window.location.hash === "#home") setSectionNavVisible(!entry.isIntersecting);
    }, { threshold: 0.08 });
    observer.observe(hero);
    syncLocation();
    window.addEventListener("hashchange", syncLocation);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncLocation);
    };
  }, []);

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
    const track = section.querySelector<HTMLElement>(".scroll-cinema-track");
    if (!track) return;

    let frame = 0;
    let sectionTop = 0;
    let distance = 0;
    let travel = 0;

    const updatePosition = () => {
      if (distance <= 0) return;
      const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / distance));
      section.style.setProperty("--scroll-x", `${-progress * travel}px`);
    };

    const measure = () => {
      if (window.innerWidth <= 680) {
        distance = 0;
        section.style.setProperty("--scroll-x", "0px");
        return;
      }
      sectionTop = section.offsetTop;
      distance = Math.max(1, section.offsetHeight - window.innerHeight);
      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      updatePosition();
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updatePosition();
      });
    };

    measure();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollY = 0;
    const paint = () => {
      hero.style.setProperty("--hero-pointer-x", `${pointerX.toFixed(2)}px`);
      hero.style.setProperty("--hero-pointer-y", `${pointerY.toFixed(2)}px`);
      hero.style.setProperty("--hero-scroll-y", `${scrollY.toFixed(2)}px`);
      frame = 0;
    };
    const queuePaint = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
      queuePaint();
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
      queuePaint();
    };
    const scroll = () => {
      scrollY = Math.min(58, Math.max(0, window.scrollY * 0.065));
      queuePaint();
    };

    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", scroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnquiryState("sending");
    const formElement = event.currentTarget;
    try {
      const form = new FormData(formElement);
      const payload = {...Object.fromEntries(form.entries()), startedAt: enquiryStartedAtRef.current};
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Enquiry delivery failed");
      setEnquiryState("sent");
      formElement.reset();
      enquiryStartedAtRef.current = Date.now();
    } catch {
      setEnquiryState("error");
    }
  }

  const spaces = galleryItems.filter((item) => item.category.toLowerCase() === "spaces");
  const moments = galleryItems.filter((item) => item.category.toLowerCase() === "moments");
  const spacesItems = spaces.length ? spaces : galleryItems.filter((_, index) => index % 2 === 0);
  const momentsItems = moments.length ? moments : galleryItems.filter((_, index) => index % 2 === 1);
  const spacesBentoItems = [...spacesItems, ...galleryItems.filter((item) => !spacesItems.some((space) => space.id === item.id))];
  const momentsBentoItems = [...momentsItems, ...galleryItems.filter((item) => !momentsItems.some((moment) => moment.id === item.id))];
  return (
    <>
      {showLoader && <div className={`preloader reference-loader ${loaderExiting ? "preloader-done" : ""}`} role="img" aria-label="Mindrythm studio">
        <div className="loader-reference-lockup">
          <span className="loader-reference-name" aria-hidden="true">
            {Array.from("MINDRYTHM").map((letter, index) => <i key={`${letter}-${index}`} style={{ "--loader-letter": index } as CSSProperties}><b>{letter}</b></i>)}
          </span>
          <span className="loader-reference-studio" aria-hidden="true">
            {Array.from("STUDIO").map((letter, index) => <i key={`${letter}-${index}`} style={{ "--loader-letter": index } as CSSProperties}><b>{letter}</b></i>)}
          </span>
        </div>
        <div className="loader-reference-footer" aria-hidden="true">
          <span>visual production agency</span>
          <span className="loader-reference-count">{loaderProgress}<sup>%</sup></span>
        </div>
        <div className="loader-reference-progress" aria-hidden="true"><span style={{ transform: `scaleX(${loaderProgress / 100})` }} /></div>
      </div>}

      <header className={`site-header home-header ${loaded ? "site-ready" : "site-loading"} ${sectionNavVisible ? "section-nav-visible" : ""} ${menuOpen ? "menu-active" : ""}`}>
          <a className="wordmark home-wordmark" href="#home" aria-label="Mindrythm home" onClick={returnToHero}>
            <img src="/mindrythm-logomark.png" alt="" />
            <span>Mindrythm</span>
          </a>
          <nav className={`header-section-nav ${sectionNavVisible ? "is-visible" : ""}`} aria-label="Section navigation">
            {navigationItems.map((item) => (
              <a
                className={activeHash === item.href ? "active" : ""}
                href={item.href}
                key={item.label}
                onClick={(event) => {
                  if (item.href === "#home") {
                    returnToHero(event);
                    return;
                  }
                  setActiveHash(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>
            <span className="menu-toggle-label">{menuOpen ? "Close" : "Menu"}</span>
          </button>
      </header>

      <div className={`menu-overlay ${menuOpen ? "is-open nav-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="menu-overlay-panel">
          <div className="menu-overlay-header">
            <span className="menu-overlay-title">Navigation</span>
            <button type="button" className="menu-overlay-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              ✕ Close
            </button>
          </div>
          <nav className="menu-overlay-links" aria-label="Main menu">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="menu-overlay-link"
                onClick={(e) => {
                  if (item.href === "#home") {
                    returnToHero(e);
                  }
                  setMenuOpen(false);
                }}
              >
                <span>{item.label}</span>
                <small>{item.note}</small>
              </a>
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

      <div className={`site-shell ${loaded ? "site-ready" : ""}`}>
        <main>
          <section className="hero" id="home" aria-labelledby="hero-title" ref={heroRef}>
            <a className="hero-slides" href="/work" aria-label="Explore Mindrythm projects">
              {heroItems.map((item, index) => (
                <div className={`hero-slide ${index === heroIndex ? "active" : ""}`} key={item.id}>
                  <Media item={item} priority={index === heroIndex} active={index === heroIndex} />
                </div>
              ))}
            </a>
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-title-row">
                <h1 id="hero-title">
                  <a href="/work" aria-label="Explore our work">
                    <span className="hero-title-line"><span>{content.hero.titleLineOne}</span></span>
                    <span className="hero-title-line"><span>{content.hero.titleLineTwo}</span></span>
                  </a>
                </h1>
              </div>
            </div>
          </section>

          <section className="vision-section" id="vision">
            <span className="section-index" data-reveal>Our vision</span>
            <p className="vision-statement" data-reveal>
              {content.hero.visionHighlights.map((line) => <span key={line}>“{line}”</span>)}
            </p>
            <details className="vision-note" data-reveal>
              <summary><span>Where we begin</span><i>Read the thought +</i></summary>
              <p>{visionParagraphs[0]}</p>
            </details>
            <div className="vision-bridge" data-reveal>
              <a href="/work" className="vision-bridge-frame">
                <img src="/images/tropical-interior.jpg" alt="Natural reception area photographed by Mindrythm" />
                <span>Gallery / Hospitality</span>
              </a>
              <a href="/story" className="vision-bridge-centre">
                <img src="/mindrythm-logomark.png" alt="" />
                <span>One studio</span>
                <strong>Many ways of seeing.</strong>
                <i>Our story</i>
              </a>
              <a href="/work" className="vision-bridge-frame vision-bridge-frame-last">
                <img src="/images/wedding-celebration.jpg" alt="Bengali wedding couple photographed by Mindrythm" />
                <span>People / Celebrations</span>
              </a>
            </div>
          </section>

          <section className="services-experience" id="services" aria-label="Mindrythm services">
            <header data-reveal>
              <span>Our services</span>
              <h2>One studio.<br />Many visual languages.</h2>
              <p>“{brandTaglines[0]}”</p>
            </header>
            <div className="services-editorial-split" data-reveal>
              <div className="services-index-column">
                <div className="services-index-list" role="tablist" aria-label="Services list">
                  {serviceItems.map((service, index) => {
                    const isActive = activeService === index;
                    return (
                      <div
                        key={service.key || service.title}
                        className={`services-index-row ${isActive ? "is-active" : ""}`}
                      >
                        <a
                          href={`/services#service-${service.key}`}
                          className="services-row-header"
                          onMouseEnter={() => setActiveService(index)}
                          onFocus={() => setActiveService(index)}
                        >
                          <span className="services-row-title">{service.title}</span>
                          <span className="services-row-arrow" aria-hidden="true">→</span>
                        </a>
                        {isActive && (
                          <div className="services-row-expanded">
                            <p className="services-row-description">{service.copy}</p>
                            <div className="services-row-actions">
                              <a className="services-row-link" href={`/services#service-${service.key}`}>
                                <span>See all {service.title}</span>
                                <span aria-hidden="true">→</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="services-canvas-column" aria-live="polite">
                <div className="services-canvas-box">
                  {serviceCollections.map((service, index) => {
                    const isActive = activeService === index;
                    const mainMedia = service.media[0] || projects[0];
                    const secondaryMedia = service.media[1];
                    return (
                      <a
                        key={service.key}
                        href={`/services#service-${service.key}`}
                        className={`services-canvas-item ${isActive ? "is-active" : ""}`}
                        aria-hidden={!isActive}
                        aria-label={`View ${service.title} photos on services page`}
                      >
                        <div className="services-canvas-media-wrap">
                          {mainMedia && (
                            <div className="services-media-primary">
                              <Media item={mainMedia} priority={isActive} active={isActive} />
                            </div>
                          )}
                          {secondaryMedia && (
                            <div className="services-media-secondary">
                              <Media item={secondaryMedia} active={isActive} />
                            </div>
                          )}
                          <div className="services-media-vignette" />
                        </div>

                        <div className="services-canvas-bar">
                          <div className="services-bar-info">
                            <span className="services-bar-name">{service.title}</span>
                          </div>
                          <span className="services-bar-cta">
                            <span>View photos &amp; details</span>
                            <span aria-hidden="true" className="services-bar-arrow">→</span>
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <aside className="story-whisper" data-reveal><span>Our point of view</span><p>“{brandTaglines[1]}”</p></aside>

          <section className="scroll-cinema" ref={scrollCinemaRef} aria-label="A scroll-led view of Mindrythm">
            <div className="scroll-cinema-sticky">
              <div className="scroll-cinema-top"><span>Scroll through the visual portfolio</span><span>Selected stories / 2026</span></div>
              <div className="scroll-cinema-window">
                <div className="scroll-cinema-track">
                  {heroItems.slice(0, 3).map((item) => (
                    <button type="button" className="scroll-cinema-panel" key={`scroll-${item.id}`} onClick={() => setSelectedItem(item)} aria-label={`Open ${item.title}`}>
                      <Media item={item} />
                      <div><span>{item.category || "Selected frame"}</span><h2>{item.title}</h2><p>{item.eyebrow}</p></div>
                    </button>
                  ))}
                  <article className="scroll-cinema-panel scroll-cinema-statement">
                    <span>Mindrythm / Places &amp; people</span>
                    <h2>Stories that make time feel different.</h2>
                    <p>“{brandTaglines[2]}”</p>
                    <a href="/work">Explore all work</a>
                  </article>
                </div>
              </div>
              <div className="scroll-cinema-progress"><span /><i>Keep scrolling</i></div>
            </div>
          </section>

          <section className="work-section" id="projects">
            <div className="section-intro" data-reveal>
              <span className="section-index">Our work</span>
              <h2>Selected stories,<br /><em>across every service.</em></h2>
              <p>“{brandTaglines[2]}”</p>
            </div>
            <div className="projects-bento">
              {bentoProjects.map((project, index) => <ProjectCard key={`${project.id}-bento-${index}`} project={project} index={index} onOpen={() => setSelectedItem(project)} />)}
              <a className="project-tile project-statement" href="/story" data-reveal>
                <span>Our approach</span>
                <blockquote>“Every place and every celebration begins with a feeling. Our work is to make it visible.”</blockquote>
                <div className="pulse-glyph" aria-hidden="true"><i /><i /><i /></div>
              </a>
              <a className="project-tile project-process" href="#process" data-reveal>
                <span>Method / People first</span>
                <h3><span>Listen.</span><em>Frame.</em><span>Remember.</span></h3>
                <p>Clear planning, deliberate composition and a calm production process.</p>
              </a>
              <a className="project-tile project-metric" href="/work" data-reveal>
                <div className="metric-ring"><strong>∞</strong></div>
                <h3>One studio.<br />Many stories.</h3>
                <p>Property / Events / Weddings / Film</p>
              </a>
            </div>
          </section>

          <section className="gallery-section-root" id="gallery">
            <div className="gallery-section-container" id="gallery-spaces">
              <header className="gallery-section-header" data-reveal>
                <h2>Gallery</h2>
              </header>
              <BentoGalleryGrid
                items={gallerySpaces}
                editorialText="SPACES SHAPED BY LIGHT, MATERIAL AND A SENSE OF ARRIVAL."
                onOpen={setSelectedItem}
                showSocialCard
                socialLinks={{ instagram: mainInstagramUrl, facebook: settings.facebook, youtube: settings.youtube }}
              />
            </div>
          </section>

          <aside className="story-whisper story-whisper-light" data-reveal><span>Our point of view</span><p>“{brandTaglines[3]}”</p></aside>

          <section className="testimonials-section" id="testimonials">
            <div className="testimonials-heading" data-reveal>
              <h2>Testimonial</h2>
              <div className="testimonial-source"><span>Mindrythm on Google</span><a href={googleBusinessUrl} target="_blank" rel="noreferrer">Read all reviews on Google</a></div>
            </div>
            <div className={`testimonials-scroll ${testimonials.length <= 2 ? "testimonials-scroll--compact" : ""}`} role="region" aria-label="Google reviews" tabIndex={0}>
              {testimonials.map((item) => (
                <a className="testimonial-card" href={item.href || googleBusinessUrl} target="_blank" rel="noreferrer" data-reveal key={item.id}>
                  <div className="review-stars" aria-label={`${item.year || "5"} out of 5 stars`}>{"★".repeat(Number(item.year || 5))}</div>
                  <strong className="reviewer-name">{item.title}</strong>
                  <p className="review-text">{item.body}</p>
                  <span className="review-platform">Google review</span>
                </a>
              ))}
            </div>
          </section>

          <aside className="story-whisper" data-reveal><span>On collaboration</span><p>“{brandTaglines[4]}”</p></aside>

          <section className="team-section" id="team">
            <img className="section-watermark section-watermark-two" src="/mindrythm-logomark.png" alt="" aria-hidden="true" />
            <div className="team-heading" data-reveal>
              <span>Meet the team</span>
              <h2>The right eye<br />for <em>every story.</em></h2>
              <div className="team-heading-action"><p>{teamIntroduction}</p><a href="/team">Meet our team</a></div>
            </div>
            <a className="team-page-link" href="/team"><span>People behind the images</span><strong>Explore the full team →</strong></a>
          </section>

          <section className="about-section" id="about">
            <div className="about-heading" data-reveal>
              <span>About us</span>
              <h2>“Mindrythm is where<br />ideas find a visual language.”</h2>
            </div>
            <div className="about-grid about-grid-single">
              <a href="/story" data-reveal><h3>What is Mindrythm?</h3><p>We translate unseen narratives into honest, timeless imagery and films that reveal the essence already there.</p><i>Discover our story →</i></a>
            </div>
          </section>

          <section className="process-section" id="process">
            <div className="process-heading" data-reveal>
              <span>Our rhythm</span>
              <h2>From first conversation<br />to <em>final frame.</em></h2>
              <p>A clear process gives every place and milestone the time, light and attention it deserves.</p>
            </div>
            {heroItems[1] && <a className="process-film" href="/work" data-reveal><Media item={heroItems[1]} /><div><span>Brief / Plan / Capture</span><p>A calm production gives spaces, people and real emotion room to lead. <b>View our work</b></p></div></a>}
            <div className="process-steps">
              <a href="/contact" data-reveal><h3>Discover</h3><p>We understand the place, people, audience and feeling the imagery needs to create.</p><i>Begin a brief</i></a>
              <a href="/contact" data-reveal><h3>Plan</h3><p>We shape the schedule, locations, light, shot list and practical details before the day.</p><i>Begin a brief</i></a>
              <a href="/contact" data-reveal><h3>Capture</h3><p>Photography, film and aerial sequences are composed as one coherent visual story.</p><i>Begin a brief</i></a>
              <a href="/contact" data-reveal><h3>Deliver</h3><p>Every frame is edited and supplied for galleries, websites, campaigns, archives and social media.</p><i>Begin a brief</i></a>
            </div>
          </section>

          <aside className="story-whisper story-whisper-light" data-reveal><span>Every beginning</span><p>“{brandTaglines[5]}”</p></aside>

          <section className="contact-section" id="contact">
            <div className="contact-heading" data-reveal>
              <span>Reach out</span>
              <h2>Let’s capture<br />your next <em>story.</em></h2>
            </div>
            <div className="enquiry-reassurance" data-reveal>{enquiryTaglines.map((line) => <blockquote key={line}>“{line}”</blockquote>)}</div>
            <div className="contact-discovery" data-reveal>
              <div className="contact-map-card">
                <iframe title="Mindrythm location" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} />
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer"><span>Studio location</span><strong>{address}</strong><i>Open map</i></a>
              </div>
              <div className="contact-connect-card">
                <span>Follow the living archive</span>
                <h3>New places.<br />Real celebrations.<br />Behind the frame.</h3>
                <div className="contact-network-links">
                  <a href={mainInstagramUrl} target="_blank" rel="noreferrer"><span>Instagram</span><strong>@mindrythm_studios</strong><i>Photography, films &amp; process</i></a>
                  <a href={settings.facebook} target="_blank" rel="noreferrer"><span>Facebook</span><strong>Mindrythm</strong><i>Updates, galleries &amp; stories</i></a>
                  <a href={settings.youtube} target="_blank" rel="noreferrer"><span>YouTube</span><strong>Mindrythm</strong><i>Films, edits &amp; moving stories</i></a>
                </div>
                <a className="contact-primary-cta" href="/contact#enquiry"><span>Have a story in mind?</span><strong>Start a project</strong></a>
              </div>
            </div>
            <div className="contact-layout">
              <div className="contact-details" data-reveal>
                <div><span>Call</span><a href={`tel:${phonePrimary.replace(/\s/g, "")}`}>{phonePrimary}</a><a href={`tel:${phoneSecondary.replace(/\s/g, "")}`}>{phoneSecondary}</a></div>
                <div><span>Email</span><a href={`mailto:${contactEmail}`}>{contactEmail}</a></div>
                <div><span>Visit</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">{address}</a></div>
                <div className="contact-socials" aria-label="Mindrythm social links">
                  <a href={mainInstagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
                  <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
                  <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
                </div>
              </div>
              <form className="enquiry-form" onSubmit={submitEnquiry} data-reveal>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" hidden />
                <div className="form-field"><label htmlFor="name">Full name *</label><input id="name" name="name" required autoComplete="name" /></div>
                <div className="form-field"><label htmlFor="phone">Phone number *</label><input id="phone" name="phone" required type="tel" autoComplete="tel" /></div>
                <div className="form-field"><label htmlFor="email">Email ID</label><input id="email" name="email" type="email" autoComplete="email" /></div>
                <div className="form-field">
                  <label htmlFor="service">Service *</label>
                  <select id="service" name="service" required defaultValue="">
                    <option value="" disabled>Select a service</option>
                    {serviceItems.map((service) => (
                      <option key={service.key} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                    <option value="Other / Custom Brief">Other / Custom Brief</option>
                  </select>
                </div>
                <div className="form-field form-field-wide"><label htmlFor="query">Your query *</label><textarea id="query" name="query" required maxLength={1000} rows={6} /></div>
                <button type="submit" disabled={enquiryState === "sending"}>{enquiryState === "sending" ? "Sending…" : "Send enquiry"}</button>
                <p className={`form-message ${enquiryState}`} aria-live="polite">{enquiryState === "sent" ? "Thank you. Your enquiry has been sent to admin@mindrythm.com." : enquiryState === "error" ? "Your enquiry could not be delivered. Please email admin@mindrythm.com directly." : "Your message will be sent securely to admin@mindrythm.com."}</p>
              </form>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="footer-cta">
            <span>{content.footer.callout}</span>
            <a href="/contact">{content.footer.actionLabel}</a>
          </div>

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
                <a href="#home" onClick={returnToHero}>Home</a>
                <a href="/services">Services</a>
                <a href="/work">Our Work</a>
                <a href="/gallery">Gallery</a>
                <a href="/team">Our Team</a>
                <a href="/story">Our Story</a>
                <a href="/contact">Enquire</a>
              </nav>
            </div>

            {/* Column 3: Studio Services */}
            <div className="footer-col footer-col-services">
              <h4 className="footer-col-title">Our Services</h4>
              <nav className="footer-nav-list" aria-label="Footer services">
                <a href="/services#service-visual-production">Visual Production (Photo + Film)</a>
                <a href="/services#service-drone-imagery">Drone &amp; Aerial Imagery</a>
                <a href="/services#service-website-development">Website Development</a>
                <a href="/services#service-social-media-creatives">Social Media Creatives</a>
                <a href="/services#service-meta-ads">Meta Ads &amp; Campaign Direction</a>
                <a href="/services#service-logo-generation">Logo &amp; Brand Identity</a>
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
              <a href="/privacy">Privacy Policy</a>
              <span className="footer-legal-dot">•</span>
              <a href="/terms">Terms &amp; Conditions</a>
              <span className="footer-legal-dot">•</span>
              <a href="/studio">Content Studio</a>
            </div>
          </div>
        </footer>
        <BackToTop />
      </div>

      {selectedItem && (() => {
        const allItems = [...projects, ...galleryItems];
        const seen = new Set<string>();
        const unique = allItems.filter((item) => { if (seen.has(item.id)) return false; seen.add(item.id); return true; });
        return (
          <ImmersiveLightbox
            selected={selectedItem}
            items={unique}
            onClose={() => setSelectedItem(null)}
            onSelect={setSelectedItem}
          />
        );
      })()}
    </>
  );
}

function ProjectCard({ project, index, onOpen }: { project: ContentItem; index: number; onOpen: () => void }) {
  return (
    <button type="button" className={`project-tile project-card project-${(index % 6) + 1}`} onClick={onOpen} data-reveal>
      <Media item={project} /><div className="media-shade" />
      <span className="card-category">{project.category}</span>
      <div className="project-title"><span>{project.eyebrow}</span><h3>{project.title}</h3><p>{project.body}</p></div>
    </button>
  );
}

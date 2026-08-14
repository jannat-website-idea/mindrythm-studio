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
import { getServiceProjects } from "@/lib/services";
import { type CSSProperties, type FormEvent, type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";

const googleBusinessUrl = "https://www.google.com/search?kgmid=/g/11njpxjhwk&q=Mindrythm+Studios";

const fallbackTestimonials: ContentItem[] = [
  {
    id: "review-one",
    kind: "testimonial",
    sortOrder: 10,
    title: "From Mindrythm Studios",
    eyebrow: "Official profile description",
    body: "Mindrythm Weddings is a cinematic wedding photography and filmmaking studio specializing in editorial, emotional, and timeless wedding storytelling. We create luxury wedding visuals that capture genuine moments with an artistic and cinematic approach.",
    mediaUrl: "",
    mediaAlt: "",
    category: "Google Business Profile",
    year: "",
    href: googleBusinessUrl,
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
        body: "Architecture, resort, real-estate and brand photography.", mediaUrl: "/images/dance-study.jpg",
        mediaAlt: "Mindrythm wellness and lifestyle photography", category: "Lead Photographer", year: "", href: mainInstagramUrl, accent: "forest",
      },
      {
        id: "team-image", kind: "team", sortOrder: 90, title: "Events & celebrations", eyebrow: "Core team",
        body: "Candid photography, portraits, rituals and live moments.", mediaUrl: projects[1]?.mediaUrl || "/images/wedding-celebration.jpg",
        mediaAlt: "Mindrythm event and wedding photographer", category: "Event Photographer", year: "", href: settings.linkedin, accent: "forest",
      },
      {
        id: "team-post", kind: "team", sortOrder: 100, title: "Aerial film & post", eyebrow: "Core team",
        body: "Wedding films, event aftermovies, drone capture, edit and colour.", mediaUrl: projects[2]?.mediaUrl || "/videos/event-film.mp4",
        mediaAlt: "Mindrythm aerial film specialist", category: "Film & Post", year: "", href: mainInstagramUrl, accent: "forest",
      },
    ];
    return [...savedTeam, ...placeholders].slice(0, 3);
  }, [mainInstagramUrl, projects, savedTeam, settings.linkedin]);

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
    setMenuOpen(false);
    setActiveHash("#home");
    setSectionNavVisible(false);
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
  }

  useEffect(() => {
    const shouldSkipIntro = window.sessionStorage.getItem("mindrythmSkipIntro") === "1";
    if (shouldSkipIntro) {
      window.sessionStorage.removeItem("mindrythmSkipIntro");
      const skipFrame = window.requestAnimationFrame(() => {
        setLoaderProgress(100);
        setLoaded(true);
        setShowLoader(false);
      });
      return () => window.cancelAnimationFrame(skipFrame);
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
          <span>Visual stories</span>
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
            <i aria-hidden="true" />
          </button>
      </header>

      <div className={`menu-overlay ${menuOpen ? "nav-open" : ""}`} aria-hidden={!menuOpen}>
        <button type="button" className="menu-overlay-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}>
          <span>Close</span>
          <i aria-hidden="true">×</i>
        </button>
          <aside className="menu-overlay-brand" aria-hidden="true">
            <div className="menu-brand-context">
              <span>Creative professional studio</span>
              <small>Independent visual practice</small>
            </div>
            <div className="menu-brand-feature">
              <img src="/mindrythm-logomark.png" alt="" className="menu-brand-logo-centered" />
              <p><span>Mindrythm</span></p>
            </div>
            <small>Every image begins with a pulse.</small>
          </aside>
          <div className="menu-overlay-index">
            <div className="menu-overlay-heading"><span>Navigation</span><span>Studio directory</span></div>
            <nav aria-label="Main navigation">
              {navigationItems.map((item) => (
                <a href={item.href} key={item.label} onClick={(event) => item.href === "#home" ? returnToHero(event) : setMenuOpen(false)}>
                  <strong>{item.label}</strong>
                  <small>{item.note}</small>
                </a>
              ))}
            </nav>
            <div className="menu-overlay-meta">
              <span>Everywhere</span>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <div className="menu-overlay-socials" aria-label="Mindrythm social links">
                <a href={mainInstagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
                <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
                <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
              </div>
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
                <span>Spaces / Hospitality</span>
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
                        <button
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          className="services-row-header"
                          onMouseEnter={() => setActiveService(index)}
                          onFocus={() => setActiveService(index)}
                          onClick={() => setActiveService(index)}
                        >
                          <span className="services-row-title">{service.title}</span>
                        </button>
                        {isActive && (
                          <div className="services-row-expanded">
                            <p className="services-row-description">{service.copy}</p>
                            <div className="services-row-actions">
                              <a className="services-row-link" href={`/services#service-${service.key}`}>
                                <span>Explore {service.title} photos</span>
                                <span aria-hidden="true">→</span>
                              </a>
                            </div>
                            <div className="services-row-mobile-media">
                              {serviceCollections[index]?.media?.[0] && (
                                <Media item={serviceCollections[index].media[0]} active={isActive} priority />
                              )}
                              <a className="services-row-mobile-cta" href={`/services#service-${service.key}`}>
                                <span>View {service.title} & photos</span>
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
                      <div
                        key={service.key}
                        className={`services-canvas-item ${isActive ? "is-active" : ""}`}
                        aria-hidden={!isActive}
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
                          <a
                            className="services-bar-cta"
                            href={`/services#service-${service.key}`}
                            aria-label={`View ${service.title} on services page`}
                          >
                            <span>Explore service & photos</span>
                            <span aria-hidden="true" className="services-bar-arrow">→</span>
                          </a>
                        </div>
                      </div>
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
              {projects.slice(0, 6).map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={() => setSelectedItem(project)} />)}
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

          <section className="gallery-section" id="gallery">
            <img className="section-watermark section-watermark-one" src="/mindrythm-logomark.png" alt="" aria-hidden="true" />
            <div className="gallery-heading" data-reveal>
              <span>Gallery</span>
              <h2>Spaces, people &amp;<br /><em>moments.</em></h2>
              <div className="gallery-heading-copy">
                <p>An immersive archive of properties, portraits, architecture and moving moments from every side of the studio.</p>
              </div>
            </div>
            <div className="gallery-scroll" aria-label="Gallery archive">
              <GalleryCollection title="Mindrythm Archive" items={galleryItems} socials={settings} onOpen={setSelectedItem} />
            </div>
            <div className="gallery-scroll-note"><span>Visual archive</span><span>Mindrythm Studio</span></div>
          </section>

          <aside className="story-whisper story-whisper-light" data-reveal><span>Our point of view</span><p>“{brandTaglines[3]}”</p></aside>

          <section className="testimonials-section" id="testimonials">
            <div className="testimonials-heading" data-reveal>
              <span>Testimonials</span>
              <h2>Words from<br /><em>our collaborators.</em></h2>
              <div className="testimonial-source"><span>Mindrythm on Google</span><a href={googleBusinessUrl} target="_blank" rel="noreferrer">Read on Google</a></div>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((item) => (
                <a className="testimonial-card" href={item.href || googleBusinessUrl} target="_blank" rel="noreferrer" data-reveal key={item.id}>
                  {item.category === "Google Business Profile" ? (
                    <div className="review-stars" aria-label="Google Business Profile">Google Business Profile</div>
                  ) : (
                    <div className="review-stars" aria-label={`${item.year || "5.0"} out of 5 stars`}>★★★★★</div>
                  )}
                  <blockquote>“{item.body}”</blockquote>
                  <div><strong>{item.title}</strong><span>{item.eyebrow || item.category}</span></div>
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
            <div className="team-grid" aria-label="Meet the Mindrythm team">
              {team.map((member, index) => (
                <article className={`team-card ${activeTeamCardId === member.id ? "active" : ""}`} key={`${member.id}-${index}`} onClick={() => setActiveTeamCardId((current) => current === member.id ? null : member.id)}>
                  <button type="button" className="team-card-trigger" aria-expanded={activeTeamCardId === member.id} aria-controls={`team-card-copy-${index}`}>
                    <Media item={member} />
                    <span className="sr-only">Show information about {member.title}</span>
                  </button>
                  <div className="team-card-copy" id={`team-card-copy-${index}`}>
                    <span>{member.category || member.eyebrow}</span><h3>{member.title}</h3><p>{member.body}</p>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setActiveTeamCardId(null); setSelectedItem(member); }}>View profile</button>
                  </div>
                </article>
              ))}
            </div>
            <a className="team-page-link" href="/team"><span>People behind the images</span><strong>Explore the full team</strong></a>
          </section>

          <section className="about-section" id="about">
            <div className="about-heading" data-reveal>
              <span>About us</span>
              <h2>“Mindrythm is where<br />ideas find a visual language.”</h2>
            </div>
            <div className="about-grid">
              <a href="/story" data-reveal><h3>What is Mindrythm?</h3><p>We translate unseen narratives into honest, timeless imagery and films that reveal the essence already there.</p><i>Read more</i></a>
              <a href="/work" data-reveal><h3>What we capture</h3><p>Properties, resorts, corporate events and weddings—through photography, cinematic film, aerial footage and social edits.</p><i>Explore our work</i></a>
              <a href="/contact" data-reveal><h3>Who we work with</h3><p>Couples, families, event teams, developers, architects, resorts and brands looking for imagery with feeling and precision.</p><i>Work with us</i></a>
              <a href="#process" data-reveal><h3>How we work</h3><p>We plan timing, light, shot lists and delivery around each brief, keeping the experience calm from first conversation to final files.</p><i>See the process</i></a>
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
                <div className="form-field form-field-wide"><label htmlFor="query">Your query *</label><textarea id="query" name="query" required maxLength={1000} rows={6} /></div>
                <button type="submit" disabled={enquiryState === "sending"}>{enquiryState === "sending" ? "Sending…" : "Send enquiry"}</button>
                <p className={`form-message ${enquiryState}`} aria-live="polite">{enquiryState === "sent" ? "Thank you. Your enquiry has been sent to admin@mindrythm.com." : enquiryState === "error" ? "Your enquiry could not be delivered. Please email admin@mindrythm.com directly." : "Your message will be sent securely to admin@mindrythm.com."}</p>
              </form>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="footer-cta"><span>{content.footer.callout}</span><a href="/contact">{content.footer.actionLabel}</a></div>
          <div className="footer-grid">
            <div className="footer-brand"><img src="/mindrythm-logomark.png" alt="Mindrythm logomark" /><span>Mindrythm</span></div>
            <div className="footer-column"><span>Explore</span><a href="/services">Services</a><a href="/work">Our Work</a><a href="/gallery">Gallery</a><a href="/team">Our Team</a></div>
            <div className="footer-column"><span>Follow</span><div className="footer-social-links" aria-label="Mindrythm social links">
              <a href={mainInstagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
              <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
            </div></div>
            <div className="footer-column"><span>Legal</span><a href="/privacy">Privacy Policy</a><a href="/terms">Terms &amp; Conditions</a><a href={content.footer.studioUrl}>Content Studio</a></div>
          </div>
          <div className="footer-meta"><span>© {new Date().getFullYear()} Mindrythm</span><span>{content.footer.locationLabel}</span></div>
        </footer>
        <BackToTop />
      </div>

      {selectedItem && (() => {
        const allItems = [...projects, ...galleryItems];
        const seen = new Set<string>();
        const unique = allItems.filter((item) => { if (seen.has(item.id)) return false; seen.add(item.id); return true; });
        const currentIndex = unique.findIndex((item) => item.id === selectedItem.id);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < unique.length - 1;
        const goPrev = () => hasPrev && setSelectedItem(unique[currentIndex - 1]);
        const goNext = () => hasNext && setSelectedItem(unique[currentIndex + 1]);
        return (
          <div className="lightbox-immersive" role="dialog" aria-modal="true" aria-label={selectedItem.title}>
            <div className="lightbox-stage">
              <div className="lightbox-media-wrapper">
                <Media item={selectedItem} priority />
              </div>
            </div>
            <div className="lightbox-immersive-toolbar">
              <button type="button" className="lightbox-grid-btn" onClick={() => setSelectedItem(null)} aria-label="Back to gallery">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>
              <button type="button" className="lightbox-close-btn" onClick={() => setSelectedItem(null)} aria-label="Close">Close ×</button>
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
                <span>{selectedItem.category || selectedItem.eyebrow}</span>
                <h2>{selectedItem.title}</h2>
                {selectedItem.body && <p>{selectedItem.body}</p>}
              </div>
            </div>
          </div>
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

function GalleryCollection({ title, items, socials, onOpen }: { title: string; items: ContentItem[]; socials: SiteContent["settings"]; onOpen: (item: ContentItem) => void }) {
  const shown = items.length ? items.slice(0, 7) : [];
  const isCelebrations = title === "Celebrations";
  return (
    <article className="gallery-board" data-reveal>
      <header><h3>{title}</h3><p>Images / motion / fragments</p></header>
      <div className="gallery-board-grid">
        {shown.map((item, itemIndex) => (
          <button type="button" className={`gallery-card gallery-slot-${itemIndex + 1}`} key={`${item.id}-${itemIndex}`} onClick={() => onOpen(item)}>
            <Media item={item} /><span>{item.title}</span>
          </button>
        ))}
        <div className="gallery-card gallery-note gallery-note-social" aria-label="Mindrythm social channels">
          <a href={socials.instagram || defaultInstagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></a>
          <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></a>
          <a href={socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube"><SocialIcon name="youtube" /></a>
        </div>
        <a className="gallery-card gallery-note gallery-note-feature" href="/gallery"><span>Mindrythm archive</span><p>{isCelebrations ? "Wedding stories with feeling, movement and detail." : "Spaces shaped by light, material and a sense of arrival."}</p><i>Open the full gallery</i></a>
      </div>
    </article>
  );
}

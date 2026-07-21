"use client";

import type { ContentItem, SiteContent } from "@/lib/content";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function Experience({ content }: { content: SiteContent }) {
  const { settings } = content;
  const projects = useMemo(
    () => content.items.filter((item) => item.kind === "project").sort((a, b) => a.sortOrder - b.sortOrder),
    [content.items],
  );
  const team = content.items.filter((item) => item.kind === "team");
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ContentItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filters = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category).filter(Boolean)))],
    [projects],
  );
  const visibleProjects = activeFilter === "All"
    ? projects
    : projects.filter((project) => project.category === activeFilter);
  const galleryItems = projects.length ? projects : content.items;

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const next = Math.min(100, Math.round((elapsed / 2100) * 100));
      setProgress(next);
      if (next < 100) {
        frame = window.requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setLoaded(true), 480);
      }
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.1 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [activeFilter]);

  useEffect(() => {
    if (!selectedProject) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", close);
    };
  }, [selectedProject]);

  const imageAt = (index: number) => galleryItems[index % Math.max(galleryItems.length, 1)];

  return (
    <>
      <div className={`preloader ${loaded ? "preloader-done" : ""}`} aria-hidden={loaded}>
        <div className={`loader-frame loader-frame-a ${progress > 14 ? "is-on" : ""}`}>
          <img src={imageAt(0)?.mediaUrl || "/images/tokyo-rain.jpg"} alt="" />
        </div>
        <div className={`loader-frame loader-frame-b ${progress > 34 ? "is-on" : ""}`}>
          <img src={imageAt(1)?.mediaUrl || "/images/dance-study.jpg"} alt="" />
        </div>
        <div className={`loader-frame loader-frame-c ${progress > 58 ? "is-on" : ""}`}>
          <img src={imageAt(2)?.mediaUrl || "/images/filmmaker.jpg"} alt="" />
        </div>
        <div className="loader-name" aria-label="Mind Rhythm">
          <span>MIND</span>
          <em>RHYTHM</em>
        </div>
        <div className="loader-caption">Independent image-making studio</div>
        <div className="preloader-progress">{String(progress).padStart(3, "0")}</div>
        <div className="preloader-line"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div className={`site-shell ${loaded ? "site-ready" : ""}`}>
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Mind Rhythm home">
            <span>MIND</span><em>RHYTHM</em><sup>°</sup>
          </a>
          <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
            <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
            <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
            <a href="#studio" onClick={() => setMenuOpen(false)}>Studio</a>
            <a href="#people" onClick={() => setMenuOpen(false)}>People</a>
          </nav>
          <a className="header-contact" href={`mailto:${settings.contactEmail}`}>Start a project ↗</a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </header>

        <main id="top">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-label hero-label-left">Visual narratives<br />with a pulse.</div>
            <div className="hero-label hero-label-right">Kolkata / Everywhere<br />2026</div>
            <h1 id="hero-title" className="hero-brand" aria-label="Mind Rhythm">
              <span className="hero-mind">MIND</span>
              <em className="hero-rhythm">RHYTHM</em>
            </h1>
            <div className="hero-copy">
              <span className="hero-index">(00)</span>
              <p>We make moving images, identities and visual worlds that stay in the mind.</p>
            </div>
            <div className="hero-image hero-image-main">
              <img src={imageAt(0)?.mediaUrl || "/images/tokyo-rain.jpg"} alt={imageAt(0)?.mediaAlt || "Mind Rhythm visual study"} />
              <span>Selected frame / 01</span>
            </div>
            <div className="hero-image hero-image-small">
              <img src={imageAt(1)?.mediaUrl || "/images/dance-study.jpg"} alt={imageAt(1)?.mediaAlt || "Mind Rhythm movement study"} />
            </div>
            <a className="hero-scroll" href="#work"><span>Scroll to explore</span><b>↓</b></a>
          </section>

          <section className="work-section" id="work">
            <div className="section-intro" data-reveal>
              <span className="section-index">01 / Selected work</span>
              <h2>Ideas, shaped<br />into <em>feeling.</em></h2>
              <p>A selection of moving image, photography and identity work—arranged as a living editorial archive.</p>
            </div>

            <div className="filters" data-reveal role="group" aria-label="Filter projects">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={activeFilter === filter ? "active" : ""}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="projects-bento">
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={() => setSelectedProject(project)}
                />
              ))}

              <article className="project-tile project-statement" data-reveal>
                <span>Our vision / 01</span>
                <blockquote>“{settings.vision}”</blockquote>
                <div className="pulse-glyph" aria-hidden="true"><i /><i /><i /></div>
              </article>

              <article className="project-tile project-process" data-reveal>
                <span>Method / always collaborative</span>
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
              <span>02 / Gallery</span>
              <h2>Field notes from<br /><em>our visual world.</em></h2>
              <p>Fragments, places, gestures and details collected between projects.</p>
            </div>

            <div className="gallery-bento">
              <GalleryImage item={imageAt(0)} className="gallery-a" label="City / After rain" onOpen={setSelectedProject} />
              <article className="gallery-card gallery-copy gallery-b" data-reveal>
                <span>Explore</span>
                <p>Follow the rhythm between one frame and the next.</p>
              </article>
              <GalleryImage item={imageAt(3)} className="gallery-c" label="Botanical / Form" onOpen={setSelectedProject} />
              <article className="gallery-card gallery-copy gallery-d" data-reveal>
                <h3>Where instinct<br />meets intention.</h3>
                <p>{settings.tagline}</p>
              </article>
              <GalleryImage item={imageAt(2)} className="gallery-e" label="Portrait / Process" onOpen={setSelectedProject} />
              <GalleryImage item={imageAt(1)} className="gallery-f" label="Movement / Study" onOpen={setSelectedProject} />
              <article className="gallery-card gallery-copy gallery-g" data-reveal>
                <span>Archive note / 07</span>
                <h3>Stay<br /><em>curious.</em></h3>
                <p>Every project begins with looking more closely.</p>
              </article>
              <div className="gallery-controls" data-reveal>
                <a href="#work">Previous</a><span>04 / 12</span><a href="#studio">Next</a>
              </div>
            </div>
          </section>

          <section className="studio-section" id="studio">
            <div className="studio-word" aria-hidden="true">STUDIO</div>
            <div className="studio-heading" data-reveal>
              <span>03 / About Mind Rhythm</span>
              <h2>A clear idea.<br />An <em>unexpected image.</em></h2>
            </div>
            <div className="studio-copy" data-reveal>
              <p className="lead">{settings.idea}</p>
              <p>{settings.description}</p>
              <a href={`mailto:${settings.contactEmail}`} className="text-link">Start a conversation ↗</a>
            </div>
          </section>

          <section className="people-section" id="people">
            <div className="people-heading" data-reveal>
              <span>04 / The collective</span>
              <h2>Built around<br /><em>good chemistry.</em></h2>
            </div>
            <div className="people-layout">
              <div className="people-portrait" data-reveal>
                <img src={team[0]?.mediaUrl || "/images/filmmaker.jpg"} alt={team[0]?.mediaAlt || "Mind Rhythm creative collaborator"} />
                <span>Mind Rhythm / Core collective</span>
              </div>
              <div className="people-copy" data-reveal>
                <span>Not a fixed roster.</span>
                <h3>{team[0]?.title || "The right minds for each story."}</h3>
                <p>{team[0]?.body || "Directors, cinematographers, photographers, designers and post artists brought together around the work."}</p>
                <div className="discipline-cloud">
                  <span>Direction</span><span>Film</span><span>Photography</span>
                  <span>Design</span><span>Post</span><span>Sound</span>
                </div>
              </div>
            </div>
          </section>

          <section className="contact-section" id="contact">
            <span className="contact-kicker">05 / Begin a project</span>
            <p>Have a story<br />that needs a <em>rhythm?</em></p>
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}<span>↗</span></a>
          </section>
        </main>

        <footer className="site-footer">
          <a className="wordmark footer-wordmark" href="#top"><span>MIND</span><em>RHYTHM</em><sup>°</sup></a>
          <div className="footer-links">
            <a href={settings.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href={settings.vimeo} target="_blank" rel="noreferrer">Vimeo ↗</a>
            <a href={settings.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
          <div className="footer-meta">
            <span>© {new Date().getFullYear()} Mind Rhythm</span>
            <Link href="/studio">Content studio ↗</Link>
          </div>
        </footer>
      </div>

      {selectedProject && (
        <div className="project-modal" role="dialog" aria-modal="true" aria-label={selectedProject.title}>
          <button type="button" className="modal-close" onClick={() => setSelectedProject(null)}>Close ×</button>
          <div className="modal-media"><Media item={selectedProject} /></div>
          <div className="modal-copy">
            <span>{selectedProject.eyebrow} / {selectedProject.year}</span>
            <h2>{selectedProject.title}</h2>
            <p>{selectedProject.body}</p>
            <div className="modal-footer"><span>{selectedProject.category}</span><span>Mind Rhythm Studio</span></div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectCard({ project, index, onOpen }: { project: ContentItem; index: number; onOpen: () => void }) {
  return (
    <button
      type="button"
      className={`project-tile project-card project-${(index % 6) + 1}`}
      onClick={onOpen}
      data-reveal
    >
      <Media item={project} />
      <div className="media-shade" />
      <span className="card-number">{String(index + 1).padStart(2, "0")} / {project.category}</span>
      <div className="project-title">
        <span>{project.year}</span>
        <h3>{project.title}</h3>
      </div>
      <span className="project-arrow">↗</span>
    </button>
  );
}

function GalleryImage({ item, className, label, onOpen }: {
  item?: ContentItem;
  className: string;
  label: string;
  onOpen: (item: ContentItem) => void;
}) {
  if (!item) return null;
  return (
    <button type="button" className={`gallery-card gallery-image ${className}`} onClick={() => onOpen(item)} data-reveal>
      <Media item={item} />
      <span>{label}</span>
    </button>
  );
}

function Media({ item }: { item: ContentItem }) {
  const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(item.mediaUrl);
  if (isVideo) {
    return <video src={item.mediaUrl} muted loop autoPlay playsInline aria-label={item.mediaAlt} />;
  }
  return <img src={item.mediaUrl || "/images/tokyo-rain.jpg"} alt={item.mediaAlt || item.title} />;
}

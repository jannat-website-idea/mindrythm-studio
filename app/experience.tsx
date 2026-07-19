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

  useEffect(() => {
    let value = 0;
    const timer = window.setInterval(() => {
      value += Math.ceil((100 - value) * 0.16);
      if (value >= 99) value = 100;
      setProgress(value);
      if (value === 100) {
        window.clearInterval(timer);
        window.setTimeout(() => setLoaded(true), 450);
      }
    }, 80);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
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

  return (
    <>
      <div className={`preloader ${loaded ? "preloader-done" : ""}`} aria-hidden={loaded}>
        <div className="preloader-word preloader-left">MIND</div>
        <div className="preloader-mark">•</div>
        <div className="preloader-word preloader-right">RHYTHM</div>
        <div className="preloader-progress">{String(progress).padStart(2, "0")}%</div>
        <div className="preloader-line"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="site-shell">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Mindrythm home">
            MIND<span>RHYTHM</span><sup>°</sup>
          </a>
          <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
            <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
            <a href="#studio" onClick={() => setMenuOpen(false)}>Studio</a>
            <a href="#people" onClick={() => setMenuOpen(false)}>People</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <div className="header-meta">Independent creative studio</div>
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
            <div className="hero-meta">
              <span>Image / Motion / Identity</span>
              <span>Available for selected collaborations</span>
            </div>
            <h1 id="hero-title">
              <span>We create images</span>
              <span>with a <em>pulse.</em></span>
            </h1>
            <div className="hero-bottom">
              <p>{settings.description}</p>
              <a href="#work" className="round-link" aria-label="Explore selected work">↓</a>
            </div>
          </section>

          <section className="work-section" id="work">
            <div className="section-heading" data-reveal>
              <div>
                <span className="index">01</span>
                <p>Selected work</p>
              </div>
              <h2>Stories arranged<br /><em>by instinct.</em></h2>
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

            <div className="bento-grid">
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={() => setSelectedProject(project)}
                />
              ))}

              <article className="bento-card vision-card" data-reveal>
                <span className="card-number">Vision / 01</span>
                <blockquote>“{settings.vision}”</blockquote>
                <div className="orbit-mark" aria-hidden="true"><span /></div>
              </article>

              <article className="bento-card process-card" data-reveal>
                <span className="card-number">How we work</span>
                <div className="process-list">
                  <span><b>01</b> Listen closely</span>
                  <span><b>02</b> Find the rhythm</span>
                  <span><b>03</b> Build the world</span>
                </div>
                <p>Direction without noise. Craft without decoration.</p>
              </article>
            </div>
          </section>

          <section className="studio-section" id="studio">
            <div className="studio-statement" data-reveal>
              <span className="index">02 / Studio</span>
              <p>{settings.tagline}</p>
              <h2>Between a clear idea<br />and an <em>unexpected image.</em></h2>
            </div>
            <div className="studio-copy" data-reveal>
              <p className="lead">{settings.idea}</p>
              <p>{settings.description}</p>
              <a href={`mailto:${settings.contactEmail}`} className="text-link">Start a conversation ↗</a>
            </div>
          </section>

          <section className="people-section" id="people">
            <div className="section-heading inverse" data-reveal>
              <div><span className="index">03</span><p>People</p></div>
              <h2>Built around<br /><em>good chemistry.</em></h2>
            </div>
            <div className="people-grid">
              <div className="people-portrait" data-reveal>
                <img src={team[0]?.mediaUrl || "/images/filmmaker.jpg"} alt={team[0]?.mediaAlt || "Mindrythm creative collaborator"} />
                <span>Mindrythm / Core collective</span>
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
            <div className="contact-orbit" aria-hidden="true"><span>Let’s make something that moves.</span></div>
            <div className="contact-copy" data-reveal>
              <span>Have a story in mind?</span>
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <a className="wordmark footer-wordmark" href="#top">MIND<span>RHYTHM</span><sup>°</sup></a>
          <div className="footer-links">
            <a href={settings.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href={settings.vimeo} target="_blank" rel="noreferrer">Vimeo ↗</a>
            <a href={settings.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
          <div className="footer-meta">
            <span>© {new Date().getFullYear()} Mindrythm</span>
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
            <div className="modal-footer"><span>{selectedProject.category}</span><span>Mindrythm Studio</span></div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: ContentItem;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className={`bento-card project-card project-${(index % 6) + 1}`}
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

function Media({ item }: { item: ContentItem }) {
  const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(item.mediaUrl);
  if (isVideo) {
    return <video src={item.mediaUrl} muted loop autoPlay playsInline aria-label={item.mediaAlt} />;
  }
  return <img src={item.mediaUrl || "/images/tokyo-rain.jpg"} alt={item.mediaAlt || item.title} />;
}

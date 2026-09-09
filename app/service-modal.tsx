"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { type ContentItem, type ServiceContent } from "@/lib/content";
import { getServiceGalleryItems } from "@/lib/services";

export function ServiceModal({
  service,
  allGalleryItems,
  onClose,
  onOpenLightbox,
}: {
  service: ServiceContent | null;
  allGalleryItems: ContentItem[];
  onClose: () => void;
  onOpenLightbox?: (item: ContentItem) => void;
}) {
  // Lock body scroll while modal is open
  useEffect(() => {
    if (!service) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [service, onClose]);

  // Mini-gallery for Visual Production and Drone Imagery (and any service with gallery items)
  const miniGallery = useMemo(() => {
    if (!service) return [];
    return getServiceGalleryItems(allGalleryItems, service.key);
  }, [service, allGalleryItems]);

  if (!service) return null;

  const isWebDev = service.key === "web-development";
  const isLogoGen = service.key === "logo-generation" || service.key === "wellness";
  const isVisualOrDrone = service.key === "visual-production" || service.key === "drone-imagery";

  const websiteLinks = service.websiteLinks || [];
  const logoImages = service.logoImages || [];

  return (
    <div
      className="service-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={service.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="service-modal-card">
        {/* Header bar */}
        <div className="service-modal-header">
          <div className="service-modal-tag">
            <span className="service-modal-dot" aria-hidden="true" />
            <span>Studio Service</span>
          </div>
          <button
            type="button"
            className="service-modal-close-btn"
            onClick={onClose}
            aria-label="Close service window"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Modal body */}
        <div className="service-modal-body">
          <div className="service-modal-hero">
            <h2 className="service-modal-title">{service.title}</h2>
            <p className="service-modal-description">{service.copy}</p>
            <div className="service-modal-actions">
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="service-modal-cta"
                onClick={onClose}
              >
                <span>Book this service</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* ITEM 3: WEBSITE DEVELOPMENT - Square/Rounded-Square Link Buttons */}
          {isWebDev && (
            <div className="service-modal-section">
              <div className="service-modal-gallery-header">
                <span className="service-modal-gallery-title">Featured Live Websites</span>
                <span className="service-modal-gallery-count">{websiteLinks.length} Projects</span>
              </div>
              <div className="service-website-links-grid">
                {websiteLinks.map((site, idx) => {
                  const displayUrl = site.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
                  return (
                    <a
                      key={idx}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="service-web-btn"
                    >
                      <div className="service-web-btn-icon" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </div>
                      <div className="service-web-btn-info">
                        <strong className="service-web-btn-title">{site.title || "Live Website"}</strong>
                        <span className="service-web-btn-url">{displayUrl} ↗</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* ITEM 4: LOGO GENERATION - Logo Images (PNG/JPG) Inside Window Only */}
          {isLogoGen && (
            <div className="service-modal-section">
              <div className="service-modal-gallery-header">
                <span className="service-modal-gallery-title">Brand Emblems &amp; Identity Portfolio</span>
                <span className="service-modal-gallery-count">{logoImages.length} Marks</span>
              </div>
              <div className="service-logo-showcase-grid">
                {logoImages.map((logo, idx) => (
                  <div key={idx} className="service-logo-card">
                    <img
                      src={logo.url}
                      alt={logo.alt || logo.caption || "Mindrythm Logo Design"}
                      className="service-logo-img"
                      loading="lazy"
                    />
                    {logo.caption && <span className="service-logo-caption">{logo.caption}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ITEMS 1 & 2: VISUAL PRODUCTION & DRONE IMAGERY - 5-6 Mini-Gallery Items */}
          {isVisualOrDrone && (
            <div className="service-modal-gallery-wrap">
              <div className="service-modal-gallery-header">
                <span className="service-modal-gallery-title">
                  {service.key === "drone-imagery" ? "Curated Aerial & Drone Sequences" : "Curated Visuals & Film"}
                </span>
                <span className="service-modal-gallery-count">{miniGallery.length} Items</span>
              </div>

              {miniGallery.length > 0 ? (
                <div className="service-mini-gallery-grid">
                  {miniGallery.map((item, idx) => {
                    const isVideo = item.mediaType === "video" || /\.(mp4|webm|mov)(\?.*)?$/i.test(item.mediaUrl);
                    return (
                      <button
                        key={item.id || idx}
                        type="button"
                        className="service-mini-gallery-card"
                        onClick={() => {
                          if (onOpenLightbox) {
                            onOpenLightbox(item);
                          }
                        }}
                        aria-label={`View ${item.title} full size`}
                      >
                        <div className="service-mini-card-media">
                          {isVideo ? (
                            <>
                              <video
                                src={item.mediaUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                className="service-mini-video"
                              />
                              <span className="service-mini-video-badge" aria-hidden="true">
                                ▶ Video
                              </span>
                            </>
                          ) : (
                            <img
                              src={item.mediaUrl}
                              alt={item.mediaAlt || item.title}
                              loading="lazy"
                              className="service-mini-image"
                            />
                          )}
                          <div className="service-mini-card-overlay">
                            <span className="service-mini-card-title">{item.title}</span>
                            <span className="service-mini-card-hint">Click to view ↗</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="service-modal-empty-hint">Curated visual samples will appear here once added in CMS.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

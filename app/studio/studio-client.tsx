"use client";

import type {
  ContentItem,
  ContentKind,
  SiteContent,
  SiteSettings,
} from "@/lib/content";
import Link from "next/link";
import { useMemo, useState } from "react";

type SaveState = "idle" | "saving" | "saved" | "error";

const kinds: ContentKind[] = ["project", "team", "social", "note"];

function newItem(position: number): ContentItem {
  return {
    id: `new-${crypto.randomUUID()}`,
    kind: "project",
    sortOrder: position,
    title: "Untitled project",
    eyebrow: "Category / Location",
    body: "Add a short description for this card.",
    mediaUrl: "",
    mediaAlt: "",
    category: "Image",
    year: new Date().getFullYear().toString(),
    href: "#",
    accent: "forest",
  };
}

export function StudioClient({
  initialContent,
  editorName,
}: {
  initialContent: SiteContent;
  editorName: string;
}) {
  const [settings, setSettings] = useState(initialContent.settings);
  const [items, setItems] = useState(initialContent.items);
  const [selectedId, setSelectedId] = useState(initialContent.items[0]?.id ?? "");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [uploading, setUploading] = useState(false);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId],
  );

  const updateSettings = (key: keyof SiteSettings, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  };

  const updateItem = (key: keyof ContentItem, value: string | number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === selectedId ? { ...item, [key]: value } : item,
      ),
    );
    setSaveState("idle");
  };

  async function saveSettingsNow() {
    setSaveState("saving");
    const response = await fetch("/api/studio", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    setSaveState(response.ok ? "saved" : "error");
  }

  async function saveSelected() {
    if (!selected) return;
    setSaveState("saving");
    const response = await fetch("/api/studio", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ item: selected }),
    });
    setSaveState(response.ok ? "saved" : "error");
  }

  async function addItem() {
    const item = newItem((items.length + 1) * 10);
    const response = await fetch("/api/studio", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!response.ok) return setSaveState("error");
    setItems((current) => [...current, item]);
    setSelectedId(item.id);
    setSaveState("saved");
  }

  async function deleteSelected() {
    if (!selected || !window.confirm(`Delete “${selected.title}”?`)) return;
    const response = await fetch("/api/studio", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: selected.id }),
    });
    if (!response.ok) return setSaveState("error");
    const remaining = items.filter((item) => item.id !== selected.id);
    setItems(remaining);
    setSelectedId(remaining[0]?.id ?? "");
    setSaveState("saved");
  }

  async function uploadFile(file: File) {
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/media", { method: "POST", body });
    const result = (await response.json()) as { url?: string };
    if (response.ok && result.url) updateItem("mediaUrl", result.url);
    setUploading(false);
  }

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <div>
          <span className="studio-kicker">Mindrythm Content Studio</span>
          <h1>Shape the site.</h1>
        </div>
        <div className="studio-header-actions">
          <span className="editor-pill">{editorName}</span>
          <Link href="/" target="_blank" className="button secondary">
            View website ↗
          </Link>
        </div>
      </header>

      <div className="studio-grid">
        <aside className="studio-sidebar">
          <div className="sidebar-title">
            <span>Content cards</span>
            <button type="button" onClick={addItem} aria-label="Add content card">
              +
            </button>
          </div>
          <div className="item-list">
            {items.map((item) => (
              <button
                type="button"
                key={item.id}
                className={item.id === selectedId ? "active" : ""}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{item.title}</span>
                <small>{item.kind}</small>
              </button>
            ))}
          </div>
          <button type="button" className="button wide" onClick={addItem}>
            Add new card
          </button>
        </aside>

        <section className="studio-panel">
          <div className="panel-heading">
            <div>
              <span className="studio-kicker">Global information</span>
              <h2>Studio story</h2>
            </div>
            <button type="button" className="button" onClick={saveSettingsNow}>
              Save story
            </button>
          </div>
          <div className="form-grid">
            <Field label="Studio name" value={settings.siteName} onChange={(value) => updateSettings("siteName", value)} />
            <Field label="Contact email" value={settings.contactEmail} onChange={(value) => updateSettings("contactEmail", value)} />
            <Field wide label="Tagline" value={settings.tagline} onChange={(value) => updateSettings("tagline", value)} />
            <Field wide multiline label="Description" value={settings.description} onChange={(value) => updateSettings("description", value)} />
            <Field wide multiline label="Vision" value={settings.vision} onChange={(value) => updateSettings("vision", value)} />
            <Field wide multiline label="Idea" value={settings.idea} onChange={(value) => updateSettings("idea", value)} />
            <Field label="Instagram" value={settings.instagram} onChange={(value) => updateSettings("instagram", value)} />
            <Field label="Vimeo" value={settings.vimeo} onChange={(value) => updateSettings("vimeo", value)} />
            <Field wide label="LinkedIn" value={settings.linkedin} onChange={(value) => updateSettings("linkedin", value)} />
          </div>

          {selected && (
            <>
              <div className="panel-heading item-heading">
                <div>
                  <span className="studio-kicker">Selected card</span>
                  <h2>{selected.title}</h2>
                </div>
                <div className="panel-actions">
                  <button type="button" className="button danger" onClick={deleteSelected}>
                    Delete
                  </button>
                  <button type="button" className="button" onClick={saveSelected}>
                    Save card
                  </button>
                </div>
              </div>
              <div className="form-grid">
                <label className="field">
                  <span>Card type</span>
                  <select value={selected.kind} onChange={(event) => updateItem("kind", event.target.value)}>
                    {kinds.map((kind) => <option key={kind}>{kind}</option>)}
                  </select>
                </label>
                <Field label="Order" type="number" value={String(selected.sortOrder)} onChange={(value) => updateItem("sortOrder", Number(value))} />
                <Field wide label="Title" value={selected.title} onChange={(value) => updateItem("title", value)} />
                <Field label="Eyebrow" value={selected.eyebrow} onChange={(value) => updateItem("eyebrow", value)} />
                <Field label="Category" value={selected.category} onChange={(value) => updateItem("category", value)} />
                <Field wide multiline label="Description" value={selected.body} onChange={(value) => updateItem("body", value)} />
                <Field label="Year" value={selected.year} onChange={(value) => updateItem("year", value)} />
                <Field label="Link" value={selected.href} onChange={(value) => updateItem("href", value)} />
                <Field wide label="Image/video URL" value={selected.mediaUrl} onChange={(value) => updateItem("mediaUrl", value)} />
                <label className="field field-wide upload-field">
                  <span>Or upload media</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    disabled={uploading}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) uploadFile(file);
                    }}
                  />
                  <small>{uploading ? "Uploading…" : "Images or video, up to 25 MB in this demo."}</small>
                </label>
                <Field wide label="Media description" value={selected.mediaAlt} onChange={(value) => updateItem("mediaAlt", value)} />
              </div>
            </>
          )}

          <div className={`save-status ${saveState}`}> 
            {saveState === "saving" && "Saving changes…"}
            {saveState === "saved" && "Changes saved. Refresh the website to view them."}
            {saveState === "error" && "Something went wrong. Please try again."}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  wide = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  wide?: boolean;
  type?: string;
}) {
  return (
    <label className={`field ${wide ? "field-wide" : ""}`}>
      <span>{label}</span>
      {multiline ? (
        <textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

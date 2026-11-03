"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  ExternalLink,
  FileBadge,
  FileUp,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { deleteContentAction, logoutAction, saveContentAction } from "./actions";
import { uploadCvAction } from "@/app/actions/cv";
import type { ActionResult, EntityType, PortfolioData } from "@/lib/types";

type EditorItem = { id: string; [key: string]: unknown };
type EditorState = { entity: EntityType; item: EditorItem | null } | null;
type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select";
  required?: boolean;
  full?: boolean;
  placeholder?: string;
  options?: string[];
  help?: string;
};

const entityConfig: Record<EntityType, {
  label: string;
  singular: string;
  icon: typeof FolderKanban;
  fields: Field[];
}> = {
  projects: {
    label: "Projects", singular: "project", icon: FolderKanban,
    fields: [
      { name: "title", label: "Project title", required: true, placeholder: "e.g. Cal.com" },
      { name: "imageUrl", label: "Mockup image", placeholder: "/images/project-cal.jpg", help: "Local /public path or https URL" },
      { name: "description", label: "Short overview", type: "textarea", required: true, full: true },
      { name: "problem", label: "The problem", type: "textarea", required: true, full: true },
      { name: "solution", label: "Architecture & solution", type: "textarea", required: true, full: true },
      { name: "techStack", label: "Tech stack", required: true, full: true, placeholder: "Next.js, TypeScript, SQLite", help: "Comma-separated" },
      { name: "githubUrl", label: "GitHub URL", placeholder: "https://github.com/…" },
      { name: "liveUrl", label: "Live project URL", placeholder: "https://…" },
    ],
  },
  experiences: {
    label: "Experience", singular: "role", icon: BriefcaseBusiness,
    fields: [
      { name: "company", label: "Company", required: true },
      { name: "role", label: "Job title", required: true },
      { name: "startDate", label: "Start date", required: true, placeholder: "2023-04" },
      { name: "endDate", label: "End date", required: true, placeholder: "Present" },
      { name: "order", label: "Timeline order", type: "number", required: true, help: "Lower numbers appear first" },
      { name: "description", label: "Duties & impact", type: "textarea", required: true, full: true, help: "Put each bullet on a new line" },
    ],
  },
  skills: {
    label: "Skills", singular: "skill", icon: Code2,
    fields: [
      { name: "name", label: "Skill name", required: true },
      { name: "category", label: "Category", type: "select", required: true, options: ["Programming Languages", "Frameworks & Libraries", "Engineering & Architecture", "Data & Infrastructure"] },
      { name: "proficiencyLevel", label: "Proficiency", type: "select", required: true, options: ["Expert", "Advanced", "Proficient", "Working knowledge"] },
    ],
  },
  certifications: {
    label: "Certifications", singular: "certification", icon: BadgeCheck,
    fields: [
      { name: "title", label: "Credential title", required: true, full: true },
      { name: "issuer", label: "Issuer", required: true },
      { name: "dateIssued", label: "Date issued", required: true, placeholder: "2024-09" },
      { name: "credentialUrl", label: "Credential URL", full: true, placeholder: "https://…" },
    ],
  },
  achievements: {
    label: "Achievements", singular: "achievement", icon: Award,
    fields: [
      { name: "title", label: "Achievement", required: true, full: true },
      { name: "date", label: "Date or period", required: true, placeholder: "2025-12" },
      { name: "imageUrl", label: "Optional image", placeholder: "/images/award.jpg", help: "Leave blank for the editorial placeholder" },
      { name: "description", label: "Details", type: "textarea", required: true, full: true },
    ],
  },
  education: {
    label: "Education", singular: "education entry", icon: GraduationCap,
    fields: [
      { name: "institution", label: "Institution", required: true, full: true },
      { name: "degree", label: "Degree or programme", required: true, full: true },
      { name: "startDate", label: "Start date", required: true },
      { name: "endDate", label: "End date", required: true },
      { name: "description", label: "Focus & outcome", type: "textarea", required: true, full: true },
    ],
  },
};

const tabs = Object.entries(entityConfig) as [EntityType, (typeof entityConfig)[EntityType]][];

function itemTitle(entity: EntityType, item: EditorItem) {
  if (entity === "experiences") return String(item.role || "Untitled role");
  if (entity === "skills") return String(item.name || "Untitled skill");
  if (entity === "education") return String(item.degree || "Untitled education");
  return String(item.title || "Untitled entry");
}

function itemMeta(entity: EntityType, item: EditorItem) {
  if (entity === "projects") return Array.isArray(item.techStack) ? item.techStack.join(" · ") : "Case study";
  if (entity === "experiences") return `${String(item.company)} · ${String(item.startDate)} — ${String(item.endDate)}`;
  if (entity === "skills") return `${String(item.category)} · ${String(item.proficiencyLevel)}`;
  if (entity === "certifications") return `${String(item.issuer)} · ${String(item.dateIssued)}`;
  if (entity === "achievements") return String(item.date);
  return `${String(item.institution)} · ${String(item.startDate)} — ${String(item.endDate)}`;
}

function itemDescription(item: EditorItem) {
  return String(item.description || item.problem || "").split("\n")[0];
}

export function AdminDashboard({ data, username }: { data: PortfolioData; username: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EntityType>("projects");
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<EditorState>(null);
  const [deleting, setDeleting] = useState<{ entity: EntityType; item: EditorItem } | null>(null);
  const [cvOpen, setCvOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState<ActionResult | null>(null);
  const [cvName, setCvName] = useState("");
  const [pending, startTransition] = useTransition();

  const items = data[activeTab] as unknown as EditorItem[];
  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    if (!needle) return items;
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(needle));
  }, [items, query]);
  const totalEntries = tabs.reduce((sum, [key]) => sum + data[key].length, 0);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const modalOpen = Boolean(editor || deleting || cvOpen || mobileNav);
    document.body.style.overflow = modalOpen ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setEditor(null); setDeleting(null); setCvOpen(false); setMobileNav(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [editor, deleting, cvOpen, mobileNav]);

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    const formData = new FormData(event.currentTarget);
    const currentEditor = editor;
    startTransition(async () => {
      const result = await saveContentAction(currentEditor.entity, currentEditor.item?.id || null, formData);
      setToast(result);
      if (result.ok) {
        setEditor(null);
        router.refresh();
      }
    });
  }

  function remove() {
    if (!deleting) return;
    const target = deleting;
    startTransition(async () => {
      const result = await deleteContentAction(target.entity, target.item.id);
      setToast(result);
      if (result.ok) {
        setDeleting(null);
        router.refresh();
      }
    });
  }

  function uploadCv(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await uploadCvAction(formData);
      setToast(result);
      if (result.ok) {
        setCvOpen(false);
        setCvName("");
        form.reset();
        router.refresh();
      }
    });
  }

  const config = entityConfig[activeTab];

  return (
    <main className="cms-shell">
      <aside className={`cms-sidebar ${mobileNav ? "is-open" : ""}`}>
        <div className="cms-sidebar-top">
          <a href="/" className="admin-brand-mark">DO<span>®</span></a>
          <button className="cms-mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X /></button>
        </div>
        <div className="cms-workspace-label"><LayoutDashboard size={15} /> Content workspace</div>
        <nav aria-label="Content collections">
          {tabs.map(([key, tab]) => {
            const Icon = tab.icon;
            return <button key={key} className={activeTab === key ? "active" : ""} onClick={() => { setActiveTab(key); setQuery(""); setMobileNav(false); }}><Icon size={18} /><span>{tab.label}</span><small>{data[key].length}</small></button>;
          })}
        </nav>
        <div className="cms-sidebar-bottom">
          <div className="cms-live-state"><i /><span>Live portfolio<small>SQLite · synced</small></span></div>
          <a href="/" target="_blank">View website <ExternalLink size={15} /></a>
          <form action={logoutAction}><button type="submit"><LogOut size={16} /> Sign out</button></form>
        </div>
      </aside>
      {mobileNav && <button className="cms-sidebar-scrim" onClick={() => setMobileNav(false)} aria-label="Close menu" />}

      <section className="cms-main">
        <header className="cms-header">
          <button className="cms-menu-button" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu /></button>
          <div><p className="eyebrow">Overview / {config.label}</p><h1>Good to see you, {username}.</h1></div>
          <div className="cms-header-actions">
            <button className="cms-secondary-button" onClick={() => setCvOpen(true)}><FileUp size={17} /> Replace CV</button>
            <button className="cms-add-button" onClick={() => setEditor({ entity: activeTab, item: null })}><Plus size={18} /> Add {config.singular}</button>
          </div>
        </header>

        <div className="cms-stat-row">
          <div><span>Total published entries</span><strong>{String(totalEntries).padStart(2, "0")}</strong></div>
          <div><span>Case studies</span><strong>{String(data.projects.length).padStart(2, "0")}</strong></div>
          <div><span>Current CV</span><a href={`/cv.pdf?v=${data.cvVersion}`} target="_blank">Open PDF <ChevronRight size={17} /></a></div>
        </div>

        <section className="cms-collection">
          <div className="cms-collection-head">
            <div><h2>{config.label}</h2><p>{items.length} published {items.length === 1 ? "entry" : "entries"}</p></div>
            <label className="cms-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.label.toLowerCase()}…`} /><span className="sr-only">Search {config.label}</span></label>
          </div>
          <div className="cms-list-header"><span>Entry</span><span>Details</span><span>Actions</span></div>
          <div className="cms-list">
            <AnimatePresence initial={false} mode="popLayout">
              {filtered.map((item) => (
                <motion.article layout key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="cms-list-item">
                  <div className="cms-item-title"><span className="cms-item-icon"><config.icon size={18} /></span><div><h3>{itemTitle(activeTab, item)}</h3><p>{itemMeta(activeTab, item)}</p></div></div>
                  <p className="cms-item-description">{itemDescription(item) || "Published and visible on the portfolio."}</p>
                  <div className="cms-row-actions"><button onClick={() => setEditor({ entity: activeTab, item })} aria-label={`Edit ${itemTitle(activeTab, item)}`}><Pencil size={16} /> Edit</button><button className="danger" onClick={() => setDeleting({ entity: activeTab, item })} aria-label={`Delete ${itemTitle(activeTab, item)}`}><Trash2 size={16} /></button></div>
                </motion.article>
              ))}
            </AnimatePresence>
            {!filtered.length && <div className="cms-empty"><Search size={25} /><h3>No matching entries</h3><p>Try another search, or add a new {config.singular}.</p></div>}
          </div>
        </section>
      </section>

      <AnimatePresence>
        {editor && <div className="cms-modal-wrap" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditor(null); }}>
          <motion.section role="dialog" aria-modal="true" aria-labelledby="editor-title" className="cms-editor" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} transition={{ type: "spring", damping: 28, stiffness: 300 }}>
            <header><div><p className="eyebrow">Live content</p><h2 id="editor-title">{editor.item ? "Edit" : "Add"} {entityConfig[editor.entity].singular}</h2></div><button onClick={() => setEditor(null)} aria-label="Close editor"><X /></button></header>
            <form onSubmit={save}>
              <div className="cms-form-grid">
                {entityConfig[editor.entity].fields.map((field) => {
                  const raw = editor.item?.[field.name];
                  const value = Array.isArray(raw) ? raw.join(", ") : String(raw ?? "");
                  return <label key={field.name} className={field.full ? "full" : ""}><span>{field.label}{field.required && <b> *</b>}</span>{field.type === "textarea" ? <textarea name={field.name} defaultValue={value} required={field.required} rows={5} placeholder={field.placeholder} /> : field.type === "select" ? <select name={field.name} defaultValue={value || field.options?.[0]} required={field.required}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input name={field.name} type={field.type || "text"} defaultValue={value} required={field.required} placeholder={field.placeholder} />}{field.help && <small>{field.help}</small>}</label>;
                })}
              </div>
              <footer><p><i /> Changes appear on the public site immediately.</p><div><button type="button" className="cms-secondary-button" onClick={() => setEditor(null)}>Cancel</button><button className="cms-add-button" disabled={pending}>{pending ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />}{pending ? "Publishing…" : "Save & publish"}</button></div></footer>
            </form>
          </motion.section>
        </div>}

        {deleting && <div className="cms-modal-wrap centered" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleting(null); }}>
          <motion.section role="alertdialog" aria-modal="true" className="cms-confirm" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }}>
            <span className="cms-danger-icon"><Trash2 /></span><p className="eyebrow">Permanent action</p><h2>Delete “{itemTitle(deleting.entity, deleting.item)}”?</h2><p>This removes the entry from SQLite and the live portfolio. This action cannot be undone.</p><div><button className="cms-secondary-button" onClick={() => setDeleting(null)}>Keep entry</button><button className="cms-delete-button" onClick={remove} disabled={pending}>{pending ? "Deleting…" : "Delete permanently"}</button></div>
          </motion.section>
        </div>}

        {cvOpen && <div className="cms-modal-wrap centered" onMouseDown={(event) => { if (event.target === event.currentTarget) setCvOpen(false); }}>
          <motion.section role="dialog" aria-modal="true" className="cms-cv-modal" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <header><div><p className="eyebrow">Document manager</p><h2>Replace your CV</h2></div><button onClick={() => setCvOpen(false)} aria-label="Close CV manager"><X /></button></header>
            <div className="cms-current-doc"><FileBadge size={26} /><div><strong>cv.pdf</strong><span>Current public document</span></div><a href={`/cv.pdf?v=${data.cvVersion}`} target="_blank">Preview <ExternalLink size={14} /></a></div>
            <form onSubmit={uploadCv}>
              <label className="cms-file-drop"><Upload size={28} /><strong>{cvName || "Choose a new PDF"}</strong><span>PDF only · maximum 10 MB</span><input name="cv" type="file" accept="application/pdf,.pdf" required onChange={(event) => setCvName(event.target.files?.[0]?.name || "")} /></label>
              <p className="cms-upload-note">The new file atomically replaces the current document. Existing CV links will serve the new version.</p>
              <button className="cms-add-button w-full" disabled={pending}>{pending ? <LoaderCircle className="spin" size={17} /> : <Upload size={17} />}{pending ? "Uploading…" : "Upload & publish CV"}</button>
            </form>
          </motion.section>
        </div>}
      </AnimatePresence>

      <AnimatePresence>{toast && <motion.div className={`cms-toast ${toast.ok ? "success" : "error"}`} role="status" initial={{ opacity: 0, y: 20, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}>{toast.ok ? <Check size={18} /> : <X size={18} />}<span>{toast.message}</span><button onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={15} /></button></motion.div>}</AnimatePresence>
    </main>
  );
}

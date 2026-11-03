"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Download,
  FileText,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";
import { uploadCvAction } from "@/app/actions/cv";

export function CvModal({
  open,
  onClose,
  cvUrl,
  isAdmin,
}: {
  open: boolean;
  onClose: () => void;
  cvUrl: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [version, setVersion] = useState(cvUrl);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => setVersion(cvUrl), [cvUrl]);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 80);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  function upload(file: File | undefined) {
    if (!file) return;
    const formData = new FormData();
    formData.set("cv", file);
    setMessage("");
    startTransition(async () => {
      const result = await uploadCvAction(formData);
      setMessage(result.message);
      if (result.ok && result.version) {
        setVersion(`/cv.pdf?v=${encodeURIComponent(result.version)}`);
        router.refresh();
      }
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cv-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="cv-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-title"
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <header className="cv-header">
              <div className="cv-document-name">
                <span>
                  <FileText size={20} />
                </span>
                <div>
                  <p className="eyebrow">Curriculum vitae</p>
                  <h2 id="cv-title">Gradi Puata · 2026</h2>
                </div>
              </div>
              <div className="cv-actions">
                <a
                  href={version}
                  download="Gradi-Puata-CV.pdf"
                  className="cv-download"
                >
                  <Download size={17} />
                  <span>Download CV</span>
                </a>
                {isAdmin && (
                  <label className={`cv-upload ${pending ? "disabled" : ""}`}>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      disabled={pending}
                      onChange={(event) => {
                        upload(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                    {pending ? (
                      <LoaderCircle size={17} className="spin" />
                    ) : (
                      <Upload size={17} />
                    )}
                    <span>{pending ? "Uploading…" : "Upload new CV"}</span>
                  </label>
                )}
                <a
                  href={version}
                  target="_blank"
                  className="cv-open"
                  aria-label="Open PDF in a new tab"
                >
                  <ArrowUpRight size={18} />
                </a>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="cv-close"
                  aria-label="Close CV"
                >
                  <X size={20} />
                </button>
              </div>
            </header>
            {message && (
              <p className="cv-message" role="status">
                {message}
              </p>
            )}
            <div className="cv-viewer">
              <iframe
                key={version}
                src={`${version}#view=FitH&toolbar=1`}
                title="Gradi Puata's CV in PDF format"
              />
              <div className="cv-mobile-fallback">
                <FileText size={36} />
                <h3>View Gradi's CV</h3>
                <p>
                  Your browser can open the document in its built-in PDF viewer.
                </p>
                <a href={version} target="_blank">
                  Open PDF <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
            <footer className="cv-footer">
              <span>PDF document · Latest published version</span>
              <span>Press ESC to close</span>
            </footer>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

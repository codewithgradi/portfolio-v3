"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { ArrowDownToLine, ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "@/lib/profile";

const links = [
  { label: "About", href: "#about", number: "01" },
  { label: "Portfolio", href: "#work", number: "02" },
  { label: "Expertise", href: "#expertise", number: "03" },
  { label: "Experience", href: "#experience", number: "04" },
  { label: "Achievements", href: "#achievements", number: "05" },
  { label: "Contact", href: "#contact", number: "06" },
];

export function Navigation({ onOpenCv }: { onOpenCv: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        className={`site-header ${scrolled ? "is-scrolled" : ""}`}
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <a
          href="#home"
          className="site-logo"
          aria-label="Gradi Puata, back to top"
        >
          GP<span>®</span>
        </a>
        <div className="header-availability">
          <i />
          {profile.availability}
        </div>
        <div className="header-actions">
          <button className="header-cv" onClick={onOpenCv}>
            CV <ArrowDownToLine size={15} />
          </button>
          <button
            className="menu-pill"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
          >
            <span>Menu</span>
            <Menu size={18} />
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu-top">
              <a
                href="#home"
                className="site-logo light"
                onClick={() => setOpen(false)}
              >
                GP<span>®</span>
              </a>
              <p>Navigation / 2026</p>
              <button
                className="menu-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <span>Close</span>
                <X size={20} />
              </button>
            </div>
            <div className="menu-body">
              <nav className="menu-links">
                {links.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.18 + index * 0.055,
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <small>{link.number}</small>
                    <span>{link.label}</span>
                    <ArrowUpRight />
                  </motion.a>
                ))}
              </nav>
              <motion.aside
                className="menu-aside"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="eyebrow text-emerald-300">Start a conversation</p>
                <a href={`mailto:${profile.email}`}>
                  {profile.email}
                  <ArrowUpRight size={18} />
                </a>
                <p>{profile.location}</p>
                <button
                  onClick={() => {
                    setOpen(false);
                    onOpenCv();
                  }}
                >
                  <ArrowDownToLine size={17} /> View latest CV
                </button>
                <div>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                  <a href={profile.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </div>
              </motion.aside>
            </div>
            <div className="menu-footer">
              <span>Software engineering</span>
              <span>Product thinking</span>
              <span>Lasting systems</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

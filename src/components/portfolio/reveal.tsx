"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const reduceMotion = useReducedMotion();
  const offset = direction === "left" ? { x: 55, y: 0 } : direction === "right" ? { x: -55, y: 0 } : direction === "none" ? { x: 0, y: 0 } : { x: 0, y: 45 };
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, ...offset, clipPath: "inset(0 0 18% 0)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: reduceMotion ? 0.25 : 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LineReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <span className={`line-reveal ${className}`}>
      <motion.span
        initial={reduceMotion ? { opacity: 0 } : { y: "110%", rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >{children}</motion.span>
    </span>
  );
}

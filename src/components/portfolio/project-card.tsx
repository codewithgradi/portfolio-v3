"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Code2 } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.12, 1.03, 1.12],
  );

  return (
    <motion.article
      ref={ref}
      layout
      className={`project-card ${index % 2 ? "reverse" : ""}`}
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="project-media">
        <motion.img
          src={project.imageUrl}
          alt={`${project.title} product interface mockup`}
          loading={index > 1 ? "lazy" : "eager"}
          style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}
        />
        <div className="project-media-top">
          <span>Case study / {String(index + 1).padStart(2, "0")}</span>
          <span>{project.createdAt.slice(0, 4)}</span>
        </div>
        <a
          className="project-media-link"
          href={project.liveUrl || project.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title} live project`}
        >
          <ArrowUpRight />
        </a>
      </div>
      <div className="project-info">
        <div className="project-title-row">
          <div>
            <p>0{index + 1} / Selected work</p>
            <h3>{project.title}</h3>
          </div>
          <span className="project-dot" />
        </div>
        <p className="project-description">{project.description}</p>
        <div className="project-narrative">
          <div>
            <span>The problem</span>
            <p>{project.problem}</p>
          </div>
          <div>
            <span>The solution</span>
            <p>{project.solution}</p>
          </div>
        </div>
        <div className="project-tags">
          {project.techStack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="project-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              Live project <ArrowUpRight size={17} />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              <Code2 size={16} /> Codebase <ArrowUpRight size={15} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  achievements,
  certifications,
  education,
  experiences,
  projects,
  siteSettings,
  skills,
} from "@/db/schema";
import type { PortfolioData, Project } from "@/lib/types";

function parseTechStack(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

export function getPortfolioData(): PortfolioData {
  const projectRows = db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt))
    .all();
  const cvSetting = db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "cvUpdatedAt"))
    .get();

  return {
    projects: projectRows.map(
      (project): Project => ({
        ...project,
        techStack: parseTechStack(project.techStack),
      }),
    ),
    experiences: db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.order), desc(experiences.startDate))
      .all(),
    skills: db
      .select()
      .from(skills)
      .orderBy(asc(skills.category), asc(skills.name))
      .all(),
    certifications: db
      .select()
      .from(certifications)
      .orderBy(desc(certifications.dateIssued))
      .all(),
    achievements: db
      .select()
      .from(achievements)
      .orderBy(desc(achievements.date))
      .all(),
    education: db
      .select()
      .from(education)
      .orderBy(desc(education.startDate))
      .all(),
    cvVersion: cvSetting?.value || "1",
  };
}

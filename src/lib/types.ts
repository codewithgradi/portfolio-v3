import type {
  achievements,
  certifications,
  education,
  experiences,
  projects,
  skills,
} from "@/db/schema";

export type ProjectRecord = typeof projects.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type Education = typeof education.$inferSelect;

export type Project = Omit<ProjectRecord, "techStack"> & {
  techStack: string[];
};

export type PortfolioData = {
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  certifications: Certification[];
  achievements: Achievement[];
  education: Education[];
  cvVersion: string;
};

export type EntityType =
  | "projects"
  | "experiences"
  | "skills"
  | "certifications"
  | "achievements"
  | "education";

export type ActionResult = {
  ok: boolean;
  message: string;
};

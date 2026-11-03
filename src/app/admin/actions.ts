"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  achievements,
  certifications,
  education,
  experiences,
  projects,
  skills,
} from "@/db/schema";
import {
  createSession,
  destroySession,
  getSession,
  verifyCredentials,
} from "@/lib/auth";
import type { ActionResult, EntityType } from "@/lib/types";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function loginAction(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const now = Date.now();
  const attempt = attempts.get(username);

  if (attempt && attempt.resetAt > now && attempt.count >= 8) {
    return { ok: false, message: "Too many attempts. Try again in 15 minutes." };
  }
  if (!username || !password || username.length > 80 || password.length > 200) {
    return { ok: false, message: "Enter a valid username and password." };
  }

  if (!verifyCredentials(username, password)) {
    attempts.set(username, {
      count: attempt && attempt.resetAt > now ? attempt.count + 1 : 1,
      resetAt: now + 15 * 60 * 1000,
    });
    return { ok: false, message: "Those credentials do not match our records." };
  }

  attempts.delete(username);
  await createSession(username);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  revalidatePath("/admin");
  redirect("/admin");
}

function required(formData: FormData, key: string, maxLength = 5000) {
  const value = String(formData.get(key) || "").trim();
  if (!value) throw new Error(`${key} is required.`);
  if (value.length > maxLength) throw new Error(`${key} is too long.`);
  return value;
}

function optional(formData: FormData, key: string, maxLength = 5000) {
  const value = String(formData.get(key) || "").trim();
  if (value.length > maxLength) throw new Error(`${key} is too long.`);
  return value;
}

function link(formData: FormData, key: string, allowLocal = false) {
  const value = optional(formData, key, 1000);
  if (!value) return "";
  if (allowLocal && /^\/[a-zA-Z0-9_./-]+$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error("Invalid protocol");
    return url.toString();
  } catch {
    throw new Error(`${key} must be a valid ${allowLocal ? "URL or local path" : "http(s) URL"}.`);
  }
}

async function authorize() {
  const session = await getSession();
  if (!session) throw new Error("Your admin session has expired. Sign in again.");
}

function publish() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveContentAction(
  entity: EntityType,
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await authorize();
    const itemId = id || randomUUID();

    switch (entity) {
      case "projects": {
        const previous = id
          ? db.select().from(projects).where(eq(projects.id, id)).get()
          : undefined;
        const techStack = required(formData, "techStack", 1000)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 16);
        if (!techStack.length) throw new Error("Add at least one technology.");
        const values = {
          title: required(formData, "title", 160),
          description: required(formData, "description", 1200),
          problem: required(formData, "problem", 3000),
          solution: required(formData, "solution", 3000),
          techStack: JSON.stringify(techStack),
          githubUrl: link(formData, "githubUrl"),
          liveUrl: link(formData, "liveUrl"),
          imageUrl: link(formData, "imageUrl", true),
          createdAt: previous?.createdAt || new Date().toISOString(),
        };
        if (id) db.update(projects).set(values).where(eq(projects.id, id)).run();
        else db.insert(projects).values({ id: itemId, ...values }).run();
        break;
      }
      case "experiences": {
        const order = Number.parseInt(required(formData, "order", 4), 10);
        if (!Number.isFinite(order) || order < 0 || order > 999) {
          throw new Error("Order must be between 0 and 999.");
        }
        const values = {
          company: required(formData, "company", 180),
          role: required(formData, "role", 180),
          startDate: required(formData, "startDate", 40),
          endDate: required(formData, "endDate", 40),
          description: required(formData, "description", 5000),
          order,
        };
        if (id) db.update(experiences).set(values).where(eq(experiences.id, id)).run();
        else db.insert(experiences).values({ id: itemId, ...values }).run();
        break;
      }
      case "skills": {
        const values = {
          name: required(formData, "name", 120),
          category: required(formData, "category", 120),
          proficiencyLevel: required(formData, "proficiencyLevel", 60),
        };
        if (id) db.update(skills).set(values).where(eq(skills.id, id)).run();
        else db.insert(skills).values({ id: itemId, ...values }).run();
        break;
      }
      case "certifications": {
        const values = {
          title: required(formData, "title", 200),
          issuer: required(formData, "issuer", 180),
          dateIssued: required(formData, "dateIssued", 40),
          credentialUrl: link(formData, "credentialUrl"),
        };
        if (id) db.update(certifications).set(values).where(eq(certifications.id, id)).run();
        else db.insert(certifications).values({ id: itemId, ...values }).run();
        break;
      }
      case "achievements": {
        const values = {
          title: required(formData, "title", 200),
          description: required(formData, "description", 2500),
          date: required(formData, "date", 60),
          imageUrl: link(formData, "imageUrl", true),
        };
        if (id) db.update(achievements).set(values).where(eq(achievements.id, id)).run();
        else db.insert(achievements).values({ id: itemId, ...values }).run();
        break;
      }
      case "education": {
        const values = {
          institution: required(formData, "institution", 200),
          degree: required(formData, "degree", 220),
          startDate: required(formData, "startDate", 40),
          endDate: required(formData, "endDate", 40),
          description: required(formData, "description", 3000),
        };
        if (id) db.update(education).set(values).where(eq(education.id, id)).run();
        else db.insert(education).values({ id: itemId, ...values }).run();
        break;
      }
    }

    publish();
    return { ok: true, message: `${id ? "Changes" : "New entry"} published to the live portfolio.` };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unable to save this entry." };
  }
}

export async function deleteContentAction(
  entity: EntityType,
  id: string,
): Promise<ActionResult> {
  try {
    await authorize();
    if (!id) throw new Error("Missing entry ID.");
    switch (entity) {
      case "projects": db.delete(projects).where(eq(projects.id, id)).run(); break;
      case "experiences": db.delete(experiences).where(eq(experiences.id, id)).run(); break;
      case "skills": db.delete(skills).where(eq(skills.id, id)).run(); break;
      case "certifications": db.delete(certifications).where(eq(certifications.id, id)).run(); break;
      case "achievements": db.delete(achievements).where(eq(achievements.id, id)).run(); break;
      case "education": db.delete(education).where(eq(education.id, id)).run(); break;
    }
    publish();
    return { ok: true, message: "Entry deleted. The live portfolio is up to date." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unable to delete this entry." };
  }
}

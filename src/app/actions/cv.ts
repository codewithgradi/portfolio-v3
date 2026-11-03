"use server";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { getSession } from "@/lib/auth";
import type { ActionResult } from "@/lib/types";

const MAX_CV_SIZE = 10 * 1024 * 1024;

export async function uploadCvAction(
  formData: FormData,
): Promise<ActionResult & { version?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, message: "Your admin session has expired. Sign in again." };

  const file = formData.get("cv");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose a PDF file to upload." };
  }
  if (file.size > MAX_CV_SIZE) {
    return { ok: false, message: "The CV must be smaller than 10 MB." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length < 8 || bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return { ok: false, message: "The selected file is not a valid PDF." };
  }

  try {
    const publicDirectory = path.join(process.cwd(), "public");
    const destination = path.join(publicDirectory, "cv.pdf");
    const temporary = path.join(publicDirectory, `.cv-${Date.now()}.tmp`);
    await mkdir(publicDirectory, { recursive: true });
    await writeFile(temporary, bytes, { flag: "wx" });
    const written = await readFile(temporary);
    if (written.length !== bytes.length) throw new Error("Incomplete upload");
    await rename(temporary, destination);

    const version = new Date().toISOString();
    db.update(siteSettings)
      .set({ value: version })
      .where(eq(siteSettings.key, "cvUpdatedAt"))
      .run();
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, message: "CV published successfully.", version };
  } catch {
    return { ok: false, message: "The CV could not be saved. Check local storage permissions." };
  }
}

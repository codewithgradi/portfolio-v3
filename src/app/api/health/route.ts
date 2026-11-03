import { db } from "@/db";
import { projects } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    db.select({ id: projects.id }).from(projects).limit(1).get();
    return Response.json({ ok: true, database: "sqlite" });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

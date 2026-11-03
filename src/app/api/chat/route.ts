import { answerQuestion } from "@/lib/assistant";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: unknown };
    if (typeof body.message !== "string" || !body.message.trim()) {
      return Response.json({ error: "Please enter a question." }, { status: 400 });
    }
    if (body.message.length > 500) {
      return Response.json({ error: "Please keep your question under 500 characters." }, { status: 400 });
    }
    return Response.json(answerQuestion(body.message.slice(0, 500)));
  } catch {
    return Response.json({ error: "The assistant could not read that request." }, { status: 400 });
  }
}

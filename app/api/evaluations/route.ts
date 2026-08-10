import { desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { evaluations } from "../../../db/schema";
import { parseEvaluationInput } from "./validation";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });

  try {
    return Response.json({
      evaluations: await getDb()
        .select()
        .from(evaluations)
        .where(eq(evaluations.ownerId, user.id))
        .orderBy(desc(evaluations.id))
        .limit(50),
    });
  } catch {
    return Response.json({ error: "Unable to load evaluations" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });

  try {
    const body = parseEvaluationInput(await request.json());
    if (!body) return Response.json({ error: "Invalid evaluation" }, { status: 400 });
    const [evaluation] = await getDb()
      .insert(evaluations)
      .values({ ...body, ownerId: user.id })
      .returning();
    return Response.json({evaluation},{status:201});
  } catch { return Response.json({error:"Unable to save evaluation"},{status:503}); }
}

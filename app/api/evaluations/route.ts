import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { evaluations } from "../../../db/schema";

export async function GET() {
  try {
    return Response.json({ evaluations: await getDb().select().from(evaluations).orderBy(desc(evaluations.id)).limit(50) });
  } catch { return Response.json({ evaluations: [] }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {platform?:string;content?:string;score?:number;risk?:number};
    if (!body.platform || !body.content || typeof body.score !== "number" || typeof body.risk !== "number") return Response.json({error:"Invalid evaluation"},{status:400});
    const [evaluation] = await getDb().insert(evaluations).values({platform:body.platform,content:body.content.slice(0,20000),score:body.score,risk:body.risk}).returning();
    return Response.json({evaluation},{status:201});
  } catch (error) { return Response.json({error:error instanceof Error?error.message:"Unable to save"},{status:500}); }
}

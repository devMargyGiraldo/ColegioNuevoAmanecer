import { fetchScores } from "@/lib/data";

export async function GET() {
  const scores = await fetchScores();
  return Response.json(scores);
}

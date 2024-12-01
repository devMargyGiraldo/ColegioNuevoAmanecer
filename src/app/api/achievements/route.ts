import { fetchAchievements } from "@/lib/data";

export async function GET() {
  const achievements = await fetchAchievements();
  return Response.json(achievements);
}

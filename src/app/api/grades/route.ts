import { fetchGrades } from "@/lib/data";

export async function GET() {
  const grades = await fetchGrades();
  return Response.json(grades);
}

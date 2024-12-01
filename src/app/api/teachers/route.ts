import { fetchTeachers } from "@/lib/data";

export async function GET() {
  const teachers = await fetchTeachers();
  return Response.json(teachers);
}

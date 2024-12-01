import { fetchStudents } from "@/lib/data";

export async function GET() {
  const students = await fetchStudents();
  return Response.json(students);
}

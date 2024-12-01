import { fetchSubjects } from "@/lib/data";

export async function GET() {
  const subjects = await fetchSubjects();
  return Response.json(subjects);
}

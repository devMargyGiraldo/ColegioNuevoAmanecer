import { fetchPeriods } from "@/lib/data";

export async function GET() {
  const periods = await fetchPeriods();
  return Response.json(periods);
}

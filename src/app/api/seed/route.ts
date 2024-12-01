import { seed } from "@/seed";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  try {
    seed();
    return Response.json({ message: "Seed data inserted successfully!" });
  } catch (error) {
    return Response.json({ error: error });
  }
}

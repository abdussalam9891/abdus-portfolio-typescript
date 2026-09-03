import { NextResponse } from "next/server";
import { getVisits, incrementVisits } from "@/lib/views";

// The count changes on every visit, so there is nothing worth caching here —
// at any layer.
export const dynamic = "force-dynamic";

const NO_STORE = { "cache-control": "no-store" };

/** Read the total. Used by visitors already counted this session. */
export async function GET() {
  return NextResponse.json({ visits: await getVisits() }, { headers: NO_STORE });
}

/** Count this visit and read back the new total. */
export async function POST() {
  return NextResponse.json({ visits: await incrementVisits() }, { headers: NO_STORE });
}

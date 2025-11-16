import { NextResponse } from "next/server";

const token = process.env.VERCEL_ACCESS_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const teamId = process.env.VERCEL_TEAM_ID;
const fallback =
  process.env.NEXT_PUBLIC_VISITOR_COUNT &&
  !Number.isNaN(Number(process.env.NEXT_PUBLIC_VISITOR_COUNT))
    ? Number(process.env.NEXT_PUBLIC_VISITOR_COUNT)
    : 0;

export async function GET(request: Request) {
  if (!token || !projectId) {
    return NextResponse.json({ visitors: fallback, error: "Missing env" });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "all";

  const endpoint = new URL("https://api.vercel.com/v6/analytics/summary");
  endpoint.searchParams.set("projectId", projectId);
  endpoint.searchParams.set("period", period);
  if (teamId) endpoint.searchParams.set("teamId", teamId);

  try {
    const res = await fetch(endpoint.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({
        visitors: fallback,
        error: `Vercel analytics error: ${res.status} ${text}`,
      });
    }

    const data = await res.json();
    const visitors = data.totalVisitors ?? data.visitors ?? data.pageviews ?? fallback;
    return NextResponse.json({ visitors });
  } catch {
    return NextResponse.json({ visitors: fallback, error: "Failed to fetch Vercel analytics" });
  }
}

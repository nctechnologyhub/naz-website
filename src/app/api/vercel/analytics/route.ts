import { NextResponse } from "next/server";

const token = process.env.VERCEL_ACCESS_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const teamId = process.env.VERCEL_TEAM_ID;

export async function GET(request: Request) {
  if (!token || !projectId) {
    return NextResponse.json(
      { error: "Vercel analytics env vars are missing." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "7d";

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
      return NextResponse.json(
        { error: `Vercel analytics error: ${res.status} ${text}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const visitors = data.totalVisitors ?? data.visitors ?? data.pageviews ?? 0;
    return NextResponse.json({ visitors });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Vercel analytics" },
      { status: 500 }
    );
  }
}

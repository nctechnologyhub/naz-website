"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type Listing = {
  _id?: string;
  role: string;
  department: string;
  location: string;
  reportTo: string;
  jobStatus: string;
  requirements: string[];
  jobScope: string[];
};

const locationLabels: Record<string, string> = {
  "hq-puchong": "HQ – Puchong, Selangor",
  "branch-alor-setar": "Branch – Alor Setar, Kedah",
};

const jobStatusLabels: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  "contract": "Contract",
  internship: "Internship",
};

export default function CareerPage() {
  const careers = useQuery(api.careers.list, {});
  const isLoading = careers === undefined;

  const listings = useMemo(() => {
    if (!careers || careers.length === 0) {
      return [];
    }

    return careers.map((role) => ({
      _id: role._id,
      role: role.role,
      department: role.department,
      location: locationLabels[role.location] ?? role.location,
      reportTo: role.reportTo,
      jobStatus: role.jobStatus,
      requirements: role.requirements,
      jobScope: role.jobScope,
    }));
  }, [careers]);

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Careers
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Join a team modernizing healthcare supply chains.
        </h1>
        <p className="text-lg text-slate-600">
          Bring curiosity, rigor, and empathy—our team thrives on collaboration
          with hospital partners and technology squads.
        </p>
      </header>
      <section className="space-y-4">
        {isLoading &&
          [1, 2, 3].map((index) => (
            <div
              key={`career-skeleton-${index}`}
              className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded-full bg-emerald-100" />
                  <div className="h-3 w-56 animate-pulse rounded-full bg-emerald-50" />
                  <div className="h-3 w-32 animate-pulse rounded-full bg-emerald-50" />
                </div>
                <span className="h-5 w-20 animate-pulse rounded-full bg-emerald-100" />
              </div>
              <div className="h-4 w-24 animate-pulse rounded-full bg-emerald-100" />
            </div>
          ))}
        {listings.map((role) => {
          const detailHref = role._id ? `/career/${role._id}` : undefined;
          return (
            <div
              key={role._id ?? role.role}
              className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-emerald-700">
                    {role.role}
                  </p>
                  <p className="text-sm text-slate-500">
                    {role.department} · {role.location}
                  </p>
                  <p className="text-xs text-slate-400">Reports to {role.reportTo}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-700">
                  {jobStatusLabels[role.jobStatus] ?? "Open"}
                </span>
              </div>
              {detailHref ? (
                <Link
                  href={detailHref}
                  className="inline-flex items-center text-sm font-semibold text-emerald-700"
                >
                  View details →
                </Link>
              ) : (
                <span className="text-sm font-semibold text-slate-400">
                  Details coming soon
                </span>
              )}
            </div>
          );
        })}
        {!isLoading && listings.length === 0 && (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/70 p-6 text-center text-sm font-semibold text-emerald-800">
            Thank you for your interest in joining us, but we don't have any open position for now.
          </div>
        )}
      </section>
    </div>
  );
}

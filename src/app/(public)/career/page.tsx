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

const fallbackListings: Listing[] = [
  {
    role: "",
    department: "",
    location: "",
    reportTo: "",
    jobStatus: "",
    requirements: [],
    jobScope: [],
  },
];

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
  const careers = useQuery(api.careers.list, {}) ?? undefined;

  const listings = useMemo(() => {
    if (!careers || careers.length === 0) {
      return fallbackListings;
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
      </section>
    </div>
  );
}

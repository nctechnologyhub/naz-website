"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

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

export default function CareerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const careerId = id as Id<"careers">;
  const career = useQuery(api.careers.get, { id: careerId });

  if (career === undefined) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-16">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-full bg-emerald-100" />
          <div className="h-10 w-2/3 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-1/3 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-32 animate-pulse rounded-3xl bg-white shadow" />
      </div>
    );
  }

  if (!career) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Careers
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Role not found
        </h1>
        <p className="mt-2 text-slate-600">
          This posting may have been closed. Browse other openings on the main careers page.
        </p>
      </div>
    );
  }

  const location = locationLabels[career.location] ?? career.location;
  const statusLabel = jobStatusLabels[career.jobStatus] ?? "Open";

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Careers · {statusLabel}
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">{career.role}</h1>
        <p className="text-base text-slate-500">
          {career.department} · {location} · Reports to {career.reportTo}
        </p>
      </header>

      <section className="space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Requirements
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {career.requirements.map((req) => (
              <li key={req} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Job Scope
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {career.jobScope.map((scope) => (
              <li key={scope} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{scope}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">
        <p className="text-xl font-semibold text-emerald-900">How to Apply</p>
        <p className="text-sm text-emerald-900/80">
          Interested candidates are required to submit their application together with a passport-sized photograph (n.r) to:
        </p>
        <div className="rounded-2xl bg-emerald-700 p-6 text-sm text-white shadow">
          <p className="font-semibold">Human Resource Department</p>
          <p>N.A.Z. Medical Supplies Sdn Bhd (Headquarters)</p>
          <p>No 4, Jln BP 4/7 Bandar Bukit Puchong</p>
          <p>47120 Puchong, Selangor</p>
          <p className="mt-4">Telephone: 603-8060 0295 / 96 / 97 (Ext: 114)</p>
          <p>Fax: 603-8060 0318</p>
        </div>
        <p className="text-sm text-emerald-900/80">
          or email to
          <a href="mailto:hr@nazmedical.com.my" className="font-semibold text-emerald-900">
            {" "}hr@nazmedical.com.my
          </a>
          {" "}
          or
          <a href="mailto:info@nazmedical.com.my" className="font-semibold text-emerald-900">
            {" "}info@nazmedical.com.my
          </a>
        </p>
        <p className="text-sm font-semibold text-emerald-900">
          Only shortlisted candidates will be called for interview.
        </p>
      </section>
    </div>
  );
}

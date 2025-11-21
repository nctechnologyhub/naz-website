"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type CertificationCard = {
  _id?: string;
  issuer: string;
  standard: string;
  name: string;
  detail: string;
  attachmentUrl?: string;
};

export default function CertificationsPage() {
  const certifiedRecords = useQuery(api.certifications.list, {});
  const isLoading = certifiedRecords === undefined;

  const certificates: CertificationCard[] = useMemo(() => {
    if (!certifiedRecords || certifiedRecords.length === 0) {
      return [];
    }

    return certifiedRecords.map((cert) => ({
      _id: cert._id,
      issuer: cert.issuer,
      standard: cert.standard,
      name: cert.name,
      detail: cert.scope,
      attachmentUrl: cert.attachmentUrl ?? undefined,
    }));
  }, [certifiedRecords]);

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Certifications
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Compliance that meets global and local standards.
        </h1>
        <p className="text-lg text-slate-600">
          Review our certifications and request documentation packages for your
          internal audits.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {isLoading &&
          [1, 2, 3, 4].map((index) => (
            <div
              key={`cert-skeleton-${index}`}
              className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <div className="h-3 w-24 animate-pulse rounded-full bg-emerald-100" />
              <div className="mt-4 h-4 w-40 animate-pulse rounded-full bg-emerald-100" />
              <div className="mt-2 h-4 w-32 animate-pulse rounded-full bg-emerald-100" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full animate-pulse rounded-full bg-emerald-50" />
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-emerald-50" />
              </div>
              <div className="mt-5 h-3 w-28 animate-pulse rounded-full bg-emerald-100" />
            </div>
          ))}
        {certificates.map((cert) => (
          <div
            key={cert._id ?? cert.standard}
            className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              {cert.issuer}
            </p>
            <p className="mt-3 text-2xl font-semibold text-emerald-900">
              {cert.standard}
            </p>
            <p className="mt-1 text-base font-medium text-slate-900">
              {cert.name}
            </p>
            <p className="mt-2 text-sm text-slate-600">{cert.detail}</p>
            {cert.attachmentUrl ? (
              <a
                href={cert.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700"
              >
                View certificate ↗
              </a>
            ) : (
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-300">
                Attachment coming soon
              </span>
            )}
          </div>
        ))}
        {!isLoading && certificates.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/80 p-6 text-center text-sm font-semibold text-emerald-800">
            No record
          </div>
        )}
      </div>
    </div>
  );
}

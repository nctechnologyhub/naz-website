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

const fallbackCertificates: CertificationCard[] = [
  {
    issuer: "",
    standard: "",
    name: "",
    detail:
      "",
  }
];

export default function CertificationsPage() {
  const certifiedRecords =
    useQuery(api.certifications.list, {}) ?? undefined;

  const certificates: CertificationCard[] = useMemo(() => {
    if (!certifiedRecords || certifiedRecords.length === 0) {
      return fallbackCertificates;
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
      </div>
    </div>
  );
}

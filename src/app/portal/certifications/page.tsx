"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function PortalCertificationsPage() {
  const certifications = useQuery(api.certifications.list, {}) ?? [];
  const createCertification = useMutation(api.certifications.create);
  const generateUploadUrl = useMutation(
    api.certifications.generateUploadUrl
  );
  const removeCertification = useMutation(api.certifications.remove);
  const [formState, setFormState] = useState({
    issuer: "",
    name: "",
    standard: "",
    scope: "",
    issuedDate: new Date().toISOString().split("T")[0],
    expiredDate: new Date().toISOString().split("T")[0],
  });
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let attachmentStorageId: string | undefined;
    if (attachmentFile) {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": attachmentFile.type },
        body: attachmentFile,
      });
      const { storageId } = await response.json();
      attachmentStorageId = storageId;
    }

    await createCertification({
      ...formState,
      attachmentStorageId,
    });
    setFormState({
      issuer: "",
      name: "",
      standard: "",
      scope: "",
      issuedDate: new Date().toISOString().split("T")[0],
      expiredDate: new Date().toISOString().split("T")[0],
    });
    setAttachmentFile(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Certifications
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Compliance records
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <input
          type="text"
          placeholder="Certification Issuer"
          value={formState.issuer}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, issuer: event.target.value }))
          }
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          required
        />
        <input
          type="text"
          placeholder="Certification Name"
          value={formState.name}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, name: event.target.value }))
          }
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          required
        />
        <input
          type="text"
          placeholder="Certification Standard"
          value={formState.standard}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, standard: event.target.value }))
          }
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          required
        />
        <input
          type="text"
          placeholder="Scope"
          value={formState.scope}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, scope: event.target.value }))
          }
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          required
        />
        <label className="text-sm font-medium text-slate-700">
          Issued Date
          <input
            type="date"
            value={formState.issuedDate}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                issuedDate: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Expired Date
          <input
            type="date"
            value={formState.expiredDate}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                expiredDate: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </label>
        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Attachment (PDF/Image)
          </span>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const file = event.target.files?.[0];
              setAttachmentFile(file ?? null);
            }}
            className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 outline-none focus:border-emerald-500"
          />
          {attachmentFile && (
            <p className="mt-1 text-xs text-slate-500">
              {attachmentFile.name} ({Math.round(attachmentFile.size / 1024)} KB)
            </p>
          )}
        </label>
        <button
          type="submit"
          className="md:col-span-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200"
        >
          Add certification
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {certifications.map((cert) => (
          <div
            key={cert._id}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-emerald-600">{cert.issuer}</p>
            <p className="text-xl font-semibold text-slate-900">{cert.name}</p>
            <p className="text-sm text-slate-500">{cert.standard}</p>
            <p className="mt-2 text-sm text-slate-600">Scope: {cert.scope}</p>
            <p className="mt-2 text-xs text-slate-400">
              Issued {new Date(cert.issuedDate).toLocaleDateString()} · Expires{" "}
              {new Date(cert.expiredDate).toLocaleDateString()}
            </p>
            {cert.attachmentUrl && (
              <a
                href={cert.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center text-sm font-semibold text-emerald-700"
              >
                View attachment →
              </a>
            )}
            <button
              onClick={() => removeCertification({ id: cert._id })}
              className=" mt-4 px-4 text-xs font-semibold text-rose-600"
            >
              Remove
            </button>
          </div>
        ))}
        {certifications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/80 p-6 text-sm text-emerald-800">
            No certifications recorded yet. Use the form above to add them.
          </div>
        )}
      </div>
    </div>
  );
}

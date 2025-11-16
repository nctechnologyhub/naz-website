"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const locationOptions = [
  { label: "HQ - Puchong, Selangor", value: "hq-puchong" },
  { label: "Branch - Alor Setar, Kedah", value: "branch-alor-setar" },
];

const jobStatusOptions = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
];

export default function CareersPage() {
  const roles = useQuery(api.careers.list, {}) ?? [];
  const createRole = useMutation(api.careers.create);
  const updateStatus = useMutation(api.careers.updateStatus);
  const removeRole = useMutation(api.careers.remove);
  const [formState, setFormState] = useState({
    role: "",
    department: "",
    location: locationOptions[0].value,
    reportTo: "",
    jobStatus: jobStatusOptions[0].value,
    requirements: [""],
    jobScope: [""],
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requirements = formState.requirements
      .map((value) => value.trim())
      .filter(Boolean);
    const jobScope = formState.jobScope
      .map((value) => value.trim())
      .filter(Boolean);

    await createRole({
      role: formState.role,
      department: formState.department,
      location: formState.location,
      reportTo: formState.reportTo,
      jobStatus: formState.jobStatus as
        | "full-time"
        | "part-time"
        | "contract"
        | "internship",
      requirements,
      jobScope,
    });
    setFormState({
      role: "",
      department: "",
      location: locationOptions[0].value,
      reportTo: "",
      jobStatus: jobStatusOptions[0].value,
      requirements: [""],
      jobScope: [""],
    });
  }

  const locationLabel = useMemo(
    () =>
      Object.fromEntries(locationOptions.map((opt) => [opt.value, opt.label])),
    []
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Careers
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Open positions
        </h1>
        <p className="text-sm text-slate-500">
          Publish available roles and manage candidate pipeline.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Role title"
            value={formState.role}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, role: event.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
            required
          />
          <input
            type="text"
            placeholder="Department"
            value={formState.department}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                department: event.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
            required
          />
          <select
            value={formState.location}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, location: event.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          >
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Report to"
            value={formState.reportTo}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, reportTo: event.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
            required
          />
          <select
            value={formState.jobStatus}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, jobStatus: event.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          >
            {jobStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <BulletInput
            label="Requirements"
            items={formState.requirements}
            onChange={(items) =>
              setFormState((prev) => ({ ...prev, requirements: items }))
            }
          />
          <BulletInput
            label="Job Scope"
            items={formState.jobScope}
            onChange={(items) =>
              setFormState((prev) => ({ ...prev, jobScope: items }))
            }
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200"
          >
            Create Role
          </button>
        </div>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role._id}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xl font-semibold text-slate-900">
                  {role.role}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {role.department}
                </p>
                <p className="text-sm text-emerald-600">
                  {locationLabel[role.location] ?? role.location}
                </p>
                <p className="text-xs text-slate-500">Reports to {role.reportTo}</p>
                <p className="text-sm text-slate-500">
                  {new Date(role.createdAt).toLocaleDateString()}
                </p>
              </div>
              <select
                value={role.jobStatus}
                onChange={(event) =>
                  updateStatus({
                    id: role._id,
                    status: event.target.value as
                      | "full-time"
                      | "part-time"
                      | "contract"
                      | "internship",
                  })
                }
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {jobStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <RoleList title="Requirements" items={role.requirements} />
            <RoleList title="Job Scope" items={role.jobScope} />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => removeRole({ id: role._id })}
                className="text-xs font-semibold text-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {roles.length === 0 && (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/80 p-6 text-sm text-emerald-800">
            No roles published yet. Use the form above to create one.
          </div>
        )}
      </div>
    </div>
  );
}

function BulletInput({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const handleChange = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const addField = () => onChange([...items, ""]);
  const removeField = (index: number) =>
    onChange(items.filter((_, idx) => idx !== index));

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <div className="mt-3 space-y-3">
        {items.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(event) => handleChange(index, event.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder={`Item ${index + 1}`}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(index)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:border-rose-200 hover:text-rose-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addField}
        className="mt-3 text-xs font-semibold text-emerald-600 hover:underline"
      >
        + Add item
      </button>
    </div>
  );
}

function RoleList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

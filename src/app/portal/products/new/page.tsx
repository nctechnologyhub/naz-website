"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

const statuses = [
  { label: "Unhide", value: "visible" },
  { label: "Hide", value: "hidden" },
];

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useMutation(api.products.create);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const [formState, setFormState] = useState<{
    name: string;
    description: string;
    status: "visible" | "hidden";
  }>({
    name: "",
    description: "",
    status: "visible",
  });
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    let attachmentStorageId: string | undefined;
    if (attachmentFile) {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": attachmentFile.type },
        body: attachmentFile,
      });
      const json = await response.json();
      attachmentStorageId = json.storageId;
    }

    await createProduct({
      name: formState.name,
      description: formState.description,
      status: formState.status,
      attachmentStorageId,
    });
    router.push("/portal/products");
    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Products
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Add new product
        </h1>
        <p className="text-sm text-slate-500">
          Create a product entry. You can edit details later.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">
            Product Name
            <input
              type="text"
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, name: event.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Description
            <textarea
              value={formState.description}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              required
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Visibility
            <select
              value={formState.status}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  status: event.target.value as "visible" | "hidden",
                }))
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Attachment (PDF/Image)
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setAttachmentFile(event.target.files?.[0] ?? null)
              }
              className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 outline-none focus:border-emerald-500"
            />
            {attachmentFile && (
              <p className="mt-1 text-xs text-slate-500">
                {attachmentFile.name} (
                {Math.round(attachmentFile.size / 1024)} KB)
              </p>
            )}
          </label>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/portal/products")}
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { ChangeEvent, FormEvent, useEffect, useState, startTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const statuses = [
  { label: "Unhide", value: "visible" },
  { label: "Hide", value: "hidden" },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as Id<"products">;
  const product = useQuery(
    api.products.get,
    productId ? { id: productId } : "skip"
  );
  const updateProduct = useMutation(api.products.update);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    status: "visible" as "visible" | "hidden",
  });
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [removeAttachment, setRemoveAttachment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!product) return;
    startTransition(() => {
      setFormState({
        name: product.name,
        description: product.description,
        status: product.status,
      });
      setRemoveAttachment(false);
      setAttachmentFile(null);
    });
  }, [product]);

  const hasAttachment = Boolean(product?.attachmentUrl);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!productId) return;
    setIsSubmitting(true);

    let attachmentStorageId: string | undefined;
    if (attachmentFile) {
      const uploadUrl = await generateUploadUrl({});
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": attachmentFile.type },
        body: attachmentFile,
      });
      const json = await uploadResponse.json();
      attachmentStorageId = json.storageId;
    }

    await updateProduct({
      id: productId,
      name: formState.name,
      description: formState.description,
      status: formState.status,
      attachmentStorageId,
      removeAttachment: removeAttachment && !attachmentFile ? true : undefined,
    });

    router.push("/portal/products");
    setIsSubmitting(false);
  }

  if (product === undefined) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded-full bg-slate-200" />
        <div className="h-64 animate-pulse rounded-3xl bg-white shadow" />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Products
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Product not found
        </h1>
        <p className="text-slate-500">
          The item you are trying to edit does not exist or was removed.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Products
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Edit product
        </h1>
        <p className="text-sm text-slate-500">
          Update visibility, description, or supporting documents.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
      >
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
              setFormState((prev) => ({ ...prev, description: event.target.value }))
            }
            rows={4}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            required
          />
        </label>
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
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Attachment</p>
          {hasAttachment && !removeAttachment && (
            <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm">
              <a
                href={product.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-emerald-700"
              >
                View current file
              </a>
              <button
                type="button"
                onClick={() => setRemoveAttachment(true)}
                className="text-xs font-semibold text-rose-600"
              >
                Remove
              </button>
            </div>
          )}
          {removeAttachment && (
            <p className="text-xs text-rose-600">
              Attachment will be removed after saving unless you upload a new file.
            </p>
          )}
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setAttachmentFile(event.target.files?.[0] ?? null)
            }
            className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 outline-none focus:border-emerald-500"
          />
          {attachmentFile && (
            <p className="text-xs text-slate-500">
              {attachmentFile.name} ({Math.round(attachmentFile.size / 1024)} KB)
            </p>
          )}
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

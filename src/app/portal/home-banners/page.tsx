"use client";

import Image from "next/image";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function HomeBannersPage() {
  const banners = useQuery(api.homeBanners.list, {}) ?? [];
  const createBanner = useMutation(api.homeBanners.create);
  const removeBanner = useMutation(api.homeBanners.remove);
  const generateUploadUrl = useMutation(api.homeBanners.generateUploadUrl);

  const [formState, setFormState] = useState({
    title: "",
    subtitle: "",
    ctaLabel: "",
    ctaUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommendedCopy = useMemo(
    () =>
      "Upload 1600 x 900px JPG/PNG (max 5 MB). These assets power the public home page slider.",
    []
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please attach a banner image before publishing.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await response.json();

      await createBanner({
        title: formState.title,
        subtitle: formState.subtitle || undefined,
        ctaLabel: formState.ctaLabel || undefined,
        ctaUrl: formState.ctaUrl || undefined,
        storageId,
      });

      setFormState({ title: "", subtitle: "", ctaLabel: "", ctaUrl: "" });
      setSelectedFile(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: Id<"homeBanners">) {
    await removeBanner({ id });
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Home Banner
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Hero slider manager
        </h1>
        <p className="text-sm text-slate-500">
          {recommendedCopy}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Headline
            <input
              type="text"
              value={formState.title}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Life-saving supplies delivered on time"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Supporting copy
            <input
              type="text"
              value={formState.subtitle}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, subtitle: event.target.value }))
              }
              placeholder="Outline the promise for hospitals and clinics"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            CTA Label
            <input
              type="text"
              value={formState.ctaLabel}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, ctaLabel: event.target.value }))
              }
              placeholder="Browse Products"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            CTA URL
            <input
              type="url"
              value={formState.ctaUrl}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, ctaUrl: event.target.value }))
              }
              placeholder="https://nazmedical.com/products"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </label>
        </div>

        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-12 text-center text-sm text-emerald-800"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-base font-semibold text-emerald-900">
            Drag & drop banner image
          </span>
          <span className="mt-1 text-xs text-emerald-700">
            or click to browse files
          </span>
          <span className="mt-2 text-xs text-emerald-600">
            Recommended 1600 x 900px, JPG/PNG, under 5 MB
          </span>
          {selectedFile && (
            <p className="mt-3 text-xs text-emerald-900">
              {selectedFile.name} · {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
          {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? "Publishing..." : "Publish banner"}
        </button>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        {banners.map((banner) => (
          <article
            key={banner._id}
            className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
          >
            <div className="relative h-48 w-full">
              {banner.imageUrl ? (
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100 text-xs text-slate-500">
                  Image processing...
                </div>
              )}
            </div>
            <div className="space-y-2 px-5 py-4">
              <p className="text-sm font-semibold text-emerald-700">
                {new Date(banner.createdAt).toLocaleString()}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {banner.title}
              </p>
              {banner.subtitle && (
                <p className="text-sm text-slate-600">{banner.subtitle}</p>
              )}
              {banner.ctaLabel && banner.ctaUrl && (
                <a
                  href={banner.ctaUrl}
                  className="inline-flex items-center text-xs font-semibold text-emerald-700"
                  target="_blank"
                  rel="noreferrer"
                >
                  {banner.ctaLabel} ↗
                </a>
              )}
              <button
                onClick={() => handleDelete(banner._id)}
                className="text-xs px-4 font-semibold text-rose-600"
              >
                Remove banner
              </button>
            </div>
          </article>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-sm text-emerald-700">
          No banners yet. Publish at least one to populate the public home page slider.
        </div>
      )}
    </div>
  );
}

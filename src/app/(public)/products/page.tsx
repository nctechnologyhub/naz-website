"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function ProductsPage() {
  const products = useQuery(api.products.list, {});
  const isLoading = products === undefined;
  const visibleProducts = (products ?? []).filter((product) => product.status === "visible");
  const catalog = visibleProducts;

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Product Catalog
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          A curated inventory for each unit in your facility.
        </h1>
        <p className="text-lg text-slate-600">
          Configure packages by specialty, from general surgery to ambulatory care. Use the
          inquiry buttons to reach our product team instantly.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {isLoading &&
          [1, 2, 3, 4].map((index) => (
            <article
              key={`product-skeleton-${index}`}
              className="flex flex-col rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <div className="flex-1 space-y-3">
                <div className="h-4 w-40 animate-pulse rounded-full bg-emerald-100" />
                <div className="h-3 w-full animate-pulse rounded-full bg-emerald-50" />
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-emerald-50" />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="h-8 w-28 animate-pulse rounded-full bg-emerald-100" />
                <span className="h-8 w-32 animate-pulse rounded-full bg-emerald-50" />
              </div>
            </article>
          ))}
        {catalog.map((product) => {
          const subject = encodeURIComponent(`[PRODUCT INQUIRES] - ${product.name}`);
          const inquiryHref = `mailto:info@nazmedical.com.my?subject=${subject}`;
          return (
            <article
              key={product._id}
              className="flex flex-col rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <div className="flex-1 space-y-3">
                <p className="text-xl font-semibold text-emerald-700">{product.name}</p>
                <p className="text-sm text-slate-600">{product.description}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={inquiryHref}
                  className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow shadow-emerald-200"
                >
                  Add Inquiry
                </a>
                {product.attachmentUrl && (
                  <a
                    href={product.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-700"
                  >
                    View Attachment
                  </a>
                )}
              </div>
            </article>
          );
        })}
        {!isLoading && catalog.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/70 p-6 text-sm font-semibold text-emerald-800 text-center">
            No product to be displayed, come back later
          </div>
        )}
      </section>
    </div>
  );
}

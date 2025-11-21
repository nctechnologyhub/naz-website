"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function PortalProductsPage() {
  const products = useQuery(api.products.list, {}) ?? [];
  const removeProduct = useMutation(api.products.remove);

  async function handleDelete(id: Id<"products">) {
    await removeProduct({ id });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Products
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Catalog overview
          </h1>
        </div>
        <Link
          href="/portal/products/new"
          className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
        >
          Add Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] rounded-3xl border border-slate-100 bg-white text-left text-sm shadow-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Attachment</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-t border-slate-100 text-sm hover:bg-slate-50/50"
              >
                <td className="px-4 py-4 font-medium text-slate-900">
                  {product.name}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {product.description.slice(0, 80)}
                  {product.description.length > 80 ? "…" : ""}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.status === "visible"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {product.status === "visible" ? "Unhidden" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {product.attachmentUrl ? (
                    <a
                      href={product.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-600"
                    >
                      View File
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">No file</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-3 text-xs font-semibold">
                    <Link
                      href={`/portal/products/${product._id}`}
                      className="text-emerald-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No record
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

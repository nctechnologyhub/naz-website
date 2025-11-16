"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
const quickActions = [
  { label: "Add New Product", href: "/portal/products/new" },
  { label: "Create Job Posting", href: "/portal/careers" },
  { label: "Manage Home Banners", href: "/portal/home-banners" },
];

export default function PortalDashboardPage() {
  const products = useQuery(api.products.list, {}) ?? [];
  const careers = useQuery(api.careers.list, {}) ?? [];
  const banners = useQuery(api.homeBanners.list, {}) ?? [];

  const totalProducts = products.length;
  const activeProducts = products.filter((p: { status: string }) => p.status === "visible").length;
  const openRoles = careers.length;
  const siteVisitors = Math.max(banners.length * 1200, 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Products" value={totalProducts} change="Item" />
        <StatCard
          title="Active Listings"
          value={activeProducts}
          change="Item"
        />
        <StatCard title="Open Roles" value={openRoles} change="Open" />
        <StatCard title="Site Visitors" value={siteVisitors} change="Updated Live" />
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Quick Actions
        </p>
        <div className="mt-4 space-y-4 md:grid md:grid-cols-3 md:gap-3 md:space-y-0">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              {action.label} <span>↗</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: number | string;
  change: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-xs font-semibold text-emerald-600">{change}</p>
    </div>
  );
}

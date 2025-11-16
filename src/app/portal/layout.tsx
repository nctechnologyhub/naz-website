"use client";

import {
  UserButton,
  useOrganization,
  useUser,
  OrganizationSwitcher,
  useAuth,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const NAV_LINKS = [
  { label: "Dashboard", href: "/portal/dashboard" },
  { label: "Products", href: "/portal/products" },
  { label: "Home Banners", href: "/portal/home-banners" },
  { label: "Careers", href: "/portal/careers" },
  { label: "Certifications", href: "/portal/certifications" },
];

export default function PortalLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthRoute = pathname === "/portal/auth";

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  useEffect(() => {
    if (isAuthRoute) return;
    if (isSignedIn === false) {
      router.replace("/");
    }
  }, [isAuthRoute, isSignedIn, router]);

  if (!isAuthRoute && isSignedIn === false) {
    return null;
  }

  if (isAuthRoute) {
    return <div className="min-h-screen bg-[#F7FAF7]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F1F6F1]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-emerald-100 bg-white/95 px-4 py-6 shadow-xl transition-transform duration-300 lg:static lg:block lg:w-64 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/portal" className="text-lg font-semibold text-emerald-700">
          N.A.Z Medical Portal
        </Link>
        <nav className="mt-8 flex-1 space-y-1 text-sm font-medium text-slate-600">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/portal"
                ? pathname === "/portal"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={`flex items-center rounded-xl px-3 py-2 transition ${
                  isActive
                    ? "border-l-4 border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <MobileUserPanel />
      </aside>
      <div className="flex flex-1 flex-col">
        <PortalTopBar onToggleSidebar={openSidebar} />
        <div className="flex-1 space-y-8 bg-[#F7FAF7] px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function PortalTopBar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { organization } = useOrganization();
  const syncUser = useMutation(api.users.syncFromClerk);
  const syncOrganization = useMutation(api.organizations.syncFromClerk);
  const authReady = isLoaded && isSignedIn;

  const userId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const fullName = user?.fullName ?? user?.username ?? "NAZ Staff";

  useEffect(() => {
    if (!authReady || !userId) return;
    void syncUser({
      clerkUserId: userId,
      email,
      fullName,
      clerkOrganizationId: organization?.id ?? undefined,
    }).catch(() => {});
  }, [authReady, email, fullName, organization?.id, syncUser, userId]);

  useEffect(() => {
    if (!organization?.id) return;
    void syncOrganization({
      clerkOrganizationId: organization.id,
      name: organization.name ?? "NAZ Medical",
      slug: organization.slug ?? undefined,
      clerkCreatedBy: user?.id ?? undefined,
    }).catch(() => {});
  }, [organization?.id, organization?.name, organization?.slug, syncOrganization, user?.id]);

  if (!authReady) {
    return (
      <div className="border-b border-emerald-100 bg-white/80 px-4 py-4 shadow-sm md:px-8">
        <div className="h-6 w-48 animate-pulse rounded-full bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 border-b border-emerald-100 bg-white/80 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 lg:hidden"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="space-y-1">
            <span className="block h-0.5 w-5 bg-current"></span>
            <span className="block h-0.5 w-5 bg-current"></span>
            <span className="block h-0.5 w-5 bg-current"></span>
          </span>
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Staff Portal
          </p>
          <p className="text-lg font-semibold text-slate-900">
            Manage operations, catalogs & users
          </p>
        </div>
      </div>
      <div className="hidden gap-2 lg:flex">
        <OrganizationSwitcher />
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
          <span className="text-sm text-slate-700">{user?.fullName}</span>
          <UserButton/>
        </div>
      </div>
    </div>
  );
}

function MobileUserPanel() {
  const { user } = useUser();
  const { organization } = useOrganization();

  if (!user) return null;

  return (
    <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 lg:hidden">
      <OrganizationSwitcher />
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <p className="font-semibold text-slate-900">{user.fullName}</p>
        <p className="text-xs text-slate-500">
          {organization?.name ?? "NAZ Medical"}
        </p>
      </div>
      <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <UserButton />
        <span className="text-sm text-slate-700">{user.fullName}</span>
      </div>
    </div>
  );
}

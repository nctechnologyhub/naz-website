"use client";

import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useMutation } from "convex/react";
import { ReactNode, useEffect, useMemo } from "react";
import { api } from "../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexJwtTemplate =
  process.env.NEXT_PUBLIC_CLERK_CONVEX_TEMPLATE ?? "convex";

if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not set. Please configure Convex before running the app."
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const { getToken, isLoaded } = useAuth();

  const convex = useMemo(() => new ConvexReactClient(convexUrl!), []);

  useEffect(() => {
    if (!isLoaded || !getToken) return;

    const fetchToken = async () => {
      try {
        return await getToken({ template: convexJwtTemplate });
      } catch {
        return null;
      }
    };

    void convex.setAuth(fetchToken);
  }, [convex, getToken, isLoaded]);

  return (
    <ConvexProvider client={convex}>
      <ClerkConvexSync />
      {children}
    </ConvexProvider>
  );
}

function ClerkConvexSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { organization } = useOrganization();
  const syncUser = useMutation(api.users.syncFromClerk);
  const syncOrganization = useMutation(api.organizations.syncFromClerk);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    void syncUser({
      clerkUserId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? "",
      fullName: user.fullName ?? user.username ?? "NAZ Staff",
      clerkOrganizationId: organization?.id ?? undefined,
    }).catch(() => {});
  }, [isLoaded, isSignedIn, organization?.id, syncUser, user]);

  useEffect(() => {
    if (!organization?.id || !organization.name) return;
    void syncOrganization({
      clerkOrganizationId: organization.id,
      name: organization.name,
      slug: organization.slug ?? undefined,
      clerkCreatedBy: user?.id ?? undefined,
    }).catch(() => {});
  }, [organization?.id, organization?.name, organization?.slug, syncOrganization, user?.id]);

  return null;
}

"use client";

import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient, useMutation, useConvexConnectionState } from "convex/react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
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
  const { getToken, isLoaded, userId } = useAuth();
  const [authReady, setAuthReady] = useState(false);

  const convex = useMemo(
    () => new ConvexReactClient(convexUrl!),
    []
  );

  useEffect(() => {
    if (!isLoaded) {
      setAuthReady(false);
      return;
    }

    if (!getToken || !userId) {
      convex.clearAuth();
      setAuthReady(false);
      return;
    }

    // Set auth and track when it's ready
    convex.setAuth(
      async () => {
        try {
          const token = await getToken({ template: convexJwtTemplate });
          if (token) {
            console.log("✓ Convex auth token obtained");
            setAuthReady(true);
          } else {
            console.warn("⚠ No Convex auth token available");
            setAuthReady(false);
          }
          return token;
        } catch (error) {
          console.error("✗ Failed to get Convex auth token:", error);
          setAuthReady(false);
          return null;
        }
      },
      (isAuthenticated) => {
        console.log("Convex auth status changed:", isAuthenticated);
        setAuthReady(isAuthenticated);
      }
    );
  }, [convex, getToken, isLoaded, userId]);

  return (
    <ConvexProvider client={convex}>
      <ClerkConvexSync authReady={authReady} />
      {children}
    </ConvexProvider>
  );
}

function ClerkConvexSync({ authReady }: { authReady: boolean }) {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { isLoaded: orgLoaded, organization } = useOrganization();
  const syncUser = useMutation(api.users.syncFromClerk);
  const syncOrganization = useMutation(api.organizations.syncFromClerk);
  const connectionState = useConvexConnectionState();
  const syncInProgress = useRef(false);
  const lastSyncedState = useRef<string | null>(null);

  const isLoaded = userLoaded && orgLoaded;
  
  // Check if Convex is ready for mutations
  // We need authReady (token obtained) - mutations will queue if WebSocket isn't ready yet
  // But we should wait a bit for the connection to establish if it hasn't connected yet
  const isConvexReady = authReady && (connectionState.isWebSocketConnected || connectionState.hasEverConnected);

  // Unified sync effect: syncs organization first, then user
  // This ensures data in Clerk is always synced to Convex
  useEffect(() => {
    // Wait for everything to load
    if (!isLoaded) {
      console.log("⏳ Waiting for Clerk to load...");
      return;
    }
    
    // Wait for Convex to be authenticated
    // Once we have the token, mutations can proceed (they'll queue if WebSocket isn't ready)
    if (!authReady) {
      console.log("⏳ Waiting for Convex auth token...");
      return;
    }

    // Log connection state but proceed anyway - mutations will queue
    if (!connectionState.isWebSocketConnected) {
      console.log("⚠ WebSocket not connected yet, but proceeding - mutations will queue", {
        isWebSocketConnected: connectionState.isWebSocketConnected,
        hasEverConnected: connectionState.hasEverConnected,
      });
    }
    
    // Reset sync state when signed out
    if (!isSignedIn) {
      syncInProgress.current = false;
      lastSyncedState.current = null;
      return;
    }

    // Need user to sync
    if (!user) {
      console.log("⏳ Waiting for user data...");
      return;
    }

    // Create a unique key for this sync state
    const orgKey = organization?.id ? `${organization.id}-${organization.name}` : "no-org";
    const userKey = `${user.id}-${user.primaryEmailAddress?.emailAddress ?? ""}-${user.fullName ?? user.username ?? ""}`;
    const syncKey = `${orgKey}-${userKey}`;

    // Skip if we've already synced this exact state
    if (lastSyncedState.current === syncKey) return;

    // Prevent duplicate syncs
    if (syncInProgress.current) return;

    // Mark sync as in progress and update state
    syncInProgress.current = true;
    lastSyncedState.current = syncKey;

    const performSync = async () => {
      try {
        console.log("🔄 Starting sync to Convex...", {
          userId: user.id,
          orgId: organization?.id,
          connectionState: {
            isWebSocketConnected: connectionState.isWebSocketConnected,
            hasEverConnected: connectionState.hasEverConnected,
          },
        });

        // Give a small delay for connection to establish if it hasn't yet
        if (!connectionState.isWebSocketConnected && !connectionState.hasEverConnected) {
          console.log("⏳ Waiting briefly for connection to establish...");
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Step 1: Sync organization FIRST if it exists in Clerk
        if (organization?.id && organization.name) {
          console.log("🔄 Syncing organization...", organization.name);
          const orgResult = await syncOrganization({
            clerkOrganizationId: organization.id,
            name: organization.name,
            slug: organization.slug ?? undefined,
            clerkCreatedBy: user.id ?? undefined,
          });
          console.log("✓ Organization synced to Convex:", organization.name, "ID:", orgResult);
        }

        // Step 2: Sync user (will link to org if it exists)
        console.log("🔄 Syncing user...", user.id);
        const userResult = await syncUser({
          clerkUserId: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          fullName: user.fullName ?? user.username ?? "NAZ Staff",
          clerkOrganizationId: organization?.id ?? undefined,
        });
        console.log("✓ User synced to Convex:", user.id, "ID:", userResult);
        console.log("✅ Sync completed successfully!");

        // Sync completed successfully
        syncInProgress.current = false;
      } catch (error) {
        console.error("✗ Sync failed:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // Reset to allow retry
        syncInProgress.current = false;
        lastSyncedState.current = null;
      }
    };

    // Perform the sync
    void performSync();
  }, [
    isLoaded,
    authReady,
    isSignedIn,
    user?.id,
    user?.primaryEmailAddress?.emailAddress,
    user?.fullName,
    user?.username,
    organization?.id,
    organization?.name,
    organization?.slug,
    syncUser,
    syncOrganization,
    connectionState.isWebSocketConnected,
    connectionState.hasEverConnected,
  ]);

  return null;
}

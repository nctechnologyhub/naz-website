import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const DEFAULT_ORG = {
  name: "NAZ Medical",
  slug: "naz-medical",
};

export const ensureDefault = mutation({
  args: {},
  handler: async (ctx) => {
    const defaultOrgId = await ensureDefaultOrganizationId(ctx);
    return await ctx.db.get(defaultOrgId);
  },
});

export const getActiveForUser = query({
  args: {
    clerkOrganizationId: v.optional(v.string()),
    clerkUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.clerkOrganizationId) {
      const orgFromClerk = await ctx.db
        .query("organizations")
        .withIndex("by_clerk_org", (q) =>
          q.eq("clerkOrganizationId", args.clerkOrganizationId!)
        )
        .unique();
      if (orgFromClerk) {
        return orgFromClerk;
      }
    }

    if (args.clerkUserId) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_user", (q) =>
          q.eq("clerkUserId", args.clerkUserId!)
        )
        .unique();
      if (user) {
        if (user.organizationId) {
          return await ctx.db.get(user.organizationId);
        }
        return await getDefaultOrganization(ctx);
      }
    }

    return await getDefaultOrganization(ctx);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("organizations").collect();
  },
});

export const syncFromClerk = mutation({
  args: {
    clerkOrganizationId: v.string(),
    name: v.string(),
    slug: v.optional(v.string()),
    clerkCreatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org", (q) =>
        q.eq("clerkOrganizationId", args.clerkOrganizationId)
      )
      .unique();

    const fields = {
      name: args.name,
      slug: args.slug ?? args.clerkOrganizationId,
      clerkOrganizationId: args.clerkOrganizationId,
      createdByClerkUserId: args.clerkCreatedBy,
    };

    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return existing._id;
    }

    const creator = args.clerkCreatedBy
      ? await ctx.db
          .query("users")
          .withIndex("by_clerk_user", (q) =>
            q.eq("clerkUserId", args.clerkCreatedBy!)
          )
          .unique()
      : null;

    return await ctx.db.insert("organizations", {
      ...fields,
      createdAt: Date.now(),
      createdByUserId: creator?._id,
    });
  },
});

export async function ensureDefaultOrganizationId(
  ctx: MutationCtx
): Promise<Id<"organizations">> {
  const existing = await ctx.db
    .query("organizations")
    .withIndex("by_slug", (q) => q.eq("slug", DEFAULT_ORG.slug))
    .unique();

  if (existing?._id) {
    return existing._id;
  }

  return await ctx.db.insert("organizations", {
    ...DEFAULT_ORG,
    createdAt: Date.now(),
    createdByUserId: undefined,
    clerkOrganizationId: undefined,
    createdByClerkUserId: undefined,
  });
}

export async function getDefaultOrganization(ctx: QueryCtx) {
  return await ctx.db
    .query("organizations")
    .withIndex("by_slug", (q) => q.eq("slug", DEFAULT_ORG.slug))
    .unique();
}

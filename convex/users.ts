import { mutation, query, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { ensureDefaultOrganizationId } from "./organizations";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return await Promise.all(
      users.map(async (user) => {
        const organization = user.organizationId
          ? await ctx.db.get(user.organizationId)
          : null;
        return {
          ...user,
          organizationName: organization?.name ?? "NAZ Medical",
        };
      })
    );
  },
});

export const syncFromClerk = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    fullName: v.string(),
    clerkOrganizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let organizationId = await lookupOrganizationId(ctx, args.clerkOrganizationId);
    if (!organizationId) {
      organizationId = await ensureDefaultOrganizationId(ctx);
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    const baseUser = {
      clerkUserId: args.clerkUserId,
      email: args.email,
      fullName: args.fullName,
      organizationId,
    };

    if (existing) {
      await ctx.db.patch(existing._id, baseUser);
      return existing._id;
    }

    return await ctx.db.insert("users", {
      ...baseUser,
      createdAt: Date.now(),
    });
  },
});

async function lookupOrganizationId(
  ctx: MutationCtx,
  clerkOrganizationId?: string | null
) {
  if (!clerkOrganizationId) return null;
  const org = await ctx.db
    .query("organizations")
    .withIndex("by_clerk_org", (q) => q.eq("clerkOrganizationId", clerkOrganizationId))
    .unique();
  return org?._id ?? null;
}

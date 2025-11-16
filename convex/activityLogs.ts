import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ensureDefaultOrganizationId } from "./organizations";

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    return await ctx.db
      .query("activityLogs")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("activityLogs")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

export const log = mutation({
  args: {
    type: v.string(),
    message: v.string(),
    actorUserId: v.optional(v.id("users")),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const organizationId =
      args.organizationId ?? (await ensureDefaultOrganizationId(ctx));
    await ctx.db.insert("activityLogs", {
      type: args.type,
      message: args.message,
      actorUserId: args.actorUserId,
      organizationId,
      createdAt: Date.now(),
    });
  },
});

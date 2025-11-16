import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ensureDefaultOrganizationId } from "./organizations";

const statusValidator = v.union(
  v.literal("full-time"),
  v.literal("part-time"),
  v.literal("contract"),
  v.literal("internship")
);

export const list = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    if (args.organizationId) {
      return await ctx.db
        .query("careers")
        .withIndex("by_org", (q) =>
          q.eq("organizationId", args.organizationId!)
        )
        .collect();
    }

    return await ctx.db.query("careers").collect();
  },
});

export const get = query({
  args: { id: v.id("careers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    role: v.string(),
    department: v.string(),
    location: v.string(),
    reportTo: v.string(),
    jobStatus: v.string(),
    requirements: v.array(v.string()),
    jobScope: v.array(v.string()),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const organizationId =
      args.organizationId ?? (await ensureDefaultOrganizationId(ctx));
    return await ctx.db.insert("careers", {
      role: args.role,
      department: args.department,
      location: args.location,
      reportTo: args.reportTo,
      jobStatus: args.jobStatus,
      requirements: args.requirements,
      jobScope: args.jobScope,
      organizationId,
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("careers"),
    status: statusValidator,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { jobStatus: args.status as "active" | "inactive" });
  },
});

export const remove = mutation({
  args: { id: v.id("careers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

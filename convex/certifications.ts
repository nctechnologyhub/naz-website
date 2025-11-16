import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ensureDefaultOrganizationId } from "./organizations";

export const list = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const baseQuery = args.organizationId
      ? ctx.db
          .query("certifications")
          .withIndex("by_org", (q) =>
            q.eq("organizationId", args.organizationId!)
          )
      : ctx.db.query("certifications");

    const docs = await baseQuery.collect();

    return await Promise.all(
      docs.map(async (doc) => {
        const attachmentUrl = doc.attachmentStorageId
          ? await ctx.storage.getUrl(doc.attachmentStorageId)
          : undefined;
        return { ...doc, attachmentUrl };
      })
    );
  },
});

export const create = mutation({
  args: {
    issuer: v.string(),
    name: v.string(),
    standard: v.string(),
    scope: v.string(),
    issuedDate: v.string(),
    expiredDate: v.string(),
    attachmentStorageId: v.optional(v.id("_storage")),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const organizationId =
      args.organizationId ?? (await ensureDefaultOrganizationId(ctx));
    return await ctx.db.insert("certifications", {
      issuer: args.issuer,
      name: args.name,
      standard: args.standard,
      scope: args.scope,
      issuedDate: args.issuedDate,
      expiredDate: args.expiredDate,
      attachmentStorageId: args.attachmentStorageId,
      organizationId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("certifications") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (doc?.attachmentStorageId) {
      await ctx.storage.delete(doc.attachmentStorageId);
    }
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
